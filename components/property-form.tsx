"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProperty, updateProperty } from "@/lib/actions";
import { useTransition, useState } from "react";
import type { Property } from "@/lib/db/schema";

export function PropertyForm({ property }: { property?: Property }) {
    const [isPending, startTransition] = useTransition();


    const [imageUrls, setImageUrls] = useState(property?.imageUrls.join(", ") || "");
    const [isUploading, setIsUploading] = useState(false);

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();

            // Append new URL to existing string
            const currentUrls = imageUrls ? imageUrls.split(",").map(s => s.trim()).filter(Boolean) : [];
            const newUrls = [...currentUrls, data.url].join(", ");
            setImageUrls(newUrls);
        } catch (error) {
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    }

    // Sync state changes with the input field for form submission
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrls(e.target.value);
    }

    function onSubmit(formData: FormData) {
        // Manually set the imageUrls field from state (though input has name, explicit set ensures state wins)
        formData.set("imageUrls", imageUrls);

        startTransition(async () => {
            if (property) {
                await updateProperty(property.id, formData);
            } else {
                await createProperty(formData);
            }
        });
    }

    return (
        <form action={onSubmit} className="space-y-6 max-w-2xl border p-6 rounded-xl bg-card">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required defaultValue={property?.title} placeholder="Cozy 2-bedroom apartment" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required defaultValue={property?.address} placeholder="123 Main St, New York, NY" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" required defaultValue={property?.price} placeholder="500000" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    name="description"
                    required
                    defaultValue={property?.description}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe the property..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrls">Images</Label>
                <div className="flex gap-2">
                    <Input
                        id="imageUrls"
                        name="imageUrls"
                        required
                        value={imageUrls}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/image1.jpg, /uploads/local.jpg"
                    />
                    <div className="relative">
                        <Button type="button" variant="outline" disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">Upload an image or paste comma-separated URLs.</p>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Saving..." : property ? "Update Listing" : "Create Listing"}
            </Button>
        </form>
    );
}
