"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Truck, Loader2, AlertCircle } from 'lucide-react';
import AuthSplitLayout from '@/components/AuthSplitLayout';
import { API_BASE_URL } from '@/lib/config';

const RegisterPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: 'customer' // Default role for registration
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const badges = [
        { icon: ShieldCheck, label: "Genuine Parts" },
        { icon: Truck, label: "Fast Logistics" }
    ];

    if (success) {
        return (
            <AuthSplitLayout
                image="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1983"
                title="Welcome to Kalsan Auto."
                description="Your account has been created successfully. Redirecting you to login..."
                badges={badges}
            >
                <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tighter">Registration Successful!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Getting everything ready for you...</p>
                    </div>
                </div>
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout
            image="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1983"
            title="Reliability in every component we deliver."
            description="Join thousands of professionals who trust Kalsan for high-quality, genuine automotive parts. Get exclusive access to our extensive inventory and expert support."
            badges={badges}
        >
            <div className="space-y-10">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">Create Your Account</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Join the leading network for automotive spare parts.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                            />
                        </div>
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <Lock className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Must be at least 8 characters.</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <label className="flex items-start gap-4 cursor-pointer group pt-2">
                        <div className="relative w-5 h-5 shrink-0 mt-0.5">
                            <input type="checkbox" required className="peer hidden" />
                            <div className="absolute inset-0 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all" />
                            <CheckCircle2 size={14} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 leading-relaxed">
                            By creating an account, I agree to Kalsan's{' '}
                            <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                        </span>
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
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
                    <button className="flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-slate-800 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group outline-none focus:ring-2 focus:ring-primary/10">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                        <span className="text-xs font-black text-secondary dark:text-white uppercase tracking-widest">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-slate-800 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group outline-none focus:ring-2 focus:ring-primary/10">
                        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4" />
                        <span className="text-xs font-black text-secondary dark:text-white uppercase tracking-widest">Facebook</span>
                    </button>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-gray-500 pb-12">
                    Already have an account?{' '}
                    <Link href="/auth/login" virtual-link="login" className="text-primary font-black hover:underline ml-1">
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
};

export default RegisterPage;
