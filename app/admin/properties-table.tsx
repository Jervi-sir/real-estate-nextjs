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
import { approveProperty, rejectProperty, deleteProperty } from "@/lib/actions";
import { useTransition } from "react";
import type { Property } from "@/lib/db/schema";

export function PropertiesTable({ properties }: { properties: Property[] }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner ID</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {properties.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No properties found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        properties.map((property) => (
                            <TableRow key={property.id}>
                                <TableCell className="font-medium">{property.title}</TableCell>
                                <TableCell>${property.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={property.status === "APPROVED" ? "default" : property.status === "REJECTED" ? "destructive" : "secondary"}>
                                        {property.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{property.userId}</TableCell>
                                <TableCell className="space-x-2">
                                    {property.status === "PENDING" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending}
                                                onClick={() => startTransition(() => approveProperty(property?.id) as any)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={isPending}
                                                onClick={() => startTransition(() => rejectProperty(property.id) as any)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={isPending}
                                        onClick={() => startTransition(() => deleteProperty(property.id) as any)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
        </div>
    );
}
