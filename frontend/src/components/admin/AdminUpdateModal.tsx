"use client";

import React from 'react';
import {
    X,
    RefreshCcw,
    Rocket,
    Smartphone,
    Shield,
    Info,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

interface AdminUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminUpdateModal = ({ isOpen, onClose }: AdminUpdateModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
            <div className="relative p-10 max-w-xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="space-y-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-primary ring-8 ring-blue-50/50 dark:ring-blue-500/5">
                            <RefreshCcw size={32} className="animate-spin-slow" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tight">System Update Available</h2>
                            <div className="flex items-center justify-center gap-2">
                                <span className="bg-blue-50 dark:bg-blue-500/10 text-primary text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">v2.4.0</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stable Release</span>
                            </div>
                        </div>

                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            A new version of the Admin System is ready for installation. This update includes critical performance enhancements and security patches to optimize your workflow.
                        </p>
                    </div>

                    {/* What's New Section */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">What's New</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Rocket, title: "Improved Quote Processing Speed", desc: "Faster calculations for high-volume accounts and real-time syncing.", color: "text-blue-500" },
                                { icon: Smartphone, title: "Enhanced Mobile Search", desc: "Better filtering and intuitive gesture support on smaller devices.", color: "text-blue-600" },
                                { icon: Shield, title: "Security Patches", desc: "Critical infrastructure updates and vulnerability remediation.", color: "text-blue-700" }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group">
                                    <div className={cn("mt-0.5", feature.color)}>
                                        <feature.icon size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black text-secondary dark:text-white group-hover:text-primary transition-colors">{feature.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Downtime Info */}
                    <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 p-5 rounded-2xl flex gap-4 items-start">
                        <div className="p-1.5 bg-primary text-white rounded-lg shrink-0">
                            <Info size={14} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Estimated Downtime</h4>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                                The system will be offline for approximately <span className="text-secondary dark:text-white">5-10 minutes</span> during the installation.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black text-gray-400 hover:text-secondary dark:hover:text-white uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Calendar size={14} className="group-hover:scale-110 transition-transform" />
                            Schedule for Later
                        </button>
                        <button
                            className="flex-1 px-6 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            Update Now
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AdminUpdateModal;
