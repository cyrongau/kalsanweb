"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <button className="w-10 h-10 rounded-full bg-gray-100 hidden md:block" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-muted transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun size={20} className="hover:text-yellow-500 transition-colors" />
            ) : (
                <Moon size={20} className="hover:text-primary transition-colors" />
            )}
        </button>
    );
}
