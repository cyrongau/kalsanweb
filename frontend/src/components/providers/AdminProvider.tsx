"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminProfile {
    displayName: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    avatar: string;
    team?: string;
}

const DEFAULT_PROFILE: AdminProfile = {
    displayName: 'Admin User',
    email: 'admin@kalsansparepaarts.com',
    phone: '+252 63 4499488',
    role: 'Super Admin',
    location: 'Hargeisa, Somaliland',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    team: 'Super Admin'
};

interface AdminSettings {
    siteTitle: string;
    tagline: string;
    metaDescription: string;
    logoLight: string;
    logoDark: string;
    siteIcon: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    workingHours: string;
    contactBanner: string;
    supportBanner: string;
    catalogBanner: string;
    shippingBanner: string;
    maintenanceMode: boolean;
    apiBaseUrl: string;
    heroSlider: Array<{
        id: number | string;
        headline: string;
        subtext: string;
        cta: string;
        link: string;
        image: string;
    }>;
    banners: Array<{
        id: number | string;
        title: string;
        subtitle: string;
        color: string;
        link: string;
        image: string;
    }>;
    categoryHighlights: Array<{
        title: string;
        description: string;
        image: string;
        link: string;
        bgColor?: string;
    }>;
    socials: {
        whatsapp: string;
        facebook: string;
        instagram: string;
        twitter: string;
        youtube: string;
    };
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    smtpEncryption: 'none' | 'ssl' | 'tls';
    smtpFromName: string;
    smtpFromEmail: string;
    paymentGatewaySecret: string;
    paymentMerchantId: string;
    smsApiKey: string;
    smsSenderId: string;
    waafiMerchantId: string;
    waafiApiKey: string;
    waafiAccountNumber: string;
    edhabMerchantId: string;
    edhabApiKey: string;
    twilioSid: string;
    twilioToken: string;
    twilioNumber: string;
    msg91Key: string;
    msg91SenderId: string;
    whatsappBusinessId: string;
    whatsappPhoneId: string;
    whatsappToken: string;
    otpProvider: 'sms' | 'whatsapp' | 'both';
    otpExpireMinutes: number;
    systemVersion: string;
    availableUpdate: {
        version: string;
        releaseDate: string;
        description: string;
        type: 'major' | 'minor' | 'patch';
        whatsNew: string[];
    } | null;
}

const DEFAULT_HIGHLIGHTS = [
    {
        title: "Engine Auto Parts",
        description: "Parts engineered to ensure best quality, performance and maintenance.",
        image: "https://images.unsplash.com/photo-1621905235294-7548c7c9ec9b?auto=format&fit=crop&q=80&w=1000",
        link: "/shop?category=engine",
        bgColor: "bg-[#F8F9FA]"
    },
    {
        title: "Shock Absorbers",
        description: "Great quality suspension systems and shocks to replace your old ones.",
        image: "https://images.unsplash.com/photo-1541443131876-44ea4908920d?auto=format&fit=crop&q=80&w=1000",
        link: "/shop?category=shocks",
        bgColor: "bg-[#F8F9FA]"
    }
];

