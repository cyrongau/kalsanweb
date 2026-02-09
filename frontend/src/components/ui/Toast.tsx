"use client";

import React, { useEffect } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    Info,
    AlertTriangle,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    title: string;
    message?: string;
    type: ToastType;
    onClose: (id: string) => void;
    duration?: number;
}

const toastStyles = {
    success: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-200 dark:border-emerald-800",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        progressBar: "bg-emerald-500"
    },
    error: {
        bg: "bg-red-50 dark:bg-red-950/40",
        border: "border-red-200 dark:border-red-800",
        icon: AlertCircle,
        iconColor: "text-red-500",
        progressBar: "bg-red-500"
    },
    info: {
        bg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-200 dark:border-blue-800",
        icon: Info,
        iconColor: "text-blue-500",
        progressBar: "bg-blue-500"
    },
    warning: {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-200 dark:border-amber-800",
        icon: AlertTriangle,
        iconColor: "text-amber-500",
        progressBar: "bg-amber-500"
    }
};

const Toast = ({ id, title, message, type, onClose, duration = 5000 }: ToastProps) => {
    const style = toastStyles[type];
    const Icon = style.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div
            className={cn(
                "group relative w-full sm:w-96 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right duration-500",
                style.bg,
                style.border
            )}
        >
            <div className="flex gap-4">
                <div className={cn("mt-0.5", style.iconColor)}>
                    <Icon size={20} />
                </div>
                <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-black tracking-tight text-secondary dark:text-white uppercase">
                        {title}
                    </h4>
                    {message && (
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                            {message}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="h-fit p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-secondary dark:hover:text-white transition-all"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-black/5 dark:bg-white/5 w-full rounded-b-2xl overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-100 ease-linear", style.progressBar)}
                    style={{
                        animation: `toast-progress ${duration}ms linear forwards`
                    }}
                />
            </div>

            <style jsx>{`
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default Toast;
