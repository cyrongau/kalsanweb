"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    CreditCard,
    Building2,
    Smartphone,
    Lock,
    CheckCircle2,
    ShieldCheck,
    Truck,
    Smartphone as MobileIcon,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';
import { generateReceiptPDF } from '@/lib/pdf-utils';
import { API_BASE_URL } from '@/lib/config';

interface MobileProvider {
    id: string;
    name: string;
    logo: string;
}

const mobileProviders: MobileProvider[] = [
    { id: 'edahab', name: 'eDahab', logo: 'E' },
    { id: 'waafi', name: 'WAAFI', logo: 'W' },
    { id: 'premier', name: 'Premier', logo: 'P' },
    { id: 'telesom', name: 'Zaad', logo: 'Z' },
    { id: 'somnet', name: 'EVC Plus', logo: 'S' },
];

const CheckoutPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
    const params = React.use(paramsPromise);
    const router = useRouter();
    const { showToast } = useNotification();
    const { settings } = useAdmin();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
    const [mobileProvider, setMobileProvider] = useState<string>('edahab');
    const [isProcessing, setIsProcessing] = useState(false);
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchQuote = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const quoteId = searchParams.get('quoteId');

            if (!quoteId) {
                showToast('Error', 'No quote information found', 'error');
                router.push('/profile');
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}`);
                if (res.ok) {
                    const data = await res.json();
                    setQuote(data);
                } else {
                    showToast('Error', 'Quote not found', 'error');
                    router.push('/profile');
                }
            } catch (error) {
                console.error("Failed to fetch quote:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, [router, showToast]);

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quote) return;
        setIsProcessing(true);

        try {
            const res = await fetch(`${API_BASE_URL}/quotes/${quote.id}/finalize`, {
                method: 'POST',
            });

            if (res.ok) {
                const order = await res.json();

                // Use shared utility (if available, or simulate)
                if (typeof generateReceiptPDF === 'function') {
                    generateReceiptPDF(order.id, quote.items.map((i: any) => ({
                        name: i.product?.name,
                        qty: i.quantity,
                        price: i.unit_price,
                        image: i.product?.image_urls?.[0],
                        spec: i.product?.sku
                    })), settings, paymentMethod);
                }

                showToast('Success', 'Order confirmed and receipt generated!', 'success');
                router.push(`/order-success/${order.id}`);
            } else {
                showToast('Error', 'Failed to finalize order', 'error');
            }
        } catch (error) {
            console.error("Order finalization failed:", error);
            showToast('Error', 'Something went wrong', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Securing Checkout Session...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5 animate-in fade-in zoom-in duration-700">

                {/* Left Side: Summary */}
                <div className="lg:w-5/12 bg-slate-900/50 p-10 md:p-14 space-y-12">
                    <div className="space-y-4">
                        <Link href="/profile" className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:underline group">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black tracking-tighter text-white">Finalize Your Quote</h1>
                            <p className="text-primary font-bold text-sm tracking-tight opacity-80 uppercase tracking-widest">Reference: <span className="text-white">#{quote.id.split('-')[0].toUpperCase()}</span></p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Order Items</h2>
                        <div className="space-y-4">
                            {quote.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between group bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                                            <img src={item.product?.image_urls?.[0] || 'https://placehold.co/400x300'} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-extrabold text-sm tracking-tight">{item.product?.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 capitalize">Qty: {item.quantity} • {item.product?.sku || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="font-black text-sm">${(item.unit_price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-white/40">Item Subtotal</span>
                            <span className="font-black">${quote.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-white/40">Est. Handling</span>
                            <span className="font-black text-green-400">Included</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-white/40">Tax (VAT 0%)</span>
                            <span className="font-black">$0.00</span>
                        </div>
                        <div className="pt-6 flex justify-between items-end border-t border-white/10">
                            <span className="text-lg font-black tracking-tight text-white">Total Amount</span>
                            <span className="text-3xl font-black text-primary">${quote.total_amount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                            <Truck size={24} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-black uppercase tracking-widest">Shipping to Hargeisa, Somaliland</div>
                            <div className="text-[10px] text-gray-400 font-bold">Expected delivery: 24 - 48 Hours</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="flex-1 bg-slate-950 p-10 md:p-14 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight text-white">Payment Method</h2>
                    </div>

                    {/* Method Selector */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl gap-2">
                        {[
                            { id: 'card', name: 'Card', icon: CreditCard },
                            { id: 'bank', name: 'Bank', icon: Building2 },
                            { id: 'mobile', name: 'Mobile', icon: Smartphone },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    paymentMethod === method.id
                                        ? "bg-primary shadow-lg shadow-primary/20 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <method.icon size={16} />
                                {method.name}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleConfirmOrder} className="space-y-8">
                        {paymentMethod === 'card' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Johnathan Doe"
                                        required
                                        className="w-full bg-transparent border-b border-white/10 pb-4 text-lg font-black outline-none focus:border-primary transition-colors placeholder:text-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            required
                                            className="w-full bg-transparent border-b border-white/10 pb-4 text-lg font-black outline-none focus:border-primary transition-colors placeholder:text-white/10 tracking-widest"
                                        />
                                        <Lock size={18} className="absolute right-0 top-1 text-white/20" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM / YY"
                                            required
                                            className="w-full bg-transparent border-b border-white/10 pb-4 text-lg font-black outline-none focus:border-primary transition-colors placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">CVV</label>
                                        <input
                                            type="text"
                                            placeholder="***"
                                            required
                                            className="w-full bg-transparent border-b border-white/10 pb-4 text-lg font-black outline-none focus:border-primary transition-colors placeholder:text-white/10 tracking-[0.5em]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'bank' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Bank Transfer Details</p>
                                        <h3 className="text-xl font-black text-white">Transfer to Kalsan Auto</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-xs font-bold text-white/40">Bank Name</span>
                                            <span className="text-xs font-black text-white">Premier Bank</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs font-bold text-white/40">Account Name</span>
                                            <span className="text-xs font-black text-white">Kalsan Auto Parts Ltd</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs font-bold text-white/40">Account Number</span>
                                            <span className="text-xs font-black text-primary select-all">100299884455</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs font-bold text-white/40">SWIFT/BIC</span>
                                            <span className="text-xs font-black text-white select-all">PRMRSOXXXX</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'mobile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Select Provider</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                        {mobileProviders.map((provider) => (
                                            <button
                                                key={provider.id}
                                                type="button"
                                                onClick={() => setMobileProvider(provider.id)}
                                                className={cn(
                                                    "aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group",
                                                    mobileProvider === provider.id
                                                        ? "bg-primary/20 border-primary text-primary"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm",
                                                    mobileProvider === provider.id ? "bg-primary text-white" : "bg-white/10"
                                                )}>
                                                    {provider.logo}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-tight">{provider.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="+252 63 XXX XXXX"
                                            required
                                            className="w-full bg-transparent border-b border-white/10 pb-4 text-lg font-black outline-none focus:border-primary transition-colors placeholder:text-white/10"
                                        />
                                        <MobileIcon size={18} className="absolute right-0 top-1 text-white/20" />
                                    </div>
                                    <p className="text-[9px] text-white/40 font-bold mt-2">Enter your registered mobile number for {mobileProviders.find(p => p.id === mobileProvider)?.name}.</p>
                                </div>
                            </div>
                        )}

                        <button
                            disabled={isProcessing}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    Processing...
                                    <Loader2 size={20} className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    Confirm order
                                    <CheckCircle2 size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-8 py-4 opacity-30">
                        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><ShieldCheck size={12} /> SSL Secured</div>
                        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><ShieldCheck size={12} /> PCI Compliant</div>
                        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><ShieldCheck size={12} /> 256-bit AES</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