const DEFAULT_SETTINGS: AdminSettings = {
    siteTitle: 'Kalsan Auto Spare Parts',
    tagline: 'Premium Quality Parts for Every Ride',
    metaDescription: 'Leading provider of genuine and aftermarket auto spare parts for Toyota, Nissan, and Ford across the GCC region.',
    logoLight: '',
    logoDark: '',
    siteIcon: '',
    contactEmail: 'sales@kalsanspareparts.com',
    contactPhone: '+252 63 4499488',
    contactAddress: 'Road Number 1, Wajale, Somaliland',
    workingHours: 'Sat-Thu: 8:00 to 16:00',
    contactBanner: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000',
    supportBanner: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000',
    catalogBanner: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000',
    shippingBanner: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
    maintenanceMode: false,
    apiBaseUrl: 'http://localhost:3001',
    heroSlider: [],
    banners: [],
    categoryHighlights: DEFAULT_HIGHLIGHTS,
    socials: {
        whatsapp: '+252 63 4499488',
        facebook: 'facebook.com/kalsanautoparts',
        instagram: '@kalsan_auto',
        twitter: '@kalsanauto',
        youtube: 'youtube.com/kalsanauto'
    },
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'sales@kalsanspareparts.com',
    smtpPass: '••••••••••••••••',
    smtpEncryption: 'tls',
    smtpFromName: 'Kalsan Auto Sales',
    smtpFromEmail: 'no-reply@kalsanspareparts.com',
    paymentGatewaySecret: 'pk_live_********************',
    paymentMerchantId: 'MID-99283-XK',
    smsApiKey: 'ak_live_********************',
    smsSenderId: 'KALSANAUTO',
    waafiMerchantId: 'MICH-8273-XP',
    waafiApiKey: 'ak_live_********************',
    waafiAccountNumber: 'ACC-8827-XQ',
    edhabMerchantId: 'EDH-9928-XK',
    edhabApiKey: 'ak_live_********************',
    twilioSid: 'AC********************************',
    twilioToken: '********************************',
    twilioNumber: '+1234567890',
    msg91Key: 'MSG****************',
    msg91SenderId: 'KALSAN',
    whatsappBusinessId: 'WABI-9928-XK',
    whatsappPhoneId: 'WAPI-8827-XQ',
    whatsappToken: 'EA********************************',
    otpProvider: 'both',
    otpExpireMinutes: 5,
    systemVersion: '2.3.5',
    availableUpdate: {
        version: '2.4.0',
        releaseDate: '2024-02-15',
        description: 'New features and security patches to optimize your workflow.',
        type: 'major',
        whatsNew: [
            'Improved Quote Processing Speed',
            'Enhanced Mobile Search with intuitive gestures',
            'Critical Infrastructure Security Patches'
        ]
    }
};

interface AdminContextType {
    profile: AdminProfile;
    settings: AdminSettings;
    unreadQuotesCount: number;
    unreadOrdersCount: number;
    updateProfile: (updates: Partial<AdminProfile>) => void;
    updateSettings: (updates: Partial<AdminSettings>) => void;
    markAsRead: (type: 'quotes' | 'orders', id: string) => Promise<void>;
    refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<AdminProfile>(DEFAULT_PROFILE);
    const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
    const [unreadQuotesCount, setUnreadQuotesCount] = useState(0);
    const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const [quotesRes, ordersRes] = await Promise.all([
                fetch('http://localhost:3001/quotes/stats/count'),
                fetch('http://localhost:3001/orders/stats/count')
            ]);

            if (quotesRes.ok) setUnreadQuotesCount(await quotesRes.json());
            if (ordersRes.ok) setUnreadOrdersCount(await ordersRes.json());
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        }
    };

    // Initial load from backend
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:3001/settings');
                if (response.ok) {
                    const data = await response.json();
                    if (Object.keys(data).length > 0) {
                        setSettings(prev => ({ ...prev, ...data }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings from backend", error);
            } finally {
                setIsLoading(false);
            }
        };

        const savedProfile = localStorage.getItem('admin_profile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse saved admin profile", e);
            }
        }

        fetchSettings();
        fetchStats();

        // Optional: Poll for new notifications every minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    // Persist profile to localStorage (keep profile local for now)
    useEffect(() => {
        localStorage.setItem('admin_profile', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (updates: Partial<AdminProfile>) => {
        setProfile((prev) => ({ ...prev, ...updates }));
    };

    const markAsRead = async (type: 'quotes' | 'orders', id: string) => {
        try {
            const response = await fetch(`http://localhost:3001/${type}/${id}/read`, {
                method: 'PATCH',
            });
            if (response.ok) {
                // Optimistic update
                if (type === 'quotes') setUnreadQuotesCount(prev => Math.max(0, prev - 1));
                else setUnreadOrdersCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error(`Failed to mark ${type} as read`, error);
        }
    };

    const updateSettings = async (updates: Partial<AdminSettings>) => {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);

        try {
            await fetch('http://localhost:3001/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error("Failed to update settings in backend", error);
        }
    };

    return (
        <AdminContext.Provider value={{
            profile,
            settings,
            unreadQuotesCount,
            unreadOrdersCount,
            updateProfile,
            updateSettings,
            markAsRead,
            refreshStats: fetchStats
        }}>
            {!isLoading && children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
