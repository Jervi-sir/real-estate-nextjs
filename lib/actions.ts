"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { properties, users, passwordResetTokens } from "@/lib/db/schema";
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
    status: z.enum(["PENDING", "DRAFT"]).optional(),
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

    const { title, description, price, address, imageUrls, status } = parsed.data;

    await db.insert(properties).values({
        title,
        description,
        price,
        address,
        imageUrls,
        userId: session.user.id!,
        status: status || "PENDING",
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function updateProperty(id: number, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const parsed = propertySchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { error: "Invalid data" };

    const { title, description, price, address, imageUrls, status } = parsed.data;

    const property = await db.query.properties.findFirst({
        where: eq(properties.id, id),
    });

    if (!property) return { error: "Property not found" };

    if (property.userId !== session.user.id && session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    // If user is editing, and not admin, and status is changing to something valid (DRAFT/PENDING)
    // If admin, they might be using a different form, but here for general edit:
    // We default to PENDING if not specified, OR keep DRAFT if it was DRAFT and they saved as DRAFT?
    // Actually, if we use the buttons logic, 'status' will be in FormData.

    const newStatus = status || (property.status === "DRAFT" ? "DRAFT" : "PENDING");
    // If it was APPROVED, and they edit, it goes back to PENDING unless they explicitly save as DRAFT.

    await db
        .update(properties)
        .set({
            title,
            description,
            price,
            address,
            imageUrls,
            status: newStatus as "PENDING" | "DRAFT" | "APPROVED" | "REJECTED", // Cast for safety or expand schema if Admin edits here
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

export async function approveProperty(id?: number) {
    if (!id) return null;
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

export async function deleteUser(id: string) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" };

    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/admin/users");
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



export async function forgotPassword(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) return { error: "Email required" };

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        // Did not find user, but for security we usually don't reveal this.
        // However, generic "If email exists, we sent a link" is better.
        return { success: "If an account exists, a reset link has been sent." };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Delete existing tokens
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email));

    await db.insert(passwordResetTokens).values({
        email,
        token,
        expiresAt,
    });

    // Simulate sending email
    console.log(`Reset Link: http://localhost:3000/reset-password?token=${token}`);

    return { success: "If an account exists, a reset link has been sent." };
}

export async function resetPassword(formData: FormData) {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token || !password || !confirmPassword) {
        return { error: "Missing fields" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    const existingToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.token, token),
    });

    if (!existingToken) {
        return { error: "Invalid or expired token" };
    }

    if (existingToken.expiresAt < new Date()) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
        return { error: "Token expired" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.update(users)
        .set({ password: hashedPassword, passwordPlaintext: password }) // Keeping plaintext for demo purposes as per existing code
        .where(eq(users.email, existingToken.email));

    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));

    redirect("/login?success=PasswordReset");
}

export async function contactAgent(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const propertyId = formData.get("propertyId");

    if (!name || !email || !message || !propertyId) {
        return { error: "Missing fields" };
    }

    // Simulate email sending
    console.log(`Email from ${name} (${email}) regarding property ${propertyId}: ${message}`);

    // In a real app, you would use Resend, SendGrid, etc.
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
}
