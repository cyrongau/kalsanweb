"use client";

import React from 'react';
import { useAdmin } from "@/components/providers/AdminProvider";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    variant?: 'light' | 'dark' | 'auto';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    textClassName?: string;
    taglineClassName?: string;
}

export const BrandLogo = ({
    className,
    variant = 'auto',
    size = 'md',
    showText = false,
    textClassName,
    taglineClassName
}: BrandLogoProps) => {
    const { settings } = useAdmin();

    const sizes = {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-14',
        xl: 'h-20'
    };

    const iconSizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20'
    };

    const renderLogo = () => {
        // Get the active logo based on variant
        const logo = variant === 'auto'
            ? { light: settings.logoLight, dark: settings.logoDark }
            : variant === 'light'
                ? { light: settings.logoLight, dark: settings.logoLight }
                : { light: settings.logoDark, dark: settings.logoDark };

        // If we have any main logo, show it and skip everything else
        if (logo.light || logo.dark) {
            return (
                <div className={cn("inline-block", className)}>
                    <img
                        src={logo.light || logo.dark}
                        className={cn(sizes[size], "w-auto object-contain dark:hidden")}
                        alt={settings.siteTitle}
                    />
                    <img
                        src={logo.dark || logo.light}
                        className={cn(sizes[size], "w-auto object-contain hidden dark:block")}
                        alt={settings.siteTitle}
                    />
                </div>
            );
        }

        // Fallback to site icon + text if no logo exists
        return (
            <div className="flex items-center gap-4">
                <div className={cn("flex items-center", sizes[size])}>
                    {settings.siteIcon ? (
                        <img
                            src={settings.siteIcon}
                            className={cn(iconSizes[size], "object-contain", className)}
                            alt={settings.siteTitle}
                        />
                    ) : (
                        <div className={cn(
                            "bg-primary rounded-xl flex items-center justify-center p-2 shadow-lg",
                            iconSizes[size],
                            className
                        )}>
                            <div className="text-white font-black text-2xl leading-none">K</div>
                        </div>
                    )}
                </div>
                {showText && (
                    <div className="flex flex-col">
                        <span className={cn("text-secondary dark:text-white font-black leading-none tracking-tighter", size === 'lg' ? 'text-2xl' : 'text-xl', textClassName)}>
                            {settings.siteTitle || "KALSAN"}
                        </span>
                        <span className={cn("text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase", size === 'lg' ? 'text-[11px]' : 'text-[10px]', taglineClassName)}>
                            {settings.tagline || "Auto Spare Parts"}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return renderLogo();
};
