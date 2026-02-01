"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentPage = Number(searchParams.get("page")) || 1;

    function handlePageChange(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.replace(`${pathname}?${params.toString()}`);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
            </Button>

            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>

            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
            </Button>
        </div>
    );
}
