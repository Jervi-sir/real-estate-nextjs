import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MapPin, Bed, Bath, Scaling } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function FeaturedProperties() {
    // Fetch 3 most recent approved properties
    const featured = await db.query.properties.findMany({
        where: eq(properties.status, "APPROVED"),
        orderBy: [desc(properties.createdAt)],
        limit: 3,
    });

    return (
        <section className="py-20 bg-slate-50 dark:bg-zinc-950/50">
            <div className="container mx-auto px-4 md:px-0">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
                        <p className="text-muted-foreground">Handpicked properties just for you.</p>
                    </div>
                    <Link href="/" className="text-blue-600 font-medium hover:underline hidden md:block">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featured.length > 0 ? (
                        featured.map((property) => (
                            <Link key={property.id} href={`/properties/${property.id}`} className="group">
                                <Card className="overflow-hidden border-none shadow-lg rounded-2xl h-full flex flex-col hover:-translate-y-1 transition duration-300">
                                    <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                                        {property.imageUrls[0] && (
                                            <img
                                                src={property.imageUrls[0]}
                                                alt={property.title}
                                                className="object-cover w-full h-full group-hover:scale-110 transition duration-500"
                                            />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white text-blue-900 hover:bg-white/90">For Sale</Badge>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-blue-600 font-bold text-xl">${property.price.toLocaleString()}</p>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-600 transition">{property.title}</h3>
                                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                                            <MapPin className="h-4 w-4" />
                                            <span className="line-clamp-1">{property.address}</span>
                                        </div>

                                        <div className="mt-auto pt-4 border-t flex items-center justify-between text-muted-foreground text-sm">
                                            <div className="flex items-center gap-1">
                                                <Bed className="h-4 w-4" />
                                                <span>3 Beds</span> {/* Mock data since generic schema */}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="h-4 w-4" />
                                                <span>2 Baths</span> {/* Mock data */}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Scaling className="h-4 w-4" />
                                                <span>1,200 sqft</span> {/* Mock data */}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 text-muted-foreground">
                            No featured properties available at the moment.
                        </div>
                    )}
                </div>
                <div className="mt-8 text-center md:hidden">
                    <Link href="/" className="text-blue-600 font-medium hover:underline">View All Properties</Link>
                </div>
            </div>
        </section>
    );
}
