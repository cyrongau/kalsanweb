"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    Clock,
    DollarSign,
    Shield,
    FileText,
    ShoppingBag,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { API_BASE_URL } from '@/lib/config';

const UserProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useNotification();
    const [user, setUser] = useState<any>(null);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, quotesRes, ordersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/users/${params.id}`),
                    fetch(`${API_BASE_URL}/quotes`),
                    // Assuming an orders endpoint exists. If not, we might need to adjust.
                    fetch(`${API_BASE_URL}/orders`)
                ]);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                } else {
                    showToast('Error', 'User not found', 'error');
                    router.push('/admin/users');
                    return;
                }

                if (quotesRes.ok) {
                    const allQuotes = await quotesRes.json();
                    // Client-side filtering for now
                    const userQuotes = allQuotes.filter((q: any) => q.user?.id === params.id);
                    setQuotes(userQuotes);
                }

                if (ordersRes.ok) {
                    const allOrders = await ordersRes.json();
                    // Client-side filtering
                    const userOrders = allOrders.filter((o: any) => o.user?.id === params.id);
                    setOrders(userOrders);
                }

            } catch (error) {
                console.error("Failed to fetch user data:", error);
                showToast('Error', 'Failed to load profile.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchData();
    }, [params.id]);

    if (isLoading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Profile...</p>
            </div>
        </AdminLayout>
    );

    if (!user) return null;

    const stats = [
        { label: 'Total Quotes', value: quotes.length, icon: FileText, color: 'text-blue-500' },
        { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-emerald-500' },
        { label: 'Total Spent', value: `$${orders.reduce((acc, o) => acc + Number(o.total_paid || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-secondary dark:text-white' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 group text-gray-500 hover:text-secondary transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Back to Users</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            user.role === 'admin' || user.role === 'super_admin' ? "bg-purple-50 text-purple-500 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20" :
                                "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20"
                        )}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-transparent" />
                            <div className="relative">
                                <div className="w-24 h-24 mx-auto rounded-[2rem] bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-3xl font-black text-primary mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                    {user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()}
                                </div>
                                <h1 className="text-2xl font-black text-secondary dark:text-white tracking-tight">{user.name || 'No Name'}</h1>
                                <p className="text-gray-400 font-medium text-sm mt-1">{user.email}</p>

                                <div className="mt-8 space-y-4 text-left">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-gray-400 shadow-sm">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                            <p className="text-sm font-bold text-secondary dark:text-white">{user.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-gray-400 shadow-sm">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</p>
                                            <p className="text-sm font-bold text-secondary dark:text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                            <h3 className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <Shield size={20} className="text-primary" />
                                Account Stats
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm", stat.color)}>
                                                <stat.icon size={18} />
                                            </div>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        <span className={cn("text-lg font-black", stat.color)}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 w-fit">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'overview' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-secondary dark:hover:text-white"
                                )}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('quotes')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'quotes' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-secondary dark:hover:text-white"
                                )}
                            >
                                Quotes ({quotes.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'orders' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-secondary dark:hover:text-white"
                                )}
                            >
                                Orders ({orders.length})
                            </button>
                        </div>

                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {/* Recent Activity Logic could go here, for now showing recent quotes */}
                                <h3 className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight pl-4">Recent Activity</h3>
                                {quotes.slice(0, 3).map(quote => (
                                    <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="block group">
                                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-secondary dark:text-white group-hover:text-primary transition-colors">
                                                            Quote #{quote.id.split('-')[0]}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {new Date(quote.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                    quote.status === 'pending' ? "bg-blue-50 text-blue-500" :
                                                        quote.status === 'price_ready' ? "bg-emerald-50 text-emerald-500" : "bg-gray-50 text-gray-500"
                                                )}>
                                                    {quote.status}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {activeTab === 'quotes' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {quotes.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400">No quotes found</div>
                                ) : quotes.map(quote => (
                                    <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="block group">
                                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                                                    <FileText size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-secondary dark:text-white">Quote #{quote.id.split('-')[0]}</h4>
                                                    <p className="text-xs text-gray-400">{quote.items?.length || 0} Items • {quote.total_amount ? `$${quote.total_amount}` : 'Pending'}</p>
                                                </div>
                                            </div>
                                            <ChevronLeft size={16} className="rotate-180 text-gray-300 group-hover:text-primary transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {orders.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400">No orders found</div>
                                ) : orders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                                <ShoppingBag size={20} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary dark:text-white">Order #{order.id.split('-')[0]}</h4>
                                                <p className="text-xs text-gray-400">${order.total_paid} • {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserProfilePage;
