export function StatsSection() {
    return (
        <section className="bg-blue-600 dark:bg-blue-700 py-16 text-white">
            <div className="container mx-auto px-4 md:px-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-white/20 md:divide-x-0">
                    <div className="space-y-1">
                        <p className="text-4xl xs:text-5xl font-bold">99%</p>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Happy Customers</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl xs:text-5xl font-bold">780k</p>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Properties Sold</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl xs:text-5xl font-bold">160+</p>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Awards Winning</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl xs:text-5xl font-bold">20+</p>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Years Experience</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
