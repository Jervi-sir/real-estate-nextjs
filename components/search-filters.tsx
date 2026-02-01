"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function SearchFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    function handleSearch(formData: FormData) {
        const params = new URLSearchParams(searchParams);

        if (query) {
            params.set("query", query);
        } else {
            params.delete("query");
        }

        if (minPrice) {
            params.set("minPrice", minPrice);
        } else {
            params.delete("minPrice");
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        } else {
            params.delete("maxPrice");
        }

        // Reset page on new search
        params.set("page", "1");

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <form action={handleSearch} className="mb-8 p-4 bg-muted/30 rounded-lg border flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
                <label htmlFor="query" className="text-sm font-medium">Search</label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="query"
                        name="query"
                        placeholder="Search by title..."
                        className="pl-9"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-full md:w-32 space-y-2">
                <label htmlFor="minPrice" className="text-sm font-medium">Min Price</label>
                <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
            </div>

            <div className="w-full md:w-32 space-y-2">
                <label htmlFor="maxPrice" className="text-sm font-medium">Max Price</label>
                <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending ? "Searching..." : "Filter"}
            </Button>

            {/* Clear filters button if any filter is active */}
            {(query || minPrice || maxPrice) && (
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                        setQuery("");
                        setMinPrice("");
                        setMaxPrice("");
                        router.replace(pathname);
                    }}
                >
                    Clear
                </Button>
            )}
        </form>
    );
}
