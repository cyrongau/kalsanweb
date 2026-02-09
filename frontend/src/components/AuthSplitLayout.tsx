"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck } from 'lucide-react';

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    image: string;
    title: string;
    description: string;
    badges?: { icon: any; label: string }[];
}

const AuthSplitLayout = ({ children, image, title, description, badges }: AuthSplitLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-white dark:bg-[#030712] overflow-hidden">
            {/* Left: Image Side (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 z-0">
                    <img
                        src={image}
                        alt="Authentication"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 mix-blend-multiply transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 w-full p-20 flex flex-col justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-xl group-hover:scale-110 transition-transform">
                            <span className="text-primary font-black text-2xl">K</span>
                        </div>
                        <span className="text-white font-black text-2xl tracking-tighter">Kalsan Auto Parts</span>
                    </Link>

                    {/* Text Content */}
                    <div className="space-y-8 max-w-xl">
                        <h2 className="text-5xl md:text-7xl font-black text-white !text-white leading-[1.05] tracking-tighter">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={i === 3 ? "text-white/60 !text-white/60" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                        <p className="text-white/80 text-xl font-medium leading-relaxed">
                            {description}
                        </p>

                        {/* Badges */}
                        {badges && (
                            <div className="flex flex-wrap gap-4 pt-4">
                                {badges.map((badge, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest">
                                        <badge.icon size={18} />
                                        {badge.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Copyright */}
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                        © 2024 Kalsan Auto Spare Parts. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right: Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 overflow-y-auto bg-gray-50/10 dark:bg-[#030712]">
                <div className="w-full max-w-md space-y-12">
                    {children}

                    {/* Mobile Footer */}
                    <p className="lg:hidden text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] pt-12">
                        © 2024 Kalsan Auto Spare Parts. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthSplitLayout;
