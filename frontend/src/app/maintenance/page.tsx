"use client";

import React, { useState, useEffect } from 'react';
import {
    Settings2,
    Wrench,
    Bell,
    Phone,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react';

const MaintenancePage = () => {
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 2,
        minutes: 45,
        seconds: 12
    });

    // Simple countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#030712] flex flex-col font-sans transition-colors duration-500">
            {/* Logo Header */}
            <div className="pt-12 flex justify-center animate-in fade-in slide-in-from-top duration-700">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Settings2 className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black text-secondary dark:text-white tracking-tighter">KALSAN AUTO</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center space-y-12 max-w-4xl mx-auto">
                {/* Animated Icon */}
                <div className="relative group animate-in zoom-in duration-1000">
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
                    <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-center animate-bounce-slow">
                        <div className="relative animate-spin-slow">
                            <Settings2 className="text-gray-200 dark:text-slate-800 w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />
                            <div className="absolute inset-0 flex items-center justify-center rotate-[-45deg]">
                                <Wrench className="text-primary w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
                    <h1 className="text-5xl md:text-7xl font-black text-secondary dark:text-white tracking-tighter leading-tight">
                        We'll Be Right Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Kalsan Auto Spare Parts is currently undergoing a scheduled update to improve your shopping experience. We're tuning our engines for something better.
                    </p>
                </div>

                {/* Countdown Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                    {[
                        { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
                        { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
                        { label: 'MINS', value: String(timeLeft.minutes).padStart(2, '0') },
                        { label: 'SECS', value: String(timeLeft.seconds).padStart(2, '0') }
                    ].map((unit, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-soft border border-gray-50 dark:border-slate-800 space-y-2 group hover:scale-105 transition-transform">
                            <div className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                                {unit.value}
                            </div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                {unit.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notification Form */}
                <div className="w-full max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                    <p className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                        Get an alert when we're back online:
                    </p>
                    <form className="flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                        />
                        <button className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
                            Notify Me
                            <Bell size={16} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </form>

                    <div className="pt-4">
                        <a
                            href="tel:+1800KALSAN"
                            className="inline-flex items-center gap-3 text-secondary dark:text-white hover:text-primary transition-colors group"
                        >
                            <Phone size={20} className="text-primary group-hover:animate-bounce" />
                            <span className="text-sm font-medium">Need immediate assistance?</span>
                            <span className="text-base font-black tracking-widest">+1-800-KALSAN</span>
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3 opacity-50">
                        <Settings2 size={20} className="text-secondary dark:text-white" />
                        <span className="text-[10px] font-black text-secondary dark:text-white uppercase tracking-widest">KALSAN AUTO SPARE PARTS</span>
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        © 2024 Kalsan Automotive Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                            <a key={idx} href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 15s linear infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default MaintenancePage;
