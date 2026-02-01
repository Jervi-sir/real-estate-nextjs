"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                We apologize for the inconvenience. An unexpected error occurred while processing your request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={() => window.location.href = "/"}
                    variant="outline"
                >
                    Go Home
                </Button>
                <Button onClick={() => reset()}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}
