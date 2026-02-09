"use client";

import React, { useState, useEffect } from 'react';
import {
    X,
    RefreshCw,
    ShieldCheck,
    Search,
    Zap,
    Clock,
    ChevronRight,
    ArrowRight,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/components/providers/AdminProvider';

interface SystemUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SystemUpdateModal: React.FC<SystemUpdateModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useAdmin();
    const [isUpdating, setIsUpdating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const updateInfo = settings.availableUpdate;

    if (!isOpen || !updateInfo) return null;

    const handleUpdateNow = () => {
        setIsUpdating(true);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    setIsUpdating(false);
                    setIsComplete(true);
                    updateSettings({
                        systemVersion: updateInfo.version,
                        availableUpdate: null
                    });
                }, 1000);
            }
            setProgress(currentProgress);
        }, 500);
    };

    const handleSchedule = () => {
        onClose();
        // In a real app, logic to save schedule would go here
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-secondary/80 dark:bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={!isUpdating ? onClose : undefined}
            />

            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                {!isUpdating && !isComplete && (
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-center text-gray-400 hover:text-secondary dark:hover:text-white transition-all hover:bg-white dark:hover:bg-slate-800 shadow-sm"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="p-12 space-y-10">
                    {/* Header */}
                    <div className="text-center space-y-6">
                        {!isUpdating && !isComplete ? (
                            <>
                                <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] animate-ping opacity-20" />
                                    <RefreshCw size={40} className="text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">System Update Available</h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">{updateInfo.version}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stable Release</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md mx-auto leading-relaxed">
                                    A new version of the Admin System is ready for installation. {updateInfo.description}
                                </p>
                            </>
                        ) : isUpdating ? (
                            <>
                                <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
                                    <RefreshCw size={40} className="text-white animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tighter">Updating System...</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Applying patches and optimizing database</p>
                                </div>
                                <div className="max-w-xs mx-auto space-y-4">
                                    <div className="w-full h-3 bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-100 dark:border-slate-800">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out shadow-sm"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xl font-black text-secondary dark:text-white tabular-nums">{Math.round(progress)}%</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-500/20 animate-in bounce-in duration-700">
                                    <CheckCircle2 size={40} className="text-white" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Update Successful!</h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-sm mx-auto">
                                        System updated to version <span className="text-secondary dark:text-white font-black">{updateInfo.version}</span>. All features are now active.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 mt-4"
                                    >
                                        Go Back to Dashboard
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {!isUpdating && !isComplete && (
                        <>
                            {/* What's New */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">What's New</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {updateInfo.whatsNew.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-5 p-5 bg-gray-50/50 dark:bg-slate-950 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 group transition-all hover:border-primary/20">
                                            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                                                {idx === 0 ? <Zap size={18} /> : idx === 1 ? <Search size={18} /> : <ShieldCheck size={18} />}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-black text-secondary dark:text-white text-sm">{item.split(' ')[0]} {item.split(' ')[1]}</h4>
                                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.split(' ').slice(2).join(' ')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4">
                                <Clock className="text-blue-500 shrink-0" size={20} />
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Estimated Downtime</h4>
                                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                                        The system will be offline for approximately <span className="text-blue-500">5-10 minutes</span> during installation.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleSchedule}
                                    className="flex-1 flex items-center justify-center gap-2 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary dark:hover:text-white transition-all bg-white dark:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 rounded-2xl"
                                >
                                    <Calendar size={16} />
                                    Schedule for Later
                                </button>
                                <button
                                    onClick={handleUpdateNow}
                                    className="flex-[1.5] bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
                                >
                                    Update Now
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemUpdateModal;
