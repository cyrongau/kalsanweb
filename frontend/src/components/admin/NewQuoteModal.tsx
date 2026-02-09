"use client";

import React, { useState } from 'react';
import { X, Search, User, Package, Plus, Trash2, Send, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';

interface NewQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewQuoteModal = ({ isOpen, onClose }: NewQuoteModalProps) => {
    const { showToast } = useNotification();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        vehicle: '',
        notes: '',
    });
    const [items, setItems] = useState([{ name: '', quantity: 1, sku: '' }]);

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, sku: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Success', 'Quote request created successfully. Customer has been notified.');
        onClose();
        // Reset
        setStep(1);
        setFormData({ customerName: '', customerEmail: '', vehicle: '', notes: '' });
        setItems([{ name: '', quantity: 1, sku: '' }]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-10 md:p-14 animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 rounded-2xl text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                >
                    <X size={20} />
                </button>

                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Plus className="text-primary" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tight uppercase">Create New Quote</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">Generate a manual quote inquiry for a customer.</p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex-1 flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
                                    step === i
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : step > i ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-400"
                                )}>
                                    {step > i ? '✓' : i}
                                </div>
                                <div className={cn(
                                    "flex-1 h-1 rounded-full bg-gray-100 dark:bg-slate-800 relative overflow-hidden",
                                    i === 2 && "hidden"
                                )}>
                                    <div className={cn(
                                        "absolute inset-0 bg-primary transition-all duration-500",
                                        step > i ? "w-full" : "w-0"
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {step === 1 ? (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Customer Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter full name"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="customer@example.com"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Vehicle Description</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 2022 Toyota Land Cruiser V8"
                                            value={formData.vehicle}
                                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                            className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                                >
                                    <span className="uppercase tracking-[0.2em] font-black text-xs">Continue to Items</span>
                                    <Plus size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest pl-1">Requested Items</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:scale-105 transition-transform"
                                        >
                                            <Plus size={14} />
                                            Add Another Item
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50/50 dark:bg-slate-950 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 grid grid-cols-12 gap-4 relative group">
                                                <div className="col-span-12 md:col-span-6 space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Part Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Front Brake Pads"
                                                        value={item.name}
                                                        onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all dark:text-white"
                                                    />
                                                </div>
                                                <div className="col-span-6 md:col-span-3 space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">SKU (Opt)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="SKU-123"
                                                        value={item.sku}
                                                        onChange={(e) => handleUpdateItem(idx, 'sku', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all dark:text-white"
                                                    />
                                                </div>
                                                <div className="col-span-4 md:col-span-2 space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Qty</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value))}
                                                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all dark:text-white"
                                                    />
                                                </div>
                                                <div className="col-span-2 md:col-span-1 flex items-end pb-1.5 justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn-secondary flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest"
                                    >
                                        Back to Details
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary flex-[2] py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                                    >
                                        <span className="uppercase tracking-[0.2em] font-black text-xs">Create & Send Quote</span>
                                        <Send size={18} className="translate-x-1 -translate-y-1" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewQuoteModal;
