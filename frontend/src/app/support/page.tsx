"use client";

import React from 'react';
import LegalLayout from '@/components/LegalLayout';
import { Mail, Phone, MessageSquare, Clock, MapPin, Send } from 'lucide-react';
import SupportChat from '@/components/support/SupportChat';
import { useAdmin } from '@/components/providers/AdminProvider';

export default function SupportPage() {
    const { settings } = useAdmin();

    return (
        <>
            <LegalLayout
                title="Support"
                subtitle="Get expert help with your spare part requirements, order status, or technical questions."
                lastUpdated="February 8, 2026"
                breadcrumb={[{ name: 'Support', href: '/support' }]}
                heroImage={settings.supportBanner || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000"}
            >
                <div className="space-y-16">
                    {/* ... rest of the content */}
                    {/* Contact Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-6 group hover:border-primary/20 transition-all">
                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110">
                                <Mail className="text-primary" size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Email Support</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">For detailed inquiries and quote requests.</p>
                                <a href={`mailto:${settings.contactEmail}`} className="block text-primary font-black text-lg hover:underline transition-all">
                                    {settings.contactEmail}
                                </a>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-6 group hover:border-primary/20 transition-all">
                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110">
                                <Phone className="text-primary" size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Call Center</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Direct assistance for urgent part requirements.</p>
                                <a href={`tel:${settings.contactPhone}`} className="block text-primary font-black text-lg hover:underline transition-all">
                                    {settings.contactPhone}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Support Form */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-secondary dark:text-white uppercase tracking-tight m-0">Inquiry Form</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Send us a message and we'll get back to you within 2-4 business hours.</p>
                        </div>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-slate-950 p-10 md:p-12 rounded-[3rem] border border-gray-100 dark:border-slate-800">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Order Issue, Technical Query, etc."
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Message</label>
                                <textarea
                                    rows={6}
                                    placeholder="How can we help you today?"
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] py-6 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button className="bg-secondary dark:bg-primary text-white w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-secondary/20 group">
                                    Submit Inquiry
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        <div className="flex gap-6 items-start">
                            <div className="bg-primary/10 p-4 rounded-xl text-primary">
                                <Clock size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-secondary dark:text-white uppercase tracking-tight">Support Hours</h4>
                                <p className="text-gray-500 text-sm font-medium">{settings.workingHours}</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="bg-primary/10 p-4 rounded-xl text-primary">
                                <MapPin size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-secondary dark:text-white uppercase tracking-tight">Main Hub</h4>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{settings.contactAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </LegalLayout>
            <SupportChat />
        </>
    );
}
