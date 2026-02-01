import { Home, Building2, Store, Briefcase, Building } from "lucide-react";

const categories = [
    { name: "Apartment", icon: Building2, count: 24 },
    { name: "Villa", icon: Home, count: 12 },
    { name: "Office", icon: Briefcase, count: 8 },
    { name: "Shop", icon: Store, count: 5 },
    { name: "Building", icon: Building, count: 3 },
];

export function Categories() {
    return (
        <section className="py-20 container mx-auto px-4 md:px-0">
            <h2 className="text-2xl font-bold mb-10 text-center md:text-left">Discover Properties</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {categories.map((cat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-card rounded-xl border hover:shadow-md transition cursor-pointer group hover:border-blue-500/50">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition">
                            <cat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">{cat.count} Properties</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
