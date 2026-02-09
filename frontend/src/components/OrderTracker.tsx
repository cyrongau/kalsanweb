"use client";

import React from 'react';
import {
    Check,
    Box,
    Truck,
    CheckCircle2,
    Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStep {
    label: string;
    description: string;
    icon: React.ElementType;
    status: 'completed' | 'active' | 'pending';
}

interface OrderTrackerProps {
    steps: OrderStep[];
}

const OrderTracker = ({ steps }: OrderTrackerProps) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-soft border border-gray-100 dark:border-slate-800 animate-in fade-in slide-in-from-top duration-700">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 dark:bg-slate-800 -z-0" />
                <div
                    className="absolute top-6 left-0 h-1 bg-primary dark:bg-accent transition-all duration-1000 -z-0"
                    style={{
                        width: `${(steps.filter(s => s.status === 'completed' || s.status === 'active').length - 1) / (steps.length - 1) * 100}%`
                    }}
                />

                {steps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4 group min-w-[100px]">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                            step.status === 'completed'
                                ? "bg-primary dark:bg-accent border-primary dark:border-accent text-white shadow-lg shadow-primary/30"
                                : step.status === 'active'
                                    ? "bg-white dark:bg-slate-900 border-primary dark:border-accent text-primary dark:text-accent shadow-xl scale-110"
                                    : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-300"
                        )}>
                            {step.status === 'completed' ? (
                                <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" />
                            ) : (
                                <step.icon size={20} />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className={cn(
                                "text-xs font-black uppercase tracking-widest",
                                step.status === 'pending' ? "text-gray-400" : "text-secondary dark:text-white"
                            )}>
                                {step.label}
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTracker;
