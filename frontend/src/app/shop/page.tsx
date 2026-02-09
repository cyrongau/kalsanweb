"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, LayoutGrid, List, ChevronLeft, ShoppingBag, Heart, Star, Plus, Loader2, Search, ChevronDown, Filter, X, Grid as GridIcon } from "lucide-react";
import SidebarFilters from "@/components/SidebarFilters";
import { cn } from "@/lib/utils";

import { useAdmin } from "@/components/providers/AdminProvider";
import { API_BASE_URL } from "@/lib/config";
import ProductCard from "@/components/ProductCard";

interface Product {
    id: string;
    name: string;
    category: {
        id: string;
        name: string;
    };
    brand: {
        id: string;
        name: string;
    };
    sku: string;
    rating: number;
    image_urls: string[];
    tags?: string[];
}

export default function ShopPage() {
    const { settings } = useAdmin();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const condition = searchParams.get('condition');
    const sort = searchParams.get('sort') || 'recommended';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                if (category) params.set('category', category);
                if (brand) params.set('brand', brand);
                if (condition) params.set('condition', condition);
                if (sort) params.set('sort', sort);

                const baseUrl = window.location.origin.replace('3000', '3001');
                const url = `${baseUrl}/products?${params.toString()}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                if (res.ok) setCategories(await res.json());
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
        fetchProducts();
    }, [query, category, brand, condition, sort]);

    return (
        <div className="w-full min-h-screen bg-gray-50/50 dark:bg-background transition-colors duration-300">
            {/* Product Catalog Header */}
            <section className="relative h-[300px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                {/* Abstract Dark Background */}
                <div className="absolute inset-0 bg-[#1D428A]" />
                <div
                    className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url(${settings.catalogBanner || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black !text-[#8f9fbf] tracking-tighter uppercase drop-shadow-2xl">Product Catalog</h1>
                    <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-bold uppercase tracking-widest drop-shadow-md">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={14} className="text-white/50" />
                        <span className="text-white">Shop</span>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Mobile Search - Full Width */}
                <div className="lg:hidden mb-6">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search spare parts..."
                            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 pl-12 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={query || ''}
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (e.target.value) params.set('q', e.target.value);
                                else params.delete('q');
                                router.push(`/shop?${params.toString()}`);
                            }}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Mobile Filters & Sort Buttons */}
                <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => setIsFiltersOpen(true)}
                        className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                    >
                        <Filter size={18} className="text-primary" />
                        Filter
                    </button>
                    <button
                        onClick={() => setIsSortOpen(true)}
                        className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                    >
                        <List size={18} className="text-primary" />
                        Sort
                    </button>
                </div>

                {/* Horizontal Categories Scroller */}
                <div className="mb-8 lg:hidden -mx-4 px-4 overflow-hidden">
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('category');
                                router.push(`/shop?${params.toString()}`);
                            }}
                            className={cn(
                                "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                !category ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-white dark:bg-slate-900 text-gray-400 border border-gray-100 dark:border-slate-800"
                            )}
                        >
                            All Parts
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('category', cat.slug);
                                    router.push(`/shop?${params.toString()}`);
                                }}
                                className={cn(
                                    "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    category === cat.slug ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-white dark:bg-slate-900 text-gray-400 border border-gray-100 dark:border-slate-800"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar - Desktop Only */}
                    <div className="hidden lg:block">
                        <SidebarFilters />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Toolbar - Desktop Only */}
                        <div className="hidden lg:flex bg-white dark:bg-muted/30 p-5 rounded-2xl shadow-soft justify-between items-center gap-4 border border-gray-100 dark:border-muted">
                            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                Found <span className="text-primary font-black">{products.length} parts</span> {query ? `for "${query}"` : 'matching your criteria'}
                            </div>
                            <div className="flex items-center gap-6 relative">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By:</span>
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-2 text-sm font-black text-secondary dark:text-foreground hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-muted/50"
                                    >
                                        {sort === 'recommended' ? 'Recommended' : sort === 'newest' ? 'Newest' : sort === 'price_low' ? 'Price: Low to High' : 'Price: High to Low'}
                                        <ChevronDown size={14} className={cn("transition-transform", isSortOpen && "rotate-180")} />
                                    </button>

                                    {isSortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                                            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-2 z-50 animate-in zoom-in-95 duration-200">
                                                {[
                                                    { id: 'recommended', label: 'Recommended' },
                                                    { id: 'newest', label: 'Newest Arrivals' },
                                                    { id: 'price_low', label: 'Price: Low to High' },
                                                    { id: 'price_high', label: 'Price: High to Low' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => {
                                                            const params = new URLSearchParams(searchParams.toString());
                                                            params.set('sort', opt.id);
                                                            router.push(`/shop?${params.toString()}`);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center group",
                                                            sort === opt.id ? "bg-primary text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                                        )}
                                                    >
                                                        {opt.label}
                                                        {sort === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-125 transition-transform" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary - Mobile */}
                        <div className="lg:hidden text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">
                            Showing {products.length} products
                        </div>

                        {/* Product Grid - 2 Columns on Mobile */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading Parts Inventory...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8">
                                {products.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        product={{
                                            id: p.id,
                                            name: p.name,
                                            category: p.category?.name || 'Uncategorized',
                                            image: p.image_urls?.[0] || 'https://placehold.co/400x300/f3f4f6/1d428a?text=No+Image',
                                            sku: p.sku,
                                            rating: p.rating
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
                                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-muted/10 flex items-center justify-center text-gray-300">
                                    <Search size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">No results found</h3>
                                    <p className="text-gray-400 font-medium">We couldn't find any parts matching your search. Try a different term or keyword.</p>
                                </div>
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    Browse All Catalog
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-3 pt-16">
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-muted text-gray-400 hover:border-primary hover:text-primary transition-all bg-white dark:bg-muted/10 shadow-sm">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/25">1</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-muted text-gray-500 dark:text-gray-400 font-black text-sm hover:border-primary hover:text-primary transition-all bg-white dark:bg-muted/10">2</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-muted text-gray-500 dark:text-gray-400 font-black text-sm hover:border-primary hover:text-primary transition-all bg-white dark:bg-muted/10">3</button>
                            <span className="px-2 text-gray-400 font-black">...</span>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-muted text-gray-500 dark:text-gray-400 font-black text-sm hover:border-primary hover:text-primary transition-all bg-white dark:bg-muted/10">6</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 dark:border-muted text-gray-400 hover:border-primary hover:text-primary transition-all bg-white dark:bg-muted/10 shadow-sm">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Load More - Mobile */}
            {products.length > 0 && (
                <div className="container mx-auto px-4 pb-20 lg:hidden">
                    <button className="w-full py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-primary shadow-sm active:scale-95 transition-all">
                        Load More Parts
                    </button>
                </div>
            )}

            {/* Mobile Filters Drawer */}
            <div className={cn(
                "fixed inset-0 z-[100] transition-all duration-500 lg:hidden",
                isFiltersOpen ? "visible" : "invisible"
            )}>
                <div
                    className={cn(
                        "absolute inset-0 bg-secondary/60 backdrop-blur-sm transition-opacity duration-500",
                        isFiltersOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setIsFiltersOpen(false)}
                />
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-[80vh] bg-white dark:bg-slate-950 rounded-t-[3rem] shadow-2xl transition-transform duration-500 ease-out flex flex-col",
                    isFiltersOpen ? "translate-y-0" : "translate-y-full"
                )}>
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Filter Catalog</h3>
                        <button
                            onClick={() => setIsFiltersOpen(false)}
                            className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-32">
                        <SidebarFilters />
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 absolute bottom-0 left-0 right-0">
                        <button
                            onClick={() => setIsFiltersOpen(false)}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Sort Modal - Mobile */}
            {isSortOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSortOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-secondary dark:text-white uppercase">Sort By</h3>
                            <button onClick={() => setIsSortOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="space-y-2">
                            {[
                                { id: 'recommended', label: 'Recommended' },
                                { id: 'newest', label: 'Newest Arrivals' },
                                { id: 'price_low', label: 'Price: Low to High' },
                                { id: 'price_high', label: 'Price: High to Low' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set('sort', opt.id);
                                        router.push(`/shop?${params.toString()}`);
                                        setIsSortOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all flex justify-between items-center group",
                                        sort === opt.id ? "bg-primary text-white" : "bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400"
                                    )}
                                >
                                    {opt.label}
                                    {sort === opt.id && <ChevronRight size={18} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
