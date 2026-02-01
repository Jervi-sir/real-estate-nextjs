import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc, ilike, and, gte, lte, count } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { auth, signOut } from "@/auth";

import { ModeToggle } from "@/components/theme-toggle";
import { SearchFilters } from "@/components/search-filters";
import { Pagination } from "@/components/pagination";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const params = await searchParams;

  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const pageSize = 9; // Grid 3x3
  const offset = (page - 1) * pageSize;

  const query = typeof params.query === 'string' ? params.query : undefined;
  const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined;

  // Build filters
  const filters = [eq(properties.status, "APPROVED")];

  if (query) {
    filters.push(ilike(properties.title, `%${query}%`));
  }
  if (minPrice !== undefined && !isNaN(minPrice)) {
    filters.push(gte(properties.price, minPrice));
  }
  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    filters.push(lte(properties.price, maxPrice));
  }

  const whereClause = and(...filters);

  // Parallel fetch: data and total count
  const [approvedProperties, [totalCountResult]] = await Promise.all([
    db.query.properties.findMany({
      where: whereClause,
      orderBy: [desc(properties.createdAt)],
      limit: pageSize,
      offset: offset,
    }),
    db.select({ count: count() })
      .from(properties)
      .where(whereClause)
  ]);

  const totalPages = Math.ceil(totalCountResult.count / pageSize);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto py-4 flex items-center justify-between px-4 md:px-0">
          <h1 className="font-bold text-xl">RealEstate</h1>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
                <form action={async () => {
                  "use server";
                  await signOut();
                }}>
                  <Button variant="outline" size="sm">Sign Out</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:underline">Login</Link>
                <Link href="/register" className="text-sm font-medium hover:underline">Register</Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 md:px-0">
        <section className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Find Your Dream Home</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Browse our curated list of exclusive properties approved by our agents.</p>
        </section>

        <SearchFilters />

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
              <p className="text-muted-foreground text-lg">No properties match your search.</p>
            </div>
          )}
        </div>

        <Pagination totalPages={totalPages} />
      </main>
    </div>
  );
}
