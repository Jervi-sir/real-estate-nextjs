import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/actions";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
            <form action={register} className="w-full max-w-sm space-y-6 border p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Register</h1>
                    <p className="text-muted-foreground">Create a new account to list properties</p>
                </div>

                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" required placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input name="password" type="password" required minLength={6} placeholder="Min 6 characters" />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account? <a href="/login" className="underline text-primary">Login</a>
                </div>
            </form>
        </div>
    )
}
