import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto py-4 px-4 md:px-0 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="font-bold text-xl">RealEstate</Link>
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground">Overview</Link>
                            <Link href="/dashboard/new" className="transition-colors hover:text-foreground/80 text-muted-foreground">New Listing</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">
                            {session.user.name || session.user.email} <span className="text-xs border px-1 rounded ml-1 uppercase">{session.user.role}</span>
                        </span>
                        {session.user.role === "ADMIN" && (
                            <Button variant="ghost" asChild className="text-sm">
                                <Link href="/admin">Admin Panel</Link>
                            </Button>
                        )}
                        <form action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}>
                            <Button variant="outline" size="sm">Sign Out</Button>
                        </form>
                        <ModeToggle />
                    </div>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}
