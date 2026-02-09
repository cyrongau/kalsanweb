"use client";

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModalType = 'success' | 'error' | 'info' | 'warning' | 'confirm';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title?: string;
    message?: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    children?: React.ReactNode;
    showCloseButton?: boolean;
}

const modalIcons = {
    success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    error: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
    warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
    confirm: { icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10" }
};

const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'info',
    confirmText = 'Continue',
    cancelText = 'Cancel',
    children,
    showCloseButton = true
}: ModalProps) => {
    if (!isOpen) return null;

    const { icon: Icon, color, bg } = modalIcons[type];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            {children ? (
                <div className="relative z-10 w-full max-w-xl">
                    {children}
                </div>
            ) : (
                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-10 animate-in zoom-in-95 fade-in duration-300">
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-2 rounded-xl text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <div className="text-center space-y-6">
                        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-2", bg, color)}>
                            <Icon size={40} />
                        </div>

                        <div className="space-y-2">
                            {title && (
                                <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tight uppercase">
                                    {title}
                                </h3>
                            )}
                            {message && (
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    {message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            {onConfirm && (
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {confirmText}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full text-xs font-black text-gray-400 hover:text-secondary dark:hover:text-white uppercase tracking-widest transition-all"
                            >
                                {onConfirm ? cancelText : 'Dismiss'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
