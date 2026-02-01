"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home, Building2, Store, Briefcase } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function HeroSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState(""); // Simplified for now, just another input
    const [isPending, startTransition] = useTransition();

    function handleSearch() {
        // Redirect to main listings page with params
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        // Location logic would go here if we had location search support in backend, 
        // currently 'query' searches title. Ideally query searches address too.
        // Let's assume the main search 'query' param handles both for now or just title.

        startTransition(() => {
            router.push(`/?${params.toString()}`);
        });
    }

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg max-w-xl w-full">
            <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-[240px] grid-cols-2 mb-6">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="rent" disabled>Rent</TabsTrigger> {/* Disabled for v1 */}
                </TabsList>

                <TabsContent value="buy" className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Location or Title</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter location, property type..."
                                className="pl-10 h-12 text-base"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Add more filters here if needed like in the design (Type, Location) */}

                    <Button size="lg" className="w-full h-12 text-base mt-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSearch} disabled={isPending}>
                        {isPending ? "Searching..." : "Search"}
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}
