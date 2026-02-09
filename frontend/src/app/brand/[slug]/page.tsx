"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    ChevronRight,
    ShieldCheck,
    Truck,
    Headphones,
    ArrowRight,
    Search,
    SlidersHorizontal,
    ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/components/providers/QuoteProvider';
import { API_BASE_URL, normalizeImageUrl } from '@/lib/config';

interface Brand {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo_url?: string;
    hero_banner_url?: string;
}

const BrandPage = () => {
    const { slug } = useParams();
    const [brand, setBrand] = useState<Brand | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandRes = await fetch(`${API_BASE_URL}/brands/${slug}`);
                if (brandRes.ok) {
                    const brandData = await brandRes.json();
                    setBrand(brandData);

                    // Fetch real products associated with the brand slug
                    const productsRes = await fetch(`${API_BASE_URL}/products/brand/slug/${slug}`);
                    if (productsRes.ok) {
                        const productsData = await productsRes.json();
                        setProducts(productsData.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            category: p.category?.name || 'Uncategorized',
                            image: normalizeImageUrl(p.image_urls?.[0]) || 'https://placehold.co/400x500/f3f4f6/1d428a?text=No+Image',
                            sku: p.sku,
                            rating: p.rating || 5
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch brand data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchData();
    }, [slug]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!brand) return <div className="min-h-screen flex items-center justify-center text-4xl font-black">Brand Not Found</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={normalizeImageUrl(brand.hero_banner_url) || "/brands/hero-bg.jpg"}
                        className="w-full h-full object-cover opacity-60 dark:opacity-40"
                        alt={brand.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                    <nav className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-secondary/60 dark:text-white/60 mb-4">
                        <Link href="/">Home</Link>
                        <ChevronRight size={12} />
                        <Link href="/shop">Spare Parts</Link>
                        <ChevronRight size={12} />
                        <span className="text-primary">{brand.name}</span>
                    </nav>
                    <h1 className="text-6xl md:text-8xl font-black text-secondary dark:text-white tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {brand.name} Parts
                    </h1>
                </div>
            </section>

            {/* Brand Intro */}
            <section className="py-24 bg-white dark:bg-slate-900 transition-colors">
                <div className="container mx-auto px-4">
                    <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-12 md:p-20 shadow-soft border border-gray-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden aspect-square flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-inner group/img">
                            <img
                                src={normalizeImageUrl(brand.logo_url) || "/brands/placeholder-vehicle.jpg"}
                                alt={brand.name}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-secondary dark:text-white tracking-tighter">
                                    Original {brand.name} Spare Parts
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
                                    Kalsan Auto Spare Parts stocks original <span className="font-black text-secondary dark:text-white uppercase tracking-tight">{brand.name} spare parts</span>.
                                    {brand.name}'s maintenance and durability has now been made possible to ensure a long lasting vehicle on the road thanks to our diverse inventory of spare part products.
                                    Get them all here available for online ordering now.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50/50 dark:bg-slate-900 px-6 py-4 rounded-2xl flex items-center gap-3 border border-transparent hover:border-primary/20 transition-all">
                                    <ShieldCheck className="text-primary" size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-gray-300">100% Genuine</span>
                                </div>
                                <div className="bg-gray-50/50 dark:bg-slate-900 px-6 py-4 rounded-2xl flex items-center gap-3 border border-transparent hover:border-primary/20 transition-all">
                                    <Truck className="text-primary" size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-gray-300">Fast Delivery</span>
                                </div>
                                <div className="bg-gray-50/50 dark:bg-slate-900 px-6 py-4 rounded-2xl flex items-center gap-3 border border-transparent hover:border-primary/20 transition-all col-span-2 md:col-span-1">
                                    <Headphones className="text-primary" size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-gray-300">Expert Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flashy Floating Cart for Brand Page */}
            <div className="fixed bottom-10 right-10 z-[100]">
                <button className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-110 active:scale-95 group">
                    <ShoppingCart size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-0 right-0 bg-white text-green-500 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-green-500 translate-x-1 -translate-y-1">0</span>
                </button>
            </div>

            {/* Latest Products */}
            <section className="py-24">
                <div className="container mx-auto px-4 space-y-12">
                    <div className="flex items-end justify-between">
                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-5xl font-black text-secondary dark:text-white tracking-tighter">Latest Spare Parts</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">High-quality components for your {brand.name}</p>
                        </div>
                        <Link
                            href="/shop"
                            className="bg-secondary dark:bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:translate-x-2 transition-all shadow-xl shadow-secondary/10 dark:shadow-primary/20"
                        >
                            View All Products
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 border-y border-gray-50 dark:border-slate-900">
                <div className="container mx-auto px-4 text-center space-y-12">
                    <h3 className="text-3xl font-black text-secondary dark:text-white tracking-tighter uppercase italic">Other Categories</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Engine Components', 'Brake Systems', 'Electrical Units', 'Body Parts'].map((cat) => (
                            <button key={cat} className="px-10 py-5 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl font-black text-sm text-secondary/60 dark:text-white/60 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="relative py-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src="/contact-hero.jpg" className="w-full h-full object-cover opacity-20" alt="Contact" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">Get in touch</h2>
                            <p className="text-gray-400 text-xl font-medium max-w-lg">
                                Are you looking for a specific part? Do you want to make a custom order?
                                Or do you simply want to get in touch with our customer service team. Send us a message or call!
                            </p>
                            <button className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl shadow-primary/20">
                                Contact Us
                            </button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-16 rounded-[4rem] space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white tracking-tight">We have a recommendation for you?</h3>
                                <p className="text-gray-400 font-medium">Subscribe to our mailing list to get instant notifications about our discounts and new products straight to your inbox.</p>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:border-primary/50 transition-all"
                                />
                                <button className="w-full bg-secondary text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-black transition-all">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BrandPage;
