import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) notFound();

    const property = await db.query.properties.findFirst({
        where: eq(properties.id, id),
    });

    if (!property) {
        return notFound();
    }

    const isApproved = property.status === "APPROVED";

    if (!isApproved) {
        const session = await auth();
        const isOwner = session?.user?.id === property.userId;
        const isAdmin = session?.user?.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return notFound();
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b mb-8">
                <div className="container mx-auto py-4 px-4 md:px-0">
                    <Link href="/" className="font-bold text-xl">RealEstate</Link>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-0 pb-10">
                <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block">&larr; Back to Listings</Link>

                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{property.title}</h1>
                    {!isApproved && <Badge variant="secondary" className="text-base px-3 py-1 capitalize">{property.status.toLowerCase()}</Badge>}
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    <div className="md:col-span-2 space-y-4">
                        {property.imageUrls.length > 0 ? (
                            property.imageUrls.map((url, i) => (
                                <div key={i} className="aspect-video bg-muted rounded-xl overflow-hidden relative shadow-sm border">
                                    <img src={url} alt={`${property.title} - View ${i + 1}`} className="object-cover w-full h-full" />
                                </div>
                            ))
                        ) : (
                            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground border">
                                No Images Available
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-primary mb-2">${property.price.toLocaleString()}</p>
                            <p className="text-muted-foreground mb-6 flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin mt-0.5"><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                {property.address}
                            </p>
                            <Button size="lg" className="w-full">Contact Agent</Button>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">Description</h3>
                            <div className="prose dark:prose-invert text-muted-foreground leading-relaxed whitespace-pre-line">
                                {property.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
