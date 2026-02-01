import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
            <form
                action={async (formData) => {
                    "use server";
                    try {
                        await signIn("credentials", {
                            email: formData.get("email"),
                            password: formData.get("password"),
                            redirectTo: "/dashboard",
                        });
                    } catch (error) {
                        if (error instanceof AuthError) {
                            return redirect("/login?error=InvalidCredentials");
                        }
                        throw error; // Rethrow to let Next.js handle redirect (which behaves like an error)
                    }
                }}
                className="w-full max-w-sm space-y-6 border p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900"
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-muted-foreground">Enter your credentials to access your account</p>
                </div>

                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Password</Label>
                        <a href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary underline">Forgot Password?</a>
                    </div>
                    <Input name="password" type="password" required placeholder="********" />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account? <a href="/register" className="underline text-primary">Register</a>
                </div>
            </form>
        </div>
    );
}
