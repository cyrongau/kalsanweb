"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import AuthSplitLayout from '@/components/AuthSplitLayout';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useNotification } from '@/components/providers/NotificationProvider';
import { API_BASE_URL } from '@/lib/config';

const LoginPage = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { showToast } = useNotification();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user data and token via AuthProvider
            login(data.user, data.access_token);

            showToast('Welcome Back!', `Successfully logged in as ${data.user.name || data.user.email}`, 'success');

            // Redirect based on redirect param or role
            if (redirectUrl) {
                router.push(redirectUrl);
            } else if (data.user.role === 'admin' || data.user.role === 'super_admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            image="https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=2070"
            title="Quality Parts, Driven by Excellence."
            description="Powering your journey with precision and reliability. Access the largest inventory of certified automotive components globally."
        >
            <div className="space-y-10">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">Secure Login</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Enter your credentials to access your account.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Password</label>
                        </div>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 pr-12 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-5 h-5">
                                <input type="checkbox" className="peer hidden" />
                                <div className="absolute inset-0 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all" />
                                <CheckCircle2 size={14} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Remember me</span>
                        </label>
                        <Link href="/auth/forgot-password" virtual-link="forgot-password" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100 dark:border-muted"></div>
                    </div>
                    <span className="relative px-6 bg-[#fafafa] dark:bg-[#030712] text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Or continue with</span>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-muted rounded-2xl hover:bg-white dark:hover:bg-muted/50 transition-all group outline-none focus:ring-2 focus:ring-primary/10">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                        <span className="text-xs font-black text-secondary dark:text-white uppercase tracking-widest">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-muted rounded-2xl hover:bg-white dark:hover:bg-muted/50 transition-all group outline-none focus:ring-2 focus:ring-primary/10">
                        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4" />
                        <span className="text-xs font-black text-secondary dark:text-white uppercase tracking-widest">Facebook</span>
                    </button>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-gray-500 pb-12">
                    New to Kalsan Auto?{' '}
                    <Link href="/auth/register" virtual-link="register" className="text-primary font-black hover:underline ml-1">
                        Sign up for an account
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
};

export default LoginPage;
