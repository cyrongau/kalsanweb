"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/components/providers/QuoteProvider";
import { API_BASE_URL, normalizeImageUrl } from '@/lib/config';
import { cn } from "@/lib/utils";

const LatestArrivals = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);

    // Handle responsive items to show
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsToShow(1);
            else if (window.innerWidth < 1024) setItemsToShow(2);
            else setItemsToShow(4);
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                // Determine API URL based on config logic
                const url = `${API_BASE_URL}/products?limit=12&sort=newest`;
                console.log("LatestArrivals: Fetching from", url);

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(Array.isArray(data) ? data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        category: p.category?.name || 'Uncategorized',
                        image: normalizeImageUrl(p.image_urls?.[0]) || 'https://placehold.co/400x500/f3f4f6/1d428a?text=No+Image',
                        sku: p.sku,
                        rating: p.rating || 5
                    })) : []);
                } else {
                    console.error("Latest arrivals fetch error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch latest arrivals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            // Stop if we reach the end of the list (considering visible items)
            const maxIndex = products.length - itemsToShow;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [products.length, itemsToShow]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = products.length - itemsToShow;
            return prev <= 0 ? maxIndex : prev - 1;
        });
    }, [products.length, itemsToShow]);

    // Auto-slide functionality (optional, can be removed if manual only is preferred)
    // useEffect(() => {
    //     if (products.length <= itemsToShow) return;
    //     const interval = setInterval(nextSlide, 5000);
    //     return () => clearInterval(interval);
    // }, [nextSlide, products.length, itemsToShow]);

    return (
        <section className="section-padding bg-white dark:bg-background transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                        <p className="text-primary dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 justify-center md:justify-start">
                            <span className="w-12 h-1 bg-primary rounded-full" />
                            New Inventory
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black text-secondary dark:text-foreground tracking-tighter">
                            Latest <span className="text-primary">Arrivals</span>
                        </h2>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Navigation Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={prevSlide}
                                disabled={products.length <= itemsToShow}
                                className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-muted/10 border border-gray-100 dark:border-muted flex items-center justify-center text-secondary dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={products.length <= itemsToShow}
                                className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-muted/10 border border-gray-100 dark:border-muted flex items-center justify-center text-secondary dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <Link href="/shop" className="bg-white dark:bg-muted/10 text-primary dark:text-gray-400 border-2 border-primary/10 dark:border-muted px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all shadow-xl active:scale-95">
                            See All
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={40} className="text-primary animate-spin mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest text-center">Loading Latest Arrivals...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="relative">
                        <div className="overflow-hidden -mx-4 px-4 py-4"> {/* Add padding for shadow/hover clipping */}
                            <div
                                className="flex transition-transform duration-500 ease-out will-change-transform"
                                style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                            >
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="shrink-0 px-3"
                                        style={{ width: `${100 / itemsToShow}%` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 font-medium">No new arrivals found at the moment.</p>
                    </div>
                )}

                {/* Mobile View All / Nav */}
                <div className="mt-8 flex justify-center gap-4 md:hidden">
                    <button
                        onClick={prevSlide}
                        className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-muted/10 border border-gray-100 dark:border-muted flex items-center justify-center text-secondary dark:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-muted/10 border border-gray-100 dark:border-muted flex items-center justify-center text-secondary dark:text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LatestArrivals;
