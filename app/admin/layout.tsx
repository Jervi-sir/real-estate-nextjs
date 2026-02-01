export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Future sidebar or admin header can go here */}
            <header className="border-b">
                <div className="container mx-auto py-4 flex items-center justify-between">
                    <div className="font-semibold text-lg">RealEstate Admin</div>
                </div>
            </header>
            {children}
        </div>
    );
}
