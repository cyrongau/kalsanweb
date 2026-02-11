"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Check,
    Download,
    ArrowRight,
    Package,
    MapPin,
    CreditCard,
    ShoppingCart,
    Search,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateReceiptPDF } from '@/lib/pdf-utils';
import { useAdmin } from '@/components/providers/AdminProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { useQuote, Product } from '@/components/providers/QuoteProvider';

const OrderTrackerStep = ({ label, description, time, status }: { label: string; description: string; time?: string; status: 'completed' | 'active' | 'pending' }) => {
    const isCompleted = status === 'completed';
    const isActive = status === 'active';

    return (
        <div className="flex-1 flex flex-col items-center text-center space-y-4 group">
            <div className="relative">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    isCompleted ? "bg-primary text-white shadow-xl shadow-primary/20" :
                        isActive ? "bg-white dark:bg-slate-800 border-2 border-primary text-primary" :
                            "bg-gray-100 dark:bg-slate-800 text-gray-300"
                )}>
                    {isCompleted ? <Check size={24} strokeWidth={3} /> :
                        isActive ? <Package size={24} /> : <Package size={24} />}
                </div>
                {/* Connector Line Logic handled in parent */}
            </div>
            <div className="space-y-1">
                <p className={cn(
                    "text-xs font-black uppercase tracking-widest",
                    isActive ? "text-primary" : "text-secondary dark:text-white"
                )}>{label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
                {time && <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">{time}</p>}
            </div>
        </div>
    );
};

const OrderSuccessPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
    const params = React.use(paramsPromise);
    const { settings } = useAdmin();
    const orderId = params.id;
    const [order, setOrder] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { user } = useAuth(); // Assuming useAuth is available or we user useAdmin context if it has fetching generic logic, but standard fetch matches

    // We need api url
    const API_URL = 'http://localhost:3001'; // Should use config but hardcoding for consistent pattern in this file or use process.env.NEXT_PUBLIC_API_URL

    const [recommendedItems, setRecommendedItems] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchRecommended = async () => {
            try {
                // Fetch products (limit 20 to get a pool to choose from)
                const res = await fetch(`${API_URL}/products?limit=20`);
                if (res.ok) {
                    const data = await res.json();
                    const products = data.items || data; // Handle pagination structure or array
                    if (Array.isArray(products)) {
                        // Shuffle and pick 4
                        const shuffled = products.sort(() => 0.5 - Math.random());
                        const selected = shuffled.slice(0, 4).map((p: any) => {
                            let imgUrl = "https://images.unsplash.com/photo-1635773107344-93e11749876a?auto=format&fit=crop&q=80&w=200";
                            if (p.image_urls && p.image_urls.length > 0) {
                                const url = p.image_urls[0];
                                imgUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
                            }
                            return {
                                name: p.name,
                                tag: p.category?.name?.toUpperCase() || "RECOMMENDED", // Use category as tag
                                price: `$${Number(p.price).toFixed(2)}`,
                                image: imgUrl
                            };
                        });
                        setRecommendedItems(selected);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            }
        };
        fetchRecommended();
    }, []);

    React.useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const response = await fetch(`${API_URL}/orders/${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);
                } else {
                    console.error('Failed to fetch order');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const { addToQuote, clearQuote } = useQuote();
    const [showQuoteDialog, setShowQuoteDialog] = React.useState(false);
    const [pendingItem, setPendingItem] = React.useState<Product | null>(null);
    const [hasAskedQuote, setHasAskedQuote] = React.useState(false);

    const handleAddToQuoteClick = (item: any) => {
        const product: Product = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.tag
        };

        if (hasAskedQuote) {
            addToQuote(product);
        } else {
            setPendingItem(product);
            setShowQuoteDialog(true);
        }
    };

    const confirmNewQuote = () => {
        clearQuote();
        if (pendingItem) addToQuote(pendingItem);
        setHasAskedQuote(true);
        setShowQuoteDialog(false);
        setPendingItem(null);
    };

    const confirmAddToExisting = () => {
        if (pendingItem) addToQuote(pendingItem);
        setHasAskedQuote(true);
        setShowQuoteDialog(false);
        setPendingItem(null);
    };

    const handleDownloadInvoice = async () => {
        if (!order) return;
        const receiptItems = order.quote.items.map((item: any) => ({
            name: item.product.name,
            qty: item.quantity,
            price: Number(item.unit_price || 0)
        }));
        await generateReceiptPDF(orderId, receiptItems, settings, "Visa ending in 4492");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#030712] flex flex-col">
                {/* Navbar removed */}
                <main className="flex-1 py-16 flex items-center justify-center">
                    <div className="animate-pulse text-xl font-bold text-gray-400">Loading order details...</div>
                </main>
                {/* Footer removed */}
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#030712] flex flex-col">
                {/* Navbar removed */}
                <main className="flex-1 py-16 flex flex-col items-center justify-center gap-4">
                    <div className="text-xl font-bold text-red-500">Order not found</div>
                    <Link href="/" className="btn-primary px-6 py-3 rounded-xl">Back to Home</Link>
                </main>
                {/* Footer removed */}
            </div>
        );
    }

    // Map order items from the fetched data
    const orderItems = order.quote.items.map((item: any) => {
        let imageUrl = "https://images.unsplash.com/photo-1635773107344-93e11749876a?auto=format&fit=crop&q=80&w=200";
        if (item.product.image_urls && item.product.image_urls.length > 0) {
            const url = item.product.image_urls[0];
            imageUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
        }

        return {
            name: item.product.name,
            sku: item.product.sku || 'N/A',
            price: Number(item.unit_price || 0),
            image: imageUrl,
            quantity: item.quantity
        };
    });



    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#030712] flex flex-col">
            {/* Navbar removed to prevent duplication with layout */}

            <main className="flex-1 py-16">
                <div className="container mx-auto px-4 max-w-6xl space-y-12">

                    {/* Status Hero */}
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-primary mx-auto ring-8 ring-blue-50/50 dark:ring-blue-500/5">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Your Order is on its Way!</h1>
                            <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                                Thank you for choosing Kalsan Auto. We've received your order and our team is already preparing it.
                            </p>
                        </div>
                    </div>

                    {/* Order Summary Block */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Order Summary</div>
                                <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tighter">#{orderId}</h2>
                            </div>
                            <div className="flex gap-12">
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</div>
                                    <div className="text-base font-black text-secondary dark:text-white text-nowrap">{new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</div>
                                    <div className="text-base font-black text-primary text-nowrap">${Number(order.total_paid).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tracker */}
                        <div className="relative flex items-center justify-between px-8">
                            <div className="absolute top-7 left-[15%] right-[15%] h-[2px] bg-gray-100 dark:bg-slate-800 -z-0">
                                <div className={cn("h-full bg-primary transition-all duration-1000",
                                    order.status === 'delivered' ? "w-[100%]" :
                                        order.status === 'shipped' ? "w-[66%]" :
                                            order.status === 'processing' ? "w-[33%]" :
                                                "w-[0%]"
                                )} />
                            </div>
                            <OrderTrackerStep
                                label="Confirmed"
                                description={new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                status="completed"
                            />
                            <OrderTrackerStep
                                label="Processing"
                                description="In Progress"
                                status={
                                    ['shipped', 'delivered'].includes(order.status) ? 'completed' :
                                        order.status === 'processing' ? 'active' : 'pending'
                                }
                            />
                            <OrderTrackerStep
                                label="Shipped"
                                description={order.tracking_number || "Pending"}
                                status={
                                    order.status === 'delivered' ? 'completed' :
                                        order.status === 'shipped' ? 'active' : 'pending'
                                }
                            />
                            <OrderTrackerStep
                                label="Delivered"
                                description="Estimated soon"
                                status={
                                    order.status === 'delivered' ? 'completed' : 'pending'
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Items Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800">
                                <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest flex items-center gap-3 mb-10">
                                    <Package size={20} className="text-primary" />
                                    Items in your package
                                </h3>
                                <div className="space-y-10">
                                    {orderItems.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-black text-secondary dark:text-white tracking-tight leading-tight">{item.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sku}</div>
                                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-base font-black text-secondary dark:text-white">${item.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-dotted border-gray-200 dark:border-slate-800 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold font-mono">
                                        <span className="text-gray-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                                        <span className="text-secondary dark:text-white">${Number(order.total_paid).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold font-mono">
                                        <span className="text-gray-400 uppercase tracking-widest text-[10px]">Shipping</span>
                                        <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Free</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-center">
                                        <span className="text-base font-black text-secondary dark:text-white uppercase tracking-widest">Total</span>
                                        <span className="text-2xl font-black text-primary">${Number(order.total_paid).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Address Side Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Details</h3>
                                    <MapPin size={16} className="text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-black text-secondary dark:text-white">{order.user?.name || "Customer"}</div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        {order.user?.email}<br />
                                        {order.quote?.guest_phone || "No phone provided"}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Side Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Info</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg flex items-center justify-center">
                                        <div className="w-8 h-4 bg-primary/10 rounded flex items-center justify-center text-[8px] font-black text-primary">CARD</div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-xs font-black text-secondary dark:text-white uppercase tracking-tight">Paid via Card</div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ref: ...{order.payment_intent_id?.slice(-4) || "0000"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-8">
                                <Link href="/shop">
                                    <button className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group transition-all shrink-0">
                                        <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />
                                        Continue Shopping
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-secondary dark:text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                                >
                                    <Download size={14} />
                                    Download Invoice (PDF)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-secondary dark:text-white tracking-tighter">You might also need...</h2>
                            <Link href="/shop" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                                View maintenance kits
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {recommendedItems.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-6 group hover:scale-[1.02] transition-transform duration-500">
                                    <div className="w-full aspect-square rounded-2xl bg-gray-50 dark:bg-slate-800 overflow-hidden border border-gray-50 dark:border-slate-700">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest">{item.tag}</div>
                                        <h4 className="text-xs font-black text-secondary dark:text-white tracking-tight line-clamp-2 leading-tight">{item.name}</h4>
                                        <button
                                            onClick={() => handleAddToQuoteClick(item)}
                                            className="w-full py-2 bg-gray-50 dark:bg-slate-800 hover:bg-primary hover:text-white text-secondary dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <ShoppingCart size={12} className="group-hover/btn:scale-110 transition-transform" />
                                            Add to Quote
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Quote Confirmation Dialog */}
            {showQuoteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800 relative">
                        <button
                            onClick={() => setShowQuoteDialog(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                <ShoppingCart size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight">Start New Quote?</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Do you want to create a new quote request or add this item to your existing session?
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={confirmNewQuote}
                                    className="py-3 px-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                                >
                                    Create New
                                </button>
                                <button
                                    onClick={confirmAddToExisting}
                                    className="py-3 px-4 bg-gray-100 dark:bg-slate-800 text-secondary dark:text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Add to Current
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default OrderSuccessPage;
