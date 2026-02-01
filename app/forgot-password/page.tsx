"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await forgotPassword(formData);
            if (result?.success) {
                setMessage(result.success as string);
            } else if (result?.error) {
                // For forgot password, we might typically hide errors for security, but here we can show.
                alert(result.error);
            }
        });
    }

    if (message) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
                <div className="w-full max-w-sm space-y-6 border p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900 text-center">
                    <h1 className="text-2xl font-bold">Check your email</h1>
                    <p className="text-muted-foreground mb-4">{message}</p>
                    <Button asChild className="w-full">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
            <form action={onSubmit} className="w-full max-w-sm space-y-6 border p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground text-sm">Enter your email to receive a reset link</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="user@example.com" />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
