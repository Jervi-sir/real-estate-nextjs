import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Mimic Header */}
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
                <div className="container mx-auto py-4 flex items-center justify-between px-4 md:px-0">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-10 px-4 md:px-0">
                {/* Mimic Hero Section */}
                <section className="mb-10 text-center space-y-4">
                    <Skeleton className="h-12 w-3/4 max-w-lg mx-auto" />
                    <Skeleton className="h-6 w-1/2 max-w-md mx-auto" />
                </section>

                {/* Mimic Search Filters */}
                <div className="mb-8 p-4 bg-muted/30 rounded-lg border flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="w-full md:w-32 space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="w-full md:w-32 space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>

                {/* Mimic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                            <Skeleton className="h-[225px] w-full" />
                            <div className="p-6 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                            <div className="p-6 pt-0 space-y-2">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="p-6 pt-0">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
