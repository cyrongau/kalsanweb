"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = 'danger'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
        warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
        info: "bg-primary hover:bg-primary-dark shadow-primary/20",
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            variant === 'danger' ? "bg-red-50 text-red-500" :
                                variant === 'warning' ? "bg-amber-50 text-amber-500" :
                                    "bg-primary/5 text-primary"
                        )}>
                            <AlertTriangle size={24} />
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight uppercase italic">{title}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={cn(
                                "flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all active:scale-95",
                                variantStyles[variant]
                            )}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
