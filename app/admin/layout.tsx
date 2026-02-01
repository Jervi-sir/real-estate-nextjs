import { ModeToggle } from "@/components/theme-toggle";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Future sidebar or admin header can go here */}
            <header className="border-b">
                <div className="container mx-auto py-4 flex items-center justify-between px-4 md:px-0">
                    <div className="flex items-center gap-6">
                        <div className="font-semibold text-lg">RealEstate Admin</div>
                        <nav className="flex items-center gap-4 text-sm font-medium">
                            <a href="/admin" className="hover:text-foreground/80 transition-colors">Properties</a>
                            <a href="/admin/users" className="hover:text-foreground/80 transition-colors">Users</a>
                        </nav>
                    </div>
                    <ModeToggle />
                </div>
            </header>
            {children}
        </div>
    );
}
