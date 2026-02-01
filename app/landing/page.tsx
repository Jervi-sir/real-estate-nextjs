import { db } from "@/lib/db";
import { HeroSearch } from "@/components/landing/hero-search";
import { Categories } from "@/components/landing/categories";
import { FeaturedProperties } from "@/components/landing/featured";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { StatsSection } from "@/components/landing/stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import { RevealOnScroll } from "@/components/landing/reveal-on-scroll";

export default async function LandingPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 w-full z-50 py-6 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-white/10 transition-all">
                <div className="container mx-auto px-4 md:px-0 flex items-center justify-between">
                    <Link href="/landing" className="text-2xl font-bold text-blue-900 dark:text-white">Property</Link>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-800 dark:text-slate-200">
                        <Link href="/landing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Properties</Link>
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Agents</Link>
                        <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        {session ? (
                            <Link href="/dashboard">
                                <Button variant="outline" className="bg-white/20 border-white/40 text-foreground backdop-blur-sm hover:bg-white/40">Dashboard</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center pt-32 lg:pt-32 pb-20 overflow-hidden bg-blue-50/50 dark:bg-zinc-950">
                    <div className="container mx-auto px-4 md:px-0 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <RevealOnScroll className="lg:w-1/2 space-y-8">
                                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                                    Find Your Best <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Real Estate</span>
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg">
                                    We provide a complete service for the sale, purchase or rental of real estate.
                                </p>

                                <HeroSearch />

                                <div className="flex items-center gap-8 pt-4">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-12 w-12 rounded-full border-4 border-blue-50 dark:border-zinc-900 bg-muted overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium">400k+ Satisfied Clients</p>
                                    </div>
                                </div>
                            </RevealOnScroll>

                            <RevealOnScroll delay={0.2} className="lg:w-1/2 relative lg:h-[600px] w-full flex items-center justify-center">
                                {/* Hero Image Composition */}
                                <div className="relative w-full h-[400px] lg:h-full rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/20">
                                    <img
                                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"
                                        alt="Modern Architecture"
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                                {/* Floating Cards */}
                                <div className="absolute bottom-10 left-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur p-4 rounded-2xl shadow-xl max-w-xs animate-in slide-in-from-bottom-10 fade-in duration-1000 hidden md:block">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold text-xl">
                                            72k
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Customers</p>
                                            <p className="font-bold text-slate-900 dark:text-white">Excellent Service</p>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </section>

                <RevealOnScroll>
                    <Categories />
                </RevealOnScroll>

                <RevealOnScroll>
                    <FeaturedProperties />
                </RevealOnScroll>

                <RevealOnScroll>
                    <WhyChooseUs />
                </RevealOnScroll>

                <RevealOnScroll>
                    <StatsSection />
                </RevealOnScroll>

                {/* Simple Footer for Landing */}
                <footer className="bg-slate-900 text-slate-300 py-12">
                    <div className="container mx-auto px-4 md:px-0 grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Property</h3>
                            <p className="text-sm leading-relaxed max-w-sm">
                                The best real estate agency in your city. We help you find the house of your dreams.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Properties</a></li>
                                <li><a href="#" className="hover:text-white">Agents</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">FAQ</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Newsletter</h4>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Your email" className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full" />
                                <Button className="bg-blue-600 hover:bg-blue-700">Go</Button>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-4 md:px-0 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                        © 2026 Property. All rights reserved.
                    </div>
                </footer>
            </main>
        </div>
    );
}
