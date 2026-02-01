import { PropertyForm } from "@/components/property-form";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) notFound();

    const session = await auth();
    if (!session?.user) redirect("/login");

    const property = await db.query.properties.findFirst({
        where: eq(properties.id, id),
    });

    if (!property) notFound();

    if (property.userId !== session.user.id && session.user.role !== "ADMIN") {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
            <PropertyForm property={property} />
        </div>
    );
}
