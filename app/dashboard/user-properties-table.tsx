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
import { deleteProperty } from "@/lib/actions";
import { useTransition } from "react";
import type { Property } from "@/lib/db/schema";
import Link from "next/link";

export function UserPropertiesTable({ properties }: { properties: Property[] }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {properties.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                You haven't listed any properties yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        properties.map((property) => (
                            <TableRow key={property.id}>
                                <TableCell>
                                    <div className="relative w-12 h-12 overflow-hidden rounded bg-muted">
                                        {property.imageUrls && property.imageUrls[0] ? (
                                            <img
                                                src={property.imageUrls[0]}
                                                alt={property.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{property.title}</TableCell>
                                <TableCell>${property.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={property.status === "APPROVED" ? "default" : property.status === "REJECTED" ? "destructive" : "secondary"}>
                                        {property.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/dashboard/edit/${property.id}`}>Edit</Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={isPending}
                                        onClick={() => startTransition(() => deleteProperty(property.id))}
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
