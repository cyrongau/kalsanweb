"use client";

import { useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

export function DebugConfig() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log("%c[DebugConfig] Application Configuration:", "color: #00ff00; font-weight: bold; font-size: 14px");
            console.log(`%cAPI_BASE_URL: ${API_BASE_URL}`, "color: #00ffff");
            console.log(`%cWindow Hostname: ${window.location.hostname}`, "color: #00ffff");
            console.log(`%cNode Env: ${process.env.NODE_ENV}`, "color: #00ffff");
        }
    }, []);

    return null; // Render nothing visible
}
