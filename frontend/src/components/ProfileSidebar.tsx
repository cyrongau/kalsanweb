"use client";

import React from 'react';
import {
    User,
    FileText,
    ShoppingBag,
    Bookmark,
    Settings,
    LogOut,
    Car
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useRouter, usePathname } from 'next/navigation';

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const ProfileSidebar = ({ activeTab, onTabChange }: ProfileSidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const { showToast } = useNotification();

    const handleLogout = () => {
        logout();
        showToast('Logged Out', 'You have been successfully logged out', 'success');
        router.push('/auth/login');
    };

    const menuItems = [
        { name: "Profile Info", icon: User, href: '/profile' },
        { name: "Garage", icon: Car, href: '/profile/garage' },
        { name: "My Quotes", icon: FileText, href: '/profile' },
        { name: "Order History", icon: ShoppingBag, href: '/profile' },
        { name: "Saved Parts", icon: Bookmark, href: '/profile' },
        { name: "Settings", icon: Settings, href: '/profile' },
    ];

    return (
        <aside className="w-full lg:w-80 space-y-4">
            {/* Mobile Dropdown Trigger */}
            <div className="lg:hidden">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-800 p-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Current Section</p>
                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive = activeTab === item.name;
                            if (isActive) {
                                return (
                                    <div key={item.name} className="flex items-center gap-4 px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
                                        <item.icon size={20} />
                                        <span>{item.name}</span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 mt-2 grid grid-cols-2 gap-2">
                            {menuItems.map((item) => {
                                const isActive = activeTab === item.name;
                                if (isActive) return null;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            if (pathname !== item.href) router.push(item.href);
                                            onTabChange(item.name);
                                        }}
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-left"
                                    >
                                        <item.icon size={16} />
                                        <span className="truncate">{item.name}</span>
                                    </button>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all text-left"
                            >
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden p-6 animate-in fade-in slide-in-from-left duration-500">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    if (pathname !== item.href) {
                                        router.push(item.href);
                                    }
                                    onTabChange(item.name);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
