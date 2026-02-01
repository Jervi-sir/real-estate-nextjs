import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPropertiesTable } from "./user-properties-table";

export default async function Dashboard() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const userProperties = await db.query.properties.findMany({
        where: eq(properties.userId, session.user.id!),
        orderBy: [desc(properties.createdAt)],
    });

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-muted-foreground">Manage your real estate listings.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/new">Create New Listing</Link>
                </Button>
            </div>
            <UserPropertiesTable properties={userProperties} />
        </div>
    );
}
