import { Shield, Smartphone, Clock } from "lucide-react";

export function WhyChooseUs() {
    return (
        <section className="py-24 container mx-auto px-4 md:px-0">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2 relative">
                    {/* Abstract composition for image */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                            <div className="h-48 rounded-2xl bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600596542815-2a4d04774c71?auto=format&fit=crop&q=80&w=500" alt="House 1" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-64 rounded-2xl bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=500" alt="House 2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-64 rounded-2xl bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500" alt="House 3" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-48 rounded-2xl bg-muted overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600566753086-00f18cf6b3ea?auto=format&fit=crop&q=80&w=500" alt="House 4" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Why People Choose Properties From Us</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We provide a complete service for the sale, purchase or rental of real estate. We have been operating in Madrid and Barcelona more than 15 years.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl">Trusted By Thousands</h3>
                                <p className="text-muted-foreground">More than 10 new properties every day. Choose your new home from a huge selection.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                                <Smartphone className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl">Easy To Manage</h3>
                                <p className="text-muted-foreground">Our new mobile app allows you to keep track of your properties and visits.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                                <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl">Fast & Efficient</h3>
                                <p className="text-muted-foreground">Get the best results in the shortest time possible with our agents.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
