"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, RotateCcw, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulation for now - usually hits an endpoint like /auth/forgot-password
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            if (!email.includes('@')) {
                throw new Error("Please enter a valid email address");
            }
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/10 dark:bg-[#030712] flex flex-col transition-colors duration-300">
            {/* Simple Navbar */}
            <div className="w-full py-8 px-8 flex justify-between items-center transition-all bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary transition-transform group-hover:scale-105">
                        <span className="w-full h-full flex items-center justify-center text-primary">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" />
                            </svg>
                        </span>
                    </div>
                    <span className="font-black text-xl tracking-tighter text-secondary dark:text-white">Kalsan Auto Spare Parts</span>
                </Link>
                <Link href="/auth/login" className="btn-primary py-2.5 px-8 rounded-xl text-xs uppercase tracking-widest font-black shadow-lg shadow-primary/20">
                    Login
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 text-center space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
                    {success ? (
                        <>
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto shadow-inner animate-in zoom-in duration-500">
                                <CheckCircle2 size={40} />
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">Check Your Email</h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    We've sent a password reset link to <span className="text-secondary dark:text-white font-bold">{email}</span>.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                                >
                                    Didn't receive it? Try again
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto shadow-inner relative overflow-hidden group">
                                <RotateCcw size={40} className="group-hover:rotate-[-45deg] transition-transform duration-500 relative z-10" />
                                <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-110 transition-transform duration-700 rounded-full" />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">Forgot Password?</h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-1 text-left">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2 text-left">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="e.g. name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-gray-50/5 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-6 pl-14 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                                        />
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Footer */}
                    <div className="pt-4">
                        <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="py-8 text-center space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">© 2024 Kalsan Auto Spare Parts. All rights reserved.</p>
                <div className="flex justify-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    <Link href="/contact" className="hover:text-primary">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
