"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/components/providers/AdminProvider';

const DEFAULT_SLIDES = [
    {
        id: 1,
        headline: 'TVS King Soft Top',
        subtext: 'Genuine Canvas Roof for Your Vehicle',
        cta: 'Explore Now',
        link: '/shop',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 2,
        headline: 'Engine Performance',
        subtext: 'Pistons, Rings & Gaskets for TVS King',
        cta: 'Shop Parts',
        link: '/shop',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop'
    }
];

const HomeHero = () => {
    const { settings } = useAdmin();
    const slides = settings.heroSlider?.length > 0 ? settings.heroSlider : DEFAULT_SLIDES;
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative h-[600px] md:h-[800px] w-full overflow-hidden bg-slate-900">
            {slides.map((slide, idx) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-all duration-1000 ease-in-out transform",
                        idx === current ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-110 translate-x-full"
                    )}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={slide.image}
                            alt={slide.headline}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent dark:from-slate-950/90" />
                    </div>

                    {/* Content */}
                    <div className="container mx-auto px-4 h-full flex items-center justify-center md:justify-start relative z-10">
                        <div className="max-w-4xl md:max-w-2xl space-y-8 animate-in slide-in-from-left-12 duration-1000 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/5 dark:bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full text-[#abbcdd] font-black text-[10px] uppercase tracking-[0.2em] border border-[#abbcdd]/20">
                                <span className="w-2 h-2 bg-[#abbcdd] rounded-full animate-pulse" />
                                Premium Quality Parts
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black !text-[#fdfeff] leading-[1] tracking-tighter uppercase drop-shadow-2xl">
                                {slide.headline.split(' ').map((word, i) => (
                                    <span key={i} className={i === 1 ? "!text-[#abbcdd] dark:!text-[#3380fa]" : ""}>{word} </span>
                                ))}
                            </h1>
                            <p className="text-gray-300 text-lg md:xl font-medium max-w-xl leading-relaxed">
                                {slide.subtext}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                                <Link
                                    href={slide.link}
                                    className="btn-primary w-full sm:w-auto min-w-[220px] py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest bg-primary"
                                >
                                    {slide.cta} <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            idx === current ? "w-12 bg-[#abbcdd] dark:bg-[#3b82f6]" : "w-2 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <button
                    onClick={prev}
                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#abbcdd] dark:hover:bg-[#3b82f6] hover:border-[#abbcdd] dark:hover:border-[#3b82f6] transition-all pointer-events-auto group"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={next}
                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#abbcdd] dark:hover:bg-[#3b82f6] hover:border-[#abbcdd] dark:hover:border-[#3b82f6] transition-all pointer-events-auto group"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
};

export default HomeHero;
