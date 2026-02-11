"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    User,
    Mail,
    Calendar,
    Clock,
    Package,
    DollarSign,
    Truck,
    ShieldCheck,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';
import { API_BASE_URL } from '@/lib/config';

const OrderDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useNotification();
    const { markAsRead } = useAdmin();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/orders/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                    setStatus(data.status);
                    setTrackingNumber(data.tracking_number || '');

                    // Mark as read if it's currently unread
                    if (!data.is_read) {
                        markAsRead('orders', data.id);
                    }
                } else {
                    showToast('Error', 'Order not found', 'error');
                    router.push('/admin/orders');
                }
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchOrder();
    }, [params.id]);

    const handleUpdateStatus = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${params.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, trackingNumber })
            });

            if (res.ok) {
                showToast('Status Updated', 'The order status has been successfully updated.', 'success');
                setOrder({ ...order, status, tracking_number: trackingNumber });
            } else {
                showToast('Error', 'Failed to update status.', 'error');
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Order Details...</p>
            </div>
        </AdminLayout>
    );

    if (!order) return null;

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
                        <span className="text-xs font-black uppercase tracking-widest">Back to Orders</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            order.status === 'paid' ? "bg-emerald-50 text-emerald-500 border-emerald-100" :
                                order.status === 'processing' ? "bg-blue-50 text-blue-500 border-blue-100" :
                                    "bg-purple-50 text-purple-500 border-purple-100"
                        )}>
                            Current Status: {order.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                            <h2 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <Package size={24} className="text-primary" />
                                Order Items
                            </h2>
                            <div className="divide-y divide-gray-50 dark:divide-slate-800">
                                {order.quote?.items?.map((item: any) => {
                                    let imageUrl = '/placeholder.png';
                                    if (item.product?.image_urls?.[0]) {
                                        const url = item.product.image_urls[0];
                                        imageUrl = url.startsWith('http') ? url : `http://localhost:3001${url}`;
                                    }
                                    return (
                                        <div key={item.id} className="py-6 flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 overflow-hidden">
                                                <img src={imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-secondary dark:text-white">{item.product?.name}</h4>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">SKU: {item.product?.sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-400 font-bold block">Qty: {item.quantity}</span>
                                                <span className="text-sm font-black text-secondary dark:text-white">${(item.unit_price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="pt-8 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center text-xl font-black text-secondary dark:text-white">
                                <span>Total Paid</span>
                                <span className="text-3xl text-primary">${order.total_paid?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Shipment Control */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <Truck size={24} className="text-primary" />
                                Shipment Management
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all text-secondary dark:text-white"
                                    >
                                        <option value="paid">Paid</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tracking Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Tracking ID..."
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all text-secondary dark:text-white"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                            >
                                Update Order Fulfillment
                            </button>
                        </div>
                    </div>

                    {/* Customer & Payment Info */}
                    <div className="space-y-8">
                        <div className="bg-primary rounded-[2.5rem] p-10 text-white space-y-6">
                            <div className="flex items-center gap-4">
                                <User size={24} />
                                <h3 className="font-black uppercase tracking-tight">{order.user?.name || 'Guest'}</h3>
                            </div>
                            <div className="space-y-3 text-sm text-white/80 font-medium">
                                <p className="flex items-center gap-2"><Mail size={16} /> {order.user?.email}</p>
                                <p className="flex items-center gap-2"><Calendar size={16} /> Since {new Date(order.user?.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Reference</h4>
                            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 space-y-4">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-black uppercase block tracking-widest">Payment Intent ID</span>
                                    <span className="text-xs font-mono font-bold break-all">{order.payment_intent_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderDetailsPage;
