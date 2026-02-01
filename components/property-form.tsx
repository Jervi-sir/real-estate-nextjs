"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProperty, updateProperty } from "@/lib/actions";
import { useTransition, useState } from "react";
import type { Property } from "@/lib/db/schema";
import { ChevronLeft, ChevronRight, Loader2, Upload, X } from "lucide-react";

export function PropertyForm({ property }: { property?: Property }) {
    const [isPending, startTransition] = useTransition();

    // State is now an array of strings
    const [imageUrls, setImageUrls] = useState<string[]>(property?.imageUrls || []);
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

            // Append new URL to array
            setImageUrls(prev => [...prev, data.url]);
        } catch (error) {
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    }

    function handleRemoveImage(index: number) {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    }

    function handleMoveImage(index: number, direction: -1 | 1) {
        setImageUrls(prev => {
            const newArr = [...prev];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

            [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
            return newArr;
        });
    }

    function onSubmit(formData: FormData) {
        // Ensure imageUrls is sent as a comma-separated string (or however backend expects it if it parsed string)
        // Previous logic used join(", ") so we replicate that here for compatibility if the backend expects a string
        // But if the backend action handles it, usually FormData with same key 'imageUrls' multiple times is for arrays.
        // However, based on previous code: `formData.set("imageUrls", imageUrls)` where imageUrls was string.
        // So we join it.
        formData.set("imageUrls", imageUrls.join(","));

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

            <div className="space-y-4">
                <Label>Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {imageUrls.map((url, index) => (
                        <div key={url + index} className="relative group aspect-video bg-muted rounded-lg overflow-hidden border">
                            {/* Image */}
                            <img src={url} alt={`Property image ${index + 1}`} className="w-full h-full object-cover" />

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === 0}
                                    onClick={() => handleMoveImage(index, -1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === imageUrls.length - 1}
                                    onClick={() => handleMoveImage(index, 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Upload Button Card */}
                    <div className="relative aspect-video bg-muted rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <Upload className="h-8 w-8" />
                        )}
                        <span className="text-sm font-medium">{isUploading ? "Uploading..." : "Upload Image"}</span>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">Upload images or drag to reorder (use arrows).</p>
            </div>

            <div className="flex gap-4">
                <Button type="submit" name="status" value="DRAFT" variant="secondary" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save as Draft"}
                </Button>
                <Button type="submit" name="status" value="PENDING" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : property?.status === "APPROVED" ? "Update & Submit for Review" : "Publish Listing"}
                </Button>
            </div>
        </form>
    );
}
