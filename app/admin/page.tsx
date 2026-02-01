import { PropertiesTable } from "./properties-table";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    const allProperties = await db.select().from(properties).orderBy(desc(properties.createdAt));

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage and moderate property listings.</p>
                </div>
            </div>
            <PropertiesTable properties={allProperties} />
        </div>
    );
}
