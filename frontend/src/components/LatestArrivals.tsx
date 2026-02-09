"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/components/providers/QuoteProvider";

const LatestArrivals = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                const baseUrl = window.location.origin.replace('3000', '3001');
                const response = await fetch(`${baseUrl}/products?limit=4&sort=newest`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        category: p.category?.name || 'Uncategorized',
                        image: p.image_urls?.[0] || 'https://placehold.co/400x500/f3f4f6/1d428a?text=No+Image',
                        sku: p.sku,
                        rating: p.rating || 5
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch latest arrivals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    return (
        <section className="section-padding bg-white dark:bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-16">
                    <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                        <p className="text-primary dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 justify-center md:justify-start">
                            <span className="w-12 h-1 bg-primary rounded-full" />
                            New Inventory
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black text-secondary dark:text-foreground tracking-tighter">
                            Latest <span className="text-primary">Arrivals</span>
                        </h2>
                    </div>
                    <Link href="/shop" className="hidden md:flex bg-white dark:bg-muted/10 text-primary dark:text-gray-400 border-2 border-primary/10 dark:border-muted px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all shadow-xl active:scale-95">
                        See All Parts
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={40} className="text-primary animate-spin mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest text-center">Loading Latest Arrivals...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 font-medium">No new arrivals found at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestArrivals;
