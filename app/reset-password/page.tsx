"use client";

import { useTransition, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isPending, startTransition] = useTransition();

    if (!token) {
        return (
            <div className="text-center text-destructive">
                Invalid or missing token.
            </div>
        );
    }

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await resetPassword(formData);
            if (result?.error) {
                alert(result.error);
            }
        });
    }

    return (
        <form action={onSubmit} className="w-full max-w-sm space-y-6 border p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-sm">Enter your new password below</p>
            </div>

            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" name="password" type="password" required placeholder="********" minLength={6} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="********" minLength={6} />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Resetting..." : "Reset Password"}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
