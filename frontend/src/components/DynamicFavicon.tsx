"use client";

import { useEffect } from "react";
import { useAdmin } from "@/components/providers/AdminProvider";

export const DynamicFavicon = () => {
    const { settings } = useAdmin();

    useEffect(() => {
        if (settings.siteIcon) {
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            (link as any).type = 'image/x-icon';
            (link as any).rel = 'shortcut icon';
            (link as any).href = settings.siteIcon;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }, [settings.siteIcon]);

    return null;
};
