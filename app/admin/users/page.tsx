import { UsersTable } from "./users-table";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        redirect("/");
    }

    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">View and manage registered users.</p>
                </div>
            </div>
            <UsersTable users={allUsers} />
        </div>
    );
}
