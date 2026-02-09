"use client";

import React from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, Send, ChevronRight } from "lucide-react";
import { useAdmin } from "@/components/providers/AdminProvider";

export default function ContactPage() {
    const { settings } = useAdmin();

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-[550px] flex items-center overflow-hidden bg-secondary dark:bg-slate-950 transition-colors duration-500">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 transform hover:scale-105 transition-transform duration-[10000ms] ease-linear"
                    style={{ backgroundImage: `url(${settings.contactBanner || 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent dark:from-slate-950 dark:via-slate-950/70" />

                <div className="container relative z-10 px-4 pb-20">
                    <div className="max-w-2xl space-y-6 pt-12">
                        <div className="text-primary dark:text-blue-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-12 h-1 bg-primary rounded-full" />
                            Connect with us
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none !text-white animate-in slide-in-from-left duration-700">
                            What we can <br />
                            <span className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">help you with</span>
                        </h1>
                        <p className="text-white/60 text-lg font-medium max-w-lg leading-relaxed pt-2">
                            Are you looking for a specific part? Do you want to make a custom order? Send us a message or call us directly. Our expert team is ready to assist you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="bg-gray-50 dark:bg-background py-24 md:py-32 -mt-24 relative z-20">
                <div className="container px-4">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Contact Info Sidebar */}
                        <div className="w-full lg:w-[450px] space-y-6">
                            <div className="bg-white dark:bg-muted/10 p-10 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-muted shadow-2xl space-y-12">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black text-primary dark:text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-6 h-0.5 bg-primary rounded-full" />
                                        Contact Info
                                    </div>
                                    <h2 className="text-4xl font-black text-secondary dark:text-foreground tracking-tight">Get in touch</h2>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex gap-8 group">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/50 group-hover:animate-[neon-border_2s_infinite] transition-all duration-500 shadow-sm">
                                            <MapPin size={28} className="text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Our Location</p>
                                            <p className="text-lg font-bold text-secondary dark:text-foreground leading-relaxed">{settings.contactAddress}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 group">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/50 group-hover:animate-[neon-border_2s_infinite] transition-all duration-500 shadow-sm">
                                            <Phone size={28} className="text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone Number</p>
                                            <p className="text-2xl font-black text-secondary dark:text-foreground tracking-tighter group-hover:text-primary transition-colors">{settings.contactPhone}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 group">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/50 group-hover:animate-[neon-border_2s_infinite] transition-all duration-500 shadow-sm">
                                            <Mail size={28} className="text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email Address</p>
                                            <p className="text-lg font-bold text-secondary dark:text-foreground group-hover:text-primary transition-colors">{settings.contactEmail}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 group">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/50 group-hover:animate-[neon-border_2s_infinite] transition-all duration-500 shadow-sm">
                                            <Clock size={28} className="text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Working Hours</p>
                                            <p className="text-lg font-bold text-secondary dark:text-foreground leading-relaxed">{settings.workingHours}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 dark:border-muted space-y-6">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">Follow Us</p>
                                    <div className="flex gap-4">
                                        {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                            <button key={i} className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-muted flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-500 shadow-sm border border-transparent hover:border-primary/20">
                                                <Icon size={22} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="flex-1">
                            <div className="bg-white dark:bg-muted/10 p-10 md:p-16 rounded-[3.5rem] border border-gray-100 dark:border-muted shadow-2xl space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-black text-secondary dark:text-foreground tracking-tight">Send us a message</h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">Have questions about our parts? Reach out and we'll get back to you within 24 hours.</p>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+252 63 1234567"
                                            className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Your Message</label>
                                        <textarea
                                            rows={6}
                                            placeholder="How can we help you?"
                                            className="w-full bg-gray-50/50 dark:bg-muted/20 border border-gray-100 dark:border-muted rounded-[2rem] py-6 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <button className="bg-brand-navy hover:bg-primary text-white px-14 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-primary/20 group">
                                            Send Message
                                            <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="relative h-[600px] bg-gray-200">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.12!2d43.3214!3d9.3512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16347f7d9a0d8a9b%3A0x6b8f0a0d8a9b8a9b!2sTog+Wajale!5e0!3m2!1sen!2sso!4v1710000000000!5m2!1sen!2sso"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale dark:invert transition-all duration-500"
                ></iframe>
                <div className="container relative h-full px-4 pointer-events-none">
                    <div className="absolute top-1/2 left-4 md:left-24 -translate-y-1/2 bg-white dark:bg-muted p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-muted max-w-sm space-y-4 pointer-events-auto">
                        <h3 className="text-xl font-black text-secondary">Wajale Branch</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">Visit our main showroom for a complete catalog of spare parts.</p>
                        <a href="https://maps.google.com/?q=Tog+Wajale" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-bold text-sm group">
                            Get Directions
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary py-16">
                <div className="container px-4 text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter !text-white">We have a recommendation for you?</h2>
                    <p className="text-white/70 font-medium">Subscribe to our mailing list to get instant notifications about discounts.</p>
                    <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter email address"
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                        <button className="bg-white text-primary px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-gray-100 transition-all">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
