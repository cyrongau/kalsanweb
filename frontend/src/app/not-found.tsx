"use client";

import React from 'react';
import Link from 'next/link';
import {
    Search,
    Home,
    ShoppingBag,
    MessageCircle,
    Settings2,
    RotateCw
} from 'lucide-react';
import SmartSearch from '@/components/SmartSearch';

const NotFound = () => {
    return (
        <div className="relative min-h-[90vh] bg-white dark:bg-[#030712] overflow-hidden flex flex-col items-center justify-center px-4">
            {/* Background Grid/Gradient */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
                {/* Large 404 Design */}
                <div className="flex items-center justify-center gap-4 md:gap-8">
                    <span className="text-[120px] md:text-[240px] font-black text-secondary dark:text-white leading-none tracking-tighter">4</span>
                    <div className="relative group">
                        <div className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 animate-spin-slow">
                            <Settings2 className="text-white w-2/3 h-2/3" strokeWidth={2.5} />
                        </div>
                        {/* Decorative Sparkles */}
                        <div className="absolute -top-4 -right-4 text-primary animate-pulse">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                            </svg>
                        </div>
                        <div className="absolute top-1/2 right-[-20px] text-primary/40 scale-75 animate-bounce-slow">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-[120px] md:text-[240px] font-black text-secondary dark:text-white leading-none tracking-tighter">4</span>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black text-secondary dark:text-white tracking-tight">
                        Oops! This part seems to be missing <br className="hidden md:block" /> from our catalog.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        It looks like the page you are looking for has been moved, removed, or never existed in our inventory. Let's get you back on the road.
                    </p>
                </div>

                {/* Search Integration */}
                <div className="max-w-xl mx-auto w-full animate-in zoom-in-95 duration-700 delay-300">
                    <SmartSearch />
                </div>

                {/* Navigation Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-8">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-sm font-black text-secondary dark:text-white uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <Home size={18} className="text-primary" />
                        Go to Homepage
                    </Link>
                    <Link
                        href="/shop"
                        className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                    >
                        <ShoppingBag size={18} />
                        Browse Shop
                    </Link>
                    <Link
                        href="/contact"
                        className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-sm font-black text-secondary dark:text-white uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <MessageCircle size={18} className="text-primary" />
                        Contact Support
                    </Link>
                </div>
            </div>

            {/* Decorative CSS Styles for Animations */}
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default NotFound;
