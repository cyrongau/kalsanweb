"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Mail, Phone, ChevronDown, LogOut, Command, Menu, X as CloseIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { useQuote } from "@/components/providers/QuoteProvider";
import { BrandLogo } from "@/components/BrandLogo";
import { API_BASE_URL } from "@/lib/config";
import SearchModal from "@/components/SearchModal";
import { useAdmin } from "@/components/providers/AdminProvider";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useState, useEffect } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { quoteItems } = useQuote();
    const { settings } = useAdmin();
    const { showToast } = useNotification();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [brands, setBrands] = useState<any[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/brands`);
                if (res.ok) {
                    const data = await res.json();
                    setBrands(data.filter((b: any) => b.is_active));
                }
            } catch (error) {
                console.error("Failed to fetch brands for navbar", error);
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = () => {
        logout();
        showToast('Logged Out', 'You have been successfully logged out', 'success');
        router.push('/auth/login');
    };

    const getAccountLink = () => {
        if (!user) return "/auth/login";
        if (user.role === 'admin' || user.role === 'super_admin') return "/admin/dashboard";
        return "/profile";
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Catalog", href: "/shop", hasDropdown: true },
        { name: "Request Quote", href: "/quote" },
        { name: "Support", href: "/support" },
    ];

    return (
        <header className="w-full">
            {/* Top Bar */}
            <div className="bg-primary py-2 text-white transition-colors duration-300">
                <div className="container mx-auto px-4 flex justify-between items-center text-xs md:text-sm text-[10px] font-bold tracking-tight">
                    <div className="flex items-center gap-4">
                        <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                            <Mail size={14} />
                            <span className="hidden sm:inline">{settings.contactEmail}</span>
                        </a>
                        <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                            <Phone size={14} />
                            <span className="hidden sm:inline">{settings.contactPhone}</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4 uppercase tracking-widest text-[9px] font-black">
                        <Link href="/shipping" className="hover:text-white/80 transition-colors">Shipping</Link>
                        <Link href="/faq" className="hover:text-white/80 transition-colors">FAQ</Link>
                        <Link href="/quote" className="hover:text-white/80 transition-colors">Request Quote</Link>
                        <Link href="/contact" className="hover:text-white/80 transition-colors">Contact</Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            {/* Main Navbar */}
            <div className={cn(
                "z-50",
                isScrolled ? "h-[76px]" : "h-auto"
            )}>
                <nav className={cn(
                    "bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300",
                    isScrolled
                        ? "fixed top-0 left-0 right-0 z-50 shadow-xl animate-in slide-in-from-top duration-500 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 py-2"
                        : "relative py-3"
                )}>
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        {/* Logo & Brand */}
                        <Link href="/" className="group">
                            <BrandLogo showText size="lg" variant="auto" />
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-secondary dark:text-white hover:text-primary transition-colors"
                        >
                            <Menu size={28} />
                        </button>

                        {/* Nav Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <div key={link.href} className="relative group/nav-item">
                                    {link.hasDropdown ? (
                                        <div className="flex items-center gap-1 font-bold py-0.5 text-gray-600 dark:text-gray-300 hover:text-primary transition-all cursor-pointer group/link">
                                            <span>{link.name}</span>
                                            <ChevronDown size={14} className="group-hover/nav-item:rotate-180 transition-transform duration-300" />
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover/nav-item:w-full" />

                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-4 opacity-0 invisible group-hover/nav-item:opacity-100 group-hover/nav-item:visible translate-y-2 group-hover/nav-item:translate-y-0 transition-all duration-300 z-[100]">
                                                <div className="px-6 py-2 border-b border-gray-50 dark:border-slate-800 mb-2">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop by Brand</p>
                                                </div>
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {brands.length > 0 ? (
                                                        brands.map((brand) => (
                                                            <Link
                                                                key={brand.id}
                                                                href={`/brand/${brand.slug}`}
                                                                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group/brand-link"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-1 border border-transparent group-hover/brand-link:border-primary/20 transition-all">
                                                                    {brand.logo_url ? (
                                                                        <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                                                                    ) : (
                                                                        <span className="text-[10px] font-black text-gray-400 uppercase">{brand.name.slice(0, 2)}</span>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-bold text-secondary dark:text-gray-300 group-hover/brand-link:text-primary transition-colors">{brand.name}</span>
                                                            </Link>
                                                        ))
                                                    ) : (
                                                        <div className="px-6 py-4 text-xs text-gray-400 font-medium italic italic">No brands available</div>
                                                    )}
                                                </div>
                                                <Link
                                                    href="/shop"
                                                    className="block px-6 py-3 mt-2 border-t border-gray-50 dark:border-slate-800 text-xs font-black text-primary uppercase tracking-widest hover:bg-primary/5 transition-colors"
                                                >
                                                    View All Parts
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "font-bold transition-all py-0.5 relative group/link",
                                                pathname === link.href
                                                    ? "text-primary border-b-2 border-primary"
                                                    : "text-gray-600 dark:text-gray-300 hover:text-primary"
                                            )}
                                        >
                                            <span className="flex items-center gap-1">
                                                {link.name}
                                            </span>
                                            {pathname !== link.href && (
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full" />
                                            )}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="flex items-center gap-2 md:gap-4 border-l border-gray-100 dark:border-muted pl-4 md:pl-6">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="hidden lg:flex items-center gap-3 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-full py-2 px-6 text-sm font-medium text-gray-400 transition-all outline-none"
                                >
                                    <Search size={18} />
                                    <span>Search parts...</span>
                                    <div className="flex items-center gap-1 ml-4 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest">
                                        <Command size={10} />
                                        <span>K</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    <Search size={22} />
                                </button>

                                <ModeToggle />
                                <Link href="/quote" className="relative group p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                    <ShoppingCart size={22} />
                                    {quoteItems.length > 0 && (
                                        <span className={cn(
                                            "absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 transition-all group-hover:scale-110",
                                            quoteItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && "animate-in zoom-in duration-300"
                                        )}>
                                            {quoteItems.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href={getAccountLink()}
                                    className="btn-primary py-2 px-6 rounded-lg text-sm bg-accent dark:bg-primary font-black uppercase tracking-wider hidden md:flex items-center gap-2 group"
                                >
                                    <User size={16} className="group-hover:scale-110 transition-transform" />
                                    {user ? (user.role === 'admin' || user.role === 'super_admin' ? 'Dashboard' : 'Profile') : 'Login'}
                                </Link>

                                {user && (
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors group relative"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                            Sign Out
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            {/* Mobile Off-canvas Menu */}
            <div className={cn(
                "fixed inset-0 z-[100] transition-all duration-500",
                isMobileMenuOpen ? "visible" : "invisible"
            )}>
                {/* Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-secondary/60 backdrop-blur-sm transition-opacity duration-500",
                        isMobileMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div className={cn(
                    "absolute top-0 right-0 w-[320px] h-full bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                        <BrandLogo showText size="md" variant="auto" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-400 hover:text-secondary dark:hover:text-white transition-colors"
                        >
                            <CloseIcon size={20} />
                        </button>
                    </div>

                    {/* Links */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Menu Navigation</p>
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl transition-all group",
                                            pathname === link.href
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900"
                                        )}
                                    >
                                        <span className="font-bold">{link.name}</span>
                                        <ChevronRight size={18} className={cn(
                                            "transition-transform group-hover:translate-x-1",
                                            pathname === link.href ? "text-white/50" : "text-gray-300 dark:text-gray-600"
                                        )} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Store Actions */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Actions</p>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/quote"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <ShoppingCart size={24} className="text-primary" />
                                    <span className="text-xs font-bold text-secondary dark:text-white">Cart</span>
                                </Link>
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                                    className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Search size={24} className="text-primary" />
                                    <span className="text-xs font-bold text-secondary dark:text-white">Search</span>
                                </button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Get in Touch</p>
                            <div className="space-y-3">
                                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-3 p-2 text-sm font-medium text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Phone size={14} />
                                    </div>
                                    {settings.contactPhone}
                                </a>
                                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 p-2 text-sm font-medium text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Mail size={14} />
                                    </div>
                                    {settings.contactEmail}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Login/Logout */}
                    <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
                        {user ? (
                            <div className="flex items-center justify-between gap-4">
                                <Link
                                    href={getAccountLink()}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 flex items-center gap-3 text-secondary dark:text-white font-bold"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm truncate">Account</p>
                                        <p className="text-[10px] text-primary uppercase font-black tracking-widest">{user.role}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                            >
                                <User size={16} />
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
