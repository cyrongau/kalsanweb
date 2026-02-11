"use client";

import React, { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Package,
    Tag,
    Users,
    Settings,
    LifeBuoy,
    Menu,
    X,
    Bell,
    Settings2,
    ShieldCheck,
    LogOut,
    Plus,
    Search,
    MessageCircle,
    Star
} from 'lucide-react';
import SystemUpdateModal from './SystemUpdateModal';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/components/providers/AdminProvider';
import NewQuoteModal from './NewQuoteModal';
import { BrandLogo } from '@/components/BrandLogo';

interface SidebarItemProps {
    href: string;
    icon: any;
    label: string;
    active?: boolean;
    badge?: number;
}

const SidebarItem = ({ href, icon: Icon, label, active, badge }: SidebarItemProps) => (
    <Link
        href={href}
        className={cn(
            "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-gray-400 group-hover:text-primary")} />
            <span className="font-bold text-sm tracking-tight">{label}</span>
        </div>
        {badge !== undefined && badge > 0 && (
            <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-[10px] font-black text-white animate-pulse shadow-lg shadow-red-500/20">
                {badge}
            </div>
        )}
    </Link>
);

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, settings, unreadQuotesCount, unreadOrdersCount } = useAdmin();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);


    useEffect(() => {
        // Show update modal logic with frequency regulation
        if (settings.availableUpdate) {
            const lastShown = localStorage.getItem('lastUpdateModalShown');
            const now = new Date().getTime();
            const dayInMs = 24 * 60 * 60 * 1000;

            if (!lastShown || now - parseInt(lastShown) > dayInMs) {
                const timer = setTimeout(() => {
                    setShowUpdateModal(true);
                    localStorage.setItem('lastUpdateModalShown', now.toString());
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [settings.availableUpdate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    const notifications = [
        { id: '1', title: 'New Quote Request', message: 'John Doe requested a quote for Brake Pads.', time: '2 mins ago', unread: true, link: '/admin/quotes' },
        { id: '2', title: 'Inventory Alert', message: 'Brembo Brake Pads are running low (8 items left).', time: '1 hour ago', unread: true, link: '/admin/inventory' },
        { id: '3', title: 'Customer Registration', message: 'New customer Jane Smith has registered.', time: '3 hours ago', unread: false, link: '/admin/customers' },
    ];

    const menuItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/chat', icon: MessageCircle, label: 'Live Chat' },
        { href: '/admin/quotes', icon: MessageSquare, label: 'Quote Inquiries' },
        { href: '/admin/orders', icon: Package, label: 'Customer Orders' },
        { href: '/admin/reviews', icon: Star, label: 'Reviews' },
        { href: '/admin/customers', icon: Users, label: 'Customers' },
        { href: '/admin/cms', icon: Settings2, label: 'Content Manager' },
        { href: '/admin/inventory', icon: Package, label: 'Inventory' },
        { href: '/admin/taxonomy', icon: Tag, label: 'Taxonomy Manager' },
        { href: '/admin/users', icon: Users, label: 'User Management' },
        { href: '/admin/roles', icon: ShieldCheck, label: 'Roles & Permissions' },
    ];

    const systemItems = [
        { href: '/admin/settings', icon: Settings, label: 'Site Settings' },
        { href: '/admin/support', icon: LifeBuoy, label: 'Support' },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-slate-950 flex transition-colors duration-500">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white p-6 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand */}
                <Link href="/" className="mb-10 group cursor-pointer block">
                    <BrandLogo
                        size="md"
                        variant="dark"
                        className="transition-transform group-hover:scale-105"
                    />
                </Link>

                {/* Navigation */}
                <nav className="flex-1 space-y-8">
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                {...item}
                                active={pathname === item.href}
                                badge={
                                    item.href === '/admin/quotes' ? unreadQuotesCount :
                                        item.href === '/admin/orders' ? unreadOrdersCount :
                                            undefined
                                }
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <p className="px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">System</p>
                        <div className="space-y-1">
                            {systemItems.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    {...item}
                                    active={pathname === item.href}
                                />
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User Profile Switcher */}
                <div className="mt-auto pt-6 border-t border-white/5">
                    <Link href="/admin/profile" className={cn(
                        "w-full bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center gap-3 transition-all group border border-transparent",
                        pathname === '/admin/profile' && "bg-white/10 border-white/10 shadow-lg shadow-black/20"
                    )}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                            <img
                                src={profile.avatar}
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-bold truncate text-white">{profile.displayName}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.15em] truncate">SUPER ADMIN</p>
                        </div>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all group border border-transparent"
                    >
                        <LogOut size={20} className="transition-transform group-hover:scale-110" />
                        <span className="font-bold text-sm tracking-tight">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar/Header */}
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-8 transition-colors relative z-[60]">
                    <h1 className="text-xl font-black text-secondary dark:text-white tracking-tight uppercase">
                        {menuItems.find(i => i.href === pathname)?.label || "Dashboard"}
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-primary/20 transition-all group relative">
                            <Search className="text-gray-400 mr-3" size={18} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-transparent border-none outline-none text-sm w-full font-medium text-secondary dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all relative",
                                    showNotifications
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800"
                                )}
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-4 w-96 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 py-6 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="px-8 pb-4 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                        <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Notifications</h3>
                                        <button className="text-[10px] font-black text-primary uppercase">Mark all read</button>
                                    </div>
                                    <div className="max-h-[min(500px,70vh)] overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <Link
                                                key={notif.id}
                                                href={notif.link}
                                                onClick={() => setShowNotifications(false)}
                                                className="flex items-start gap-4 px-8 py-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                                            >
                                                <div className={cn(
                                                    "mt-1 w-2 h-2 rounded-full flex-shrink-0 transition-all",
                                                    notif.unread ? "bg-primary scale-110 shadow-lg shadow-primary/20" : "bg-gray-200 dark:bg-slate-700"
                                                )} />
                                                <div className="space-y-1 flex-1">
                                                    <p className="text-sm font-bold text-secondary dark:text-white group-hover:text-primary transition-colors">{notif.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">{notif.time}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="px-8 pt-4 border-t border-gray-50 dark:border-slate-800 text-center">
                                        <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">See all activity</button>
                                    </div>
                                </div>
                            )}

                            <Link
                                href="/"
                                className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                                title="Go to Storefront"
                            >
                                <LayoutDashboard size={20} />
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsNewQuoteModalOpen(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group active:scale-95"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            New Quote
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-gray-50/10 dark:bg-transparent">
                    {children}
                </main>
            </div>

            <NewQuoteModal
                isOpen={isNewQuoteModalOpen}
                onClose={() => setIsNewQuoteModalOpen(false)}
            />

            <SystemUpdateModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
            />
        </div>
    );
};

export default AdminLayout;
