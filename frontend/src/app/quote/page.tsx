"use client";

import { Minus, Plus, Trash2, Info, Send, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuote } from "@/components/providers/QuoteProvider";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function QuotePage() {
    const { quoteItems, updateQuoteQuantity, removeFromQuote, clearQuote } = useQuote();
    const { user } = useAuth();
    const { showToast } = useNotification();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        businessName: "",
        phone: "",
        email: user?.email || "",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (quoteItems.length === 0) return;

        if (!formData.fullName || !formData.email || !formData.phone) {
            showToast("Missing Information", "Please fill in all mandatory fields", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/quotes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id || "guest-id",
                    guestName: formData.fullName,
                    guestEmail: formData.email,
                    guestPhone: formData.phone,
                    guestNotes: formData.notes,
                    items: quoteItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    }))
                })
            });

            if (res.ok) {
                const data = await res.json();
                showToast("Request Sent", "Your quote request has been submitted successfully", "success");
                clearQuote();
                router.push(`/quote/confirmation?id=${data.id}`);
            } else {
                throw new Error("Failed to submit quote");
            }
        } catch (error) {
            console.error("Submission error:", error);
            showToast("Error", "Failed to submit your request. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background pt-12 pb-24 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-secondary dark:text-foreground tracking-tight mb-4 uppercase italic">Submit Quote Request</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-2xl">Review your selected parts and provide your details for a custom pricing estimate. Our team will get back to you shortly.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Quote Items List */}
                    <div className="flex-1 space-y-8">
                        {quoteItems.length > 0 ? (
                            <div className="bg-white dark:bg-muted/10 rounded-[2.5rem] border border-gray-100 dark:border-muted shadow-soft overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-muted text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50/50 dark:bg-muted/30">
                                                <th className="px-10 py-8 w-[70%]">Product Information</th>
                                                <th className="px-10 py-8 text-center w-[15%]">Quantity</th>
                                                <th className="px-10 py-8 text-right w-[15%]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-muted/30">
                                            {quoteItems.map((item) => (
                                                <tr key={item.id} className="group hover:bg-gray-50/30 dark:hover:bg-muted/5 transition-colors">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-12">
                                                            <div className="w-24 h-24 rounded-3xl bg-gray-50 dark:bg-muted/30 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 dark:border-muted group-hover:scale-105 transition-transform duration-500">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="text-[10px] font-black text-primary dark:text-blue-400 uppercase tracking-widest opacity-60">{item.category}</div>
                                                                <h3 className="font-black text-secondary dark:text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                                    ID: {item.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center justify-center">
                                                            <div className="inline-flex items-center bg-gray-100/50 dark:bg-muted/50 rounded-2xl p-1.5 border border-gray-200 dark:border-muted group-hover:border-primary/20 transition-all">
                                                                <button
                                                                    onClick={() => updateQuoteQuantity(item.id, -1)}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-background shadow-sm transition-all text-gray-400 hover:text-primary active:scale-95"
                                                                >
                                                                    <Minus size={16} />
                                                                </button>
                                                                <span className="w-10 text-center font-black text-secondary dark:text-foreground text-lg">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuoteQuantity(item.id, 1)}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-background shadow-sm transition-all text-gray-400 hover:text-primary active:scale-95"
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <button
                                                            onClick={() => removeFromQuote(item.id)}
                                                            className="inline-flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all group/btn border border-transparent hover:border-red-500/20"
                                                        >
                                                            <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                            REMOVE
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-muted/10 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-muted p-20 text-center space-y-8 animate-in zoom-in duration-500 shadow-sm">
                                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-muted/30 flex items-center justify-center mx-auto text-gray-300 dark:text-gray-600">
                                    <ShoppingCart size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-secondary dark:text-foreground tracking-tight uppercase">Your Quote Request is Empty</h3>
                                    <p className="text-gray-400 font-medium max-w-sm mx-auto">Explore our catalog and add some high-quality parts to get started with your inquiry.</p>
                                </div>
                                <Link href="/shop" className="btn-primary inline-flex items-center gap-3 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs font-black">
                                    Browse Parts
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}

                        <div className="bg-[#1D428A]/5 dark:bg-primary/10 p-8 rounded-[2rem] border border-primary/10 flex items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-xl shadow-primary/5">
                            <div className="w-12 h-12 rounded-2xl bg-[#1D428A] flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Info size={24} className="text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-primary dark:text-blue-400 uppercase text-xs tracking-[0.2em]">Quote Timeline</h4>
                                <p className="text-primary/70 dark:text-blue-400/70 font-bold leading-relaxed">
                                    Quotes are typically processed within 2-4 business hours. You will receive an email with your custom pricing including bulk discounts.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Sidebar */}
                    <div className="w-full lg:w-[450px] shrink-0">
                        <div className={cn(
                            "bg-white dark:bg-muted/10 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-muted shadow-2xl sticky top-24 transition-all duration-500",
                            quoteItems.length === 0 && "opacity-50 pointer-events-none grayscale"
                        )}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-2 h-8 bg-[#1D428A] rounded-full shadow-[0_0_15px_rgba(29,66,138,0.3)]" />
                                <h2 className="text-3xl font-black text-secondary dark:text-foreground tracking-tighter uppercase italic">Inquiry Details</h2>
                            </div>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] pl-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-[1.2rem] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] pl-2">Business Name</label>
                                        <input
                                            type="text"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            placeholder="Optional"
                                            className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-[1.2rem] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] pl-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Mandatory"
                                            className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-[1.2rem] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] pl-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-[1.2rem] py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] pl-2">Additional Notes / VIN</label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Include your vehicle's VIN or specific requirements..."
                                        className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-[1.5rem] py-5 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={quoteItems.length === 0 || isSubmitting}
                                    className="btn-primary w-full py-5 rounded-[1.5rem] bg-[#1D428A] hover:bg-primary transition-all shadow-2xl shadow-primary/20 group uppercase tracking-[0.2em] text-[10px] font-black flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Submit Inquiry
                                            <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 font-bold px-8 leading-relaxed">
                                    By submitting, you agree to our <a href="#" className="font-black text-primary hover:underline transition-all">Terms of Service</a> and <a href="#" className="font-black text-primary hover:underline transition-all">Privacy Policy</a>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
