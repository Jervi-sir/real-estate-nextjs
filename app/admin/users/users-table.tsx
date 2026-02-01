"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUser } from "@/lib/actions";
import { useTransition } from "react";
import type { User } from "@/lib/db/schema";

export function UsersTable({ users }: { users: User[] }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={isPending || user.role === "ADMIN"}
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this user?")) {
                                                startTransition(() => {
                                                    deleteUser(user.id);
                                                });
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
