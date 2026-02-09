"use client";

import React from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Download,
    RotateCcw,
    Package,
    CreditCard,
    MapPin,
    ShieldCheck,
    HelpCircle,
    Truck,
    Check,
    Settings2
} from 'lucide-react';
import OrderTracker from '@/components/OrderTracker';
import { cn } from '@/lib/utils';

import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';
import { generateReceiptPDF } from '@/lib/pdf-utils';
import { API_BASE_URL } from '@/lib/config';

const OrderDetailsPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
    const params = React.use(paramsPromise);
    const { showToast } = useNotification();
    const { settings } = useAdmin();
    const [order, setOrder] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/orders/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    showToast('Error', 'Order not found', 'error');
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
                showToast('Error', 'Something went wrong while fetching order', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchOrder();
    }, [params.id]);

    const handleDownloadInvoice = () => {
        if (!order) return;

        const invoiceItems = order.quote.items.map((i: any) => ({
            name: i.product?.name || 'Unknown Part',
            qty: i.quantity,
            price: i.unit_price || 0,
        }));

        generateReceiptPDF(
            order.id,
            invoiceItems,
            settings,
            'Card', // This could be dynamic if we store payment method
            { name: order.user?.displayName || 'Valued Customer', email: order.user?.email || 'N/A' },
            "Customer Address Information" // Could be dynamic if we store shipping addr on order
        );
        showToast('Success', 'Official Invoice generated!', 'success');
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Order Details...</p>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tighter">Order Not Found</h1>
            <Link href="/profile" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Back to Profile</Link>
        </div>
    );

    const trackerSteps = [
        { label: "Order Placed", description: new Date(order.created_at).toLocaleDateString(), icon: Check, status: 'completed' as const },
        { label: "Payment Confirmed", description: "Completed", icon: CreditCard, status: 'completed' as const },
        { label: "Shipped", description: order.tracking_number ? `FedEx #${order.tracking_number}` : "Pending", icon: Truck, status: order.status === 'shipped' || order.status === 'delivered' ? 'completed' as const : order.status === 'processing' ? 'active' as const : 'pending' as const },
        { label: "Delivered", description: order.status === 'delivered' ? "Arrived" : "Pending", icon: Package, status: order.status === 'delivered' ? 'completed' as const : order.status === 'shipped' ? 'active' as const : 'pending' as const },
    ];

    const items = order.quote.items;

    return (
        <div className="min-h-screen bg-gray-50/10 dark:bg-[#030712] py-12">
            <div className="container mx-auto px-4 space-y-8 max-w-7xl animate-in fade-in slide-in-from-top duration-700">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Link href="/profile" className="hover:text-primary transition-colors">Order History</Link>
                    <span className="opacity-50">/</span>
                    <span className="text-secondary dark:text-white">Order #{order.id.split('-')[0].toUpperCase()}</span>
                </nav>

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-secondary dark:text-white tracking-tighter uppercase">Order #{order.id.split('-')[0]}</h1>
                        <div className="flex items-center gap-4 flex-wrap">
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Placed on <span className="text-secondary dark:text-white font-black">{new Date(order.created_at).toLocaleDateString()}</span></p>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-2" />
                            <div className="flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {order.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownloadInvoice}
                            className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-secondary dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <Download size={18} />
                            Download Invoice
                        </button>
                        <button className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                            <RotateCcw size={18} />
                            Reorder All Items
                        </button>
                    </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 mb-2">Shipment Tracker</h2>
                    <OrderTracker steps={trackerSteps} />
                </div>

                {/* Main Content Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Order Items */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-soft border border-gray-100 dark:border-slate-800">
                            <h2 className="text-xl font-black text-secondary dark:text-white tracking-tighter mb-12">Order Items ({items.length})</h2>
                            <div className="divide-y divide-gray-100 dark:divide-slate-800 -mx-4">
                                {items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-8 flex items-center justify-between group hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 border border-gray-100 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                                                <img src={item.product?.image_urls?.[0] || 'https://placehold.co/400x300'} alt={item.product?.name} className="w-full h-full object-cover rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-black text-secondary dark:text-white tracking-tight text-lg">{item.product?.name}</h3>
                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    <span>SKU: {item.product?.sku}</span>
                                                    <span className="opacity-50">|</span>
                                                    <span>Qty: {item.quantity} • ${item.unit_price} per unit</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="text-xl font-black text-secondary dark:text-white">${(item.quantity * item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                            <Link href={`/shop/${item.product?.id}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Product</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Cards Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-soft border border-gray-100 dark:border-slate-800 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Shipping Address</h3>
                                </div>
                                <div className="space-y-2 ml-1">
                                    <div className="text-base font-black text-secondary dark:text-white">{order.user?.displayName}</div>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                        Industrial Logistics Center<br />
                                        Attn: Warehouse Receiving Dept.<br />
                                        4400 Industry Blvd, Suite 100<br />
                                        Hargeisa, Somaliland
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-soft border border-gray-100 dark:border-slate-800 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                        <CreditCard size={20} />
                                    </div>
                                    <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Payment Method</h3>
                                </div>
                                <div className="space-y-4 ml-1">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-100 dark:bg-slate-800 text-[9px] font-black px-2 py-1 rounded text-gray-500 uppercase">Card</span>
                                        <div className="text-base font-black text-secondary dark:text-white">Ending in •••• 4492</div>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Billing address is the same as shipping</p>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline inline-flex items-center gap-2">
                                        <Settings2 size={12} className="inline" /> Manage Payment Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Order Summary Summary Card */}
                        <div className="bg-secondary dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white/5 space-y-8 text-white">
                            <h2 className="text-xl font-black tracking-tight mb-8">Order Summary</h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="font-black">${parseFloat(order.total_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Shipping & Handling</span>
                                    <span className="font-black uppercase text-[10px] text-emerald-400">Included</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Estimated Tax (5%)</span>
                                    <span className="font-black text-emerald-400 uppercase text-[10px]">Included</span>
                                </div>
                                <div className="pt-8 flex flex-col items-center text-center border-t border-white/10 space-y-2">
                                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Total Amount</div>
                                    <div className="text-5xl font-black text-white tracking-tighter">USD ${parseFloat(order.total_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
                                <div className="flex items-center gap-3 text-primary">
                                    <ShieldCheck size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Standard Warranty Included</span>
                                </div>
                                <p className="text-[10px] text-white/40 font-bold leading-relaxed tracking-tight">Coverage expires on {new Date(new Date(order.created_at).setFullYear(new Date(order.created_at).getFullYear() + 1)).toLocaleDateString()}</p>
                            </div>

                            <div className="space-y-4 pt-6">
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all"
                                >
                                    <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                                    Download PDF Invoice
                                </button>
                                <button className="w-full border border-white/10 hover:bg-white/5 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all">
                                    <HelpCircle size={18} />
                                    Need help with this order?
                                </button>
                            </div>
                        </div>

                        {/* Order Info Stats */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-soft border border-gray-100 dark:border-slate-800 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-slate-800 pb-6">
                                <HelpCircle size={18} className="text-gray-400" />
                                <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Order Info</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between group">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID:</span>
                                    <span className="text-[11px] font-black text-secondary dark:text-white uppercase tracking-widest">#{order.payment_intent_id.split('_')[1]?.toUpperCase() || 'TX-8273'}</span>
                                </div>
                                <div className="flex justify-between group">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordered By:</span>
                                    <span className="text-[11px] font-black text-secondary dark:text-white uppercase tracking-widest">{order.user?.displayName?.split(' ')[0]}</span>
                                </div>
                                <div className="flex justify-between group">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference:</span>
                                    <span className="text-[11px] font-black text-secondary dark:text-white uppercase tracking-widest">KLSN-{order.id.split('-')[0].toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Sticky Action Bar for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 p-4 border-t border-gray-100 dark:border-slate-800 flex gap-4 z-50 shadow-2xl">
                <button
                    onClick={handleDownloadInvoice}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                    Download Invoice
                </button>
                <button className="flex-1 bg-secondary text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs">Help</button>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
