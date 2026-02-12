"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Grid, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './providers/AuthProvider';

const MobileBottomNav = () => {
    const pathname = usePathname();
    const { user } = useAuth();

    const navItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'My Vehicle', icon: Car, href: user ? '/profile/garage' : '/auth/login' },
        { name: 'Catalog', icon: Grid, href: '/shop' },
        { name: 'Account', icon: User, href: user ? (user.role === 'admin' || user.role === 'super_admin' ? '/admin/dashboard' : '/profile') : '/auth/login' },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 px-6 py-3 z-[90] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all",
                                isActive ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            )}
                        >
                            <item.icon size={22} className={cn(isActive ? "fill-primary/10" : "")} />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "opacity-100" : "opacity-0")}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
