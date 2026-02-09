"use client";

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '@/lib/utils';
import { ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import SmartSearch from './SmartSearch';

interface LegalLayoutProps {
    title: string;
    subtitle: string;
    lastUpdated: string;
    children: React.ReactNode;
    breadcrumb: { name: string; href: string }[];
    heroImage?: string;
    showSearch?: boolean;
}

const LegalLayout = ({
    title,
    subtitle,
    lastUpdated,
    children,
    breadcrumb,
    heroImage = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000",
    showSearch = false
}: LegalLayoutProps) => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#030712] flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[45vh] min-h-[450px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-primary/90 dark:bg-slate-950/90 backdrop-blur-[2px]" />

                {/* Abstract patterns */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <nav className="flex items-center justify-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Home</Link>
                        {breadcrumb.map((item, i) => (
                            <React.Fragment key={i}>
                                <ChevronRight size={12} className="text-white/40" />
                                <Link href={item.href} className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">{item.name}</Link>
                            </React.Fragment>
                        ))}
                    </nav>

                    <div className="space-y-4 mb-10">
                        <p className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px] animate-in fade-in slide-in-from-bottom-4 duration-700">Help Center</p>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 uppercase">
                            {title}
                        </h1>
                        <p className="text-white/80 font-medium text-lg max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {subtitle}
                        </p>
                    </div>

                    {showSearch && (
                        <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-700 delay-300">
                            <SmartSearch />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 -mt-20 relative z-20 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-black/10 border border-gray-100 dark:border-slate-800 p-8 md:p-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-primary rounded-full" />
                                <span className="text-xs font-black uppercase tracking-widest text-secondary dark:text-white">Official Policy</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Last Updated: {lastUpdated}
                            </span>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-secondary dark:prose-headings:text-white
                            prose-p:text-gray-500 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg
                            prose-li:text-gray-500 dark:prose-li:text-gray-400 prose-li:text-lg
                            prose-strong:text-secondary dark:prose-strong:text-white">
                            {children}
                        </div>
                    </div>

                    {/* Quick Help Footer */}
                    <div className="mt-12 text-center flex flex-col items-center gap-6">
                        <p className="text-gray-400 font-bold italic">Have questions about our {title.toLowerCase()}?</p>
                        <Link href="/support" className="bg-secondary dark:bg-primary text-white px-10 py-5 rounded-2xl flex items-center gap-3 group font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:scale-105 transition-all active:scale-95">
                            Contact Support
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalLayout;
