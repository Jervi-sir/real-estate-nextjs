import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const approvedProperties = await db.query.properties.findMany({
    where: eq(properties.status, "APPROVED"),
    orderBy: [desc(properties.createdAt)],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto py-4 flex items-center justify-between px-4 md:px-0">
          <h1 className="font-bold text-xl">RealEstate</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-sm font-medium hover:underline">Login</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 md:px-0">
        <section className="mb-14 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Find Your Dream Home</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Browse our curated list of exclusive properties approved by our agents.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted overflow-hidden">
                {property.imageUrls[0] ? (
                  <img
                    src={property.imageUrls[0]}
                    alt={property.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{property.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-1">${property.price.toLocaleString()}</p>
                <p className="text-muted-foreground truncate text-sm">{property.address}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/properties/${property.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {approvedProperties.length === 0 && (
            <div className="col-span-full text-center py-20 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground text-lg">No approved properties available at the moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
