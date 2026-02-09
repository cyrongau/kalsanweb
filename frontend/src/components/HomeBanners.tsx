"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import { useAdmin } from '@/components/providers/AdminProvider';

const banners = [
    {
        id: 1,
        title: 'FREE SHIPPING',
        subtitle: 'Orders over $200',
        color: 'bg-[#B4C424]',
        link: '/offers/free-shipping',
        image: 'https://placehold.co/100x100/white/333?text=Truck'
    },
    {
        id: 2,
        title: 'NEW ARRIVALS',
        subtitle: 'Modern Collection',
        color: 'bg-[#F2D7B1]',
        link: '/collections/new-arrivals',
        image: 'https://placehold.co/100x100/white/333?text=New'
    }
];

const HomeBanners = () => {
    const { settings } = useAdmin();
    const activeBanners = settings.banners?.length > 0 ? settings.banners : banners;

    return (
        <section className="py-24 bg-white dark:bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeBanners.map((banner) => (
                        <Link
                            key={banner.id}
                            href={banner.link}
                            className={cn(
                                "group relative h-[350px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-12 transition-all hover:translate-y-[-10px] shadow-soft",
                                banner.color
                            )}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-black/0 group-hover:bg-black/5 transition-colors" />

                            <div className="relative z-10 space-y-6">
                                <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-[2rem] mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <img src={banner.image} alt={banner.title} className="w-10 h-10 object-contain" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Special Offer</p>
                                    <h3 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter uppercase leading-none">
                                        {banner.title}
                                    </h3>
                                    <p className="text-secondary/60 font-bold text-lg">{banner.subtitle}</p>
                                </div>
                                <button className="bg-secondary text-white dark:text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95">
                                    Shop Now
                                </button>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeBanners;
