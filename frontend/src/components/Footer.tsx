"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram } from "lucide-react";
import { useAdmin } from "@/components/providers/AdminProvider";
import { BrandLogo } from "@/components/BrandLogo";

const Footer = () => {
    const { settings } = useAdmin();

    return (
        <footer className="bg-brand-black dark:bg-[#050505] text-white pt-24 pb-12 transition-colors duration-500">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <BrandLogo showText size="lg" variant="dark" />
                        <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed font-medium">
                            {settings.metaDescription || "Your premier destination for high-quality, genuine auto spare parts. We ensure your vehicle stays on the road with reliability."}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, url: settings.socials.facebook },
                                { icon: Twitter, url: settings.socials.twitter },
                                { icon: Instagram, url: settings.socials.instagram }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 bg-white/5 dark:bg-white/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group shadow-lg"
                                >
                                    <social.icon size={20} className="text-gray-400 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-6 h-1 bg-primary rounded-full" />
                            Contact Us
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                    <MapPin size={22} className="text-gray-400 group-hover:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Office Address</p>
                                    <p className="text-white font-bold leading-relaxed">{settings.contactAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                    <Phone size={22} className="text-gray-400 group-hover:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-white font-black text-lg tracking-tight">{settings.contactPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                    <Mail size={22} className="text-gray-400 group-hover:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email Address</p>
                                    <p className="text-white font-bold">{settings.contactEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:pl-12">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-primary" />
                            Information
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-400">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Order Parts</Link></li>
                            <li><Link href="/profile" className="hover:text-primary transition-colors">Wishlist</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refunds" className="hover:text-primary transition-colors">Refund & Returns</Link></li>
                        </ul>
                    </div>

                    {/* Operating Hours */}
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <div className="w-4 h-0.5 bg-primary" />
                            Operating Hours
                        </h4>
                        <div className="space-y-6 text-sm">
                            <div className="bg-white/5 dark:bg-white/5 p-6 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>{settings.workingHours.split(':')[0]}:</span>
                                    <span className="text-white font-black">{settings.workingHours.split(':').slice(1).join(':').trim()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400 border-t border-white/10 pt-3">
                                    <span>Friday:</span>
                                    <span className="text-red-500 font-black uppercase">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                    <p className="text-center md:text-left">Copyright © {new Date().getFullYear()} Kalsan Spare Parts. Developed by <a href="https://www.generexcom.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Generexcom</a>.</p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
