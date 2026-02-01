import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc, like, and, gte, lte, count } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

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
    filters.push(like(properties.title, `%${query}%`));
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <header className="fixed top-0 w-full z-50 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-white/10 shadow-sm transition-all">
        <div className="container max-w-4xl mx-auto py-2 flex items-center justify-between px-4 md:px-0">
          <Link href="/landing" className="font-bold text-xl flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </span>
            RealEstate
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition">Dashboard</Link>
                <form action={async () => {
                  "use server";
                  await signOut();
                }}>
                  <Button variant="ghost" size="sm" className="hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">Sign Out</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition">Login</Link>
                <Link href="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Register</Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-10 pt-28 px-4 md:px-0">
        <div className="max-w-4xl mx-auto mb-12">
          <Alert className="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900">
            <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-100 font-bold">Find Your Dream Home</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              Browse our curated list of exclusive properties approved by our agents.
            </AlertDescription>
          </Alert>
        </div>

        <SearchFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-xl bg-white dark:bg-zinc-900 h-full flex flex-col">
              <div className="aspect-[4/3] relative bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                {property.imageUrls[0] ? (
                  <img
                    src={property.imageUrls[0]}
                    alt={property.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wide">
                  For Sale
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                  <p className="text-white font-bold text-xl">${property.price.toLocaleString()}</p>
                </div>
              </div>
              <CardContent className="p-5 flex-1 space-y-3">
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">{property.title}</h3>
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span className="line-clamp-2">{property.address}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>
                    <span>3 Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1 4l1.5 2.5a6 6 0 0 0 6 6l2.5 1.5a1.5 1.5 0 0 0 1-4L18 15" /></svg>
                    <span>2 Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="16" height="16" x="4" y="4" rx="2" /><path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M9 15h.01" /><path d="M15 15h.01" /></svg>
                    <span>1,200 sqft</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button asChild className="w-full bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 hover:bg-slate-800 transition-all rounded-lg">
                  <Link href={`/ properties / ${property.id} `}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {approvedProperties.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <Pagination totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
