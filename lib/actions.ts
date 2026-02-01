"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { properties, users } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const propertySchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(0),
    address: z.string().min(1),
    imageUrls: z.string().transform((str) => str.split(",").map((s) => s.trim())),
});

const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function createProperty(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const parsed = propertySchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { error: "Invalid data" };

    const { title, description, price, address, imageUrls } = parsed.data;

    await db.insert(properties).values({
        title,
        description,
        price,
        address,
        imageUrls,
        userId: session.user.id!,
        status: "PENDING",
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function updateProperty(id: number, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const parsed = propertySchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { error: "Invalid data" };

    const { title, description, price, address, imageUrls } = parsed.data;

    const property = await db.query.properties.findFirst({
        where: eq(properties.id, id),
    });

    if (!property) return { error: "Property not found" };

    if (property.userId !== session.user.id && session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    await db
        .update(properties)
        .set({
            title,
            description,
            price,
            address,
            imageUrls,
            status: "PENDING",
            updatedAt: new Date(),
        })
        .where(eq(properties.id, id));

    revalidatePath("/dashboard");
    revalidatePath(`/properties/${id}`);
    revalidatePath("/admin");
}

export async function deleteProperty(id: number) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const property = await db.query.properties.findFirst({
        where: eq(properties.id, id),
    });

    if (!property) return { error: "Property not found" };

    if (property.userId !== session.user.id && session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    await db.delete(properties).where(eq(properties.id, id));
    revalidatePath("/dashboard");
    revalidatePath("/admin");
}

export async function approveProperty(id: number) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" };

    await db.update(properties).set({ status: "APPROVED" }).where(eq(properties.id, id));
    revalidatePath("/admin");
}

export async function rejectProperty(id: number) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" };

    await db.update(properties).set({ status: "REJECTED" }).where(eq(properties.id, id));
    revalidatePath("/admin");
}

export async function register(formData: FormData) {
    const parsed = registerSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) return { error: "Invalid data" };

    const { name, email, password } = parsed.data;

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) return { error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        passwordPlaintext: password,
        role: "USER",
    });

    redirect("/login");
}
