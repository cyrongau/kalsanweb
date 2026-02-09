"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Search,
    Download,
    Eye,
    CheckCircle2,
    Truck,
    Package,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';

const OrdersPage = () => {
    const { showToast } = useNotification();
    const { markAsRead } = useAdmin();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const handleExportCSV = () => {
        const headers = 'Order ID,Customer,Total,Status,Date\n';
        const csvContent = orders.map(o =>
            `${o.id},${o.user?.displayName},${o.total_paid},${o.status},${o.created_at}`
        ).join('\n');

        const blob = new Blob([headers + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customer_orders_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Export Successful', 'Orders have been downloaded as CSV.', 'success');
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const baseUrl = window.location.origin.replace('3000', '3001');
            const res = await fetch(`${baseUrl}/orders`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            showToast('Error', 'Failed to load customer orders.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = (o.user?.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-secondary dark:text-white uppercase tracking-tight">Customer Orders</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Track payments and manage shipment status.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-primary/20 transition-all"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {['All', 'Paid', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                    statusFilter === status
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-white dark:bg-slate-900 text-gray-400 border-gray-100 dark:border-slate-800 hover:border-primary/20"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-50 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Orders...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className={cn(
                                            "group transition-colors",
                                            !order.is_read ? "bg-primary/[0.03] dark:bg-primary/[0.05]" : "hover:bg-gray-50/30 dark:hover:bg-slate-800/10"
                                        )}
                                    >
                                        <td className="px-8 py-6 relative">
                                            {!order.is_read && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                            )}
                                            <span className={cn(
                                                "text-sm truncate block max-w-[100px]",
                                                !order.is_read ? "font-black text-primary" : "font-bold text-secondary dark:text-white"
                                            )}>
                                                {order.id.split('-')[0]}...
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-secondary dark:text-white">{order.user?.displayName || 'Guest'}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{order.user?.email || 'No Email'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-secondary dark:text-white">
                                                ${order.total_paid?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                                                order.status === 'paid' ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" :
                                                    order.status === 'processing' ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10" :
                                                        order.status === 'shipped' ? "bg-purple-50 text-purple-500 dark:bg-purple-500/10" :
                                                            "bg-gray-50 text-gray-500 dark:bg-slate-800"
                                            )}>
                                                {order.status === 'paid' && <ShieldCheck size={10} />}
                                                {order.status === 'processing' && <Package size={10} />}
                                                {order.status === 'shipped' && <Truck size={10} />}
                                                {order.status === 'delivered' && <CheckCircle2 size={10} />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-gray-500 tracking-tight">
                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    onClick={() => !order.is_read && markAsRead('orders', order.id)}
                                                    className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-primary rounded-xl transition-all group/btn"
                                                >
                                                    <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrdersPage;
