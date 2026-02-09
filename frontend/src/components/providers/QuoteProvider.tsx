"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationProvider';

export interface Product {
    id: number | string;
    name: string;
    category: string;
    image: string;
    sku?: string;
    price?: string | number;
    rating?: number;
}

export interface QuoteItem extends Product {
    quantity: number;
}

interface QuoteContextType {
    favorites: Product[];
    quoteItems: QuoteItem[];
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: number | string) => boolean;
    addToQuote: (product: Product, quantity?: number) => void;
    removeFromQuote: (productId: number | string) => void;
    updateQuoteQuantity: (productId: number | string, delta: number) => void;
    clearQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
    const { showToast } = useNotification();

    // Load from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('user_favorites');
        const savedQuote = localStorage.getItem('user_quote_cart');

        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedQuote) setQuoteItems(JSON.parse(savedQuote));
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('user_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('user_quote_cart', JSON.stringify(quoteItems));
    }, [quoteItems]);

    const toggleFavorite = (product: Product) => {
        const exists = favorites.find(p => p.id === product.id);
        if (exists) {
            setFavorites(prev => prev.filter(p => p.id !== product.id));
            showToast('Removed', 'Removed from saved parts');
        } else {
            setFavorites(prev => [...prev, product]);
            showToast('Saved', 'Added to saved parts');
        }
    };

    const isFavorite = (productId: number | string) => {
        return favorites.some(p => p.id === productId);
    };

    const addToQuote = (product: Product, quantity: number = 1) => {
        const existing = quoteItems.find(item => item.id === product.id);
        if (existing) {
            setQuoteItems(prev => prev.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
            showToast('Updated', `Quantity updated for ${product.name}`);
        } else {
            setQuoteItems(prev => [...prev, { ...product, quantity }]);
            showToast('Added', `${product.name} added to quote request`);
        }
    };

    const removeFromQuote = (productId: number | string) => {
        setQuoteItems(prev => prev.filter(item => item.id !== productId));
        showToast('Removed', 'Item removed from quote request');
    };

    const updateQuoteQuantity = (productId: number | string, delta: number) => {
        setQuoteItems(prev =>
            prev.map(item => {
                if (item.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearQuote = () => {
        setQuoteItems([]);
        localStorage.removeItem('user_quote_cart');
    };

    return (
        <QuoteContext.Provider value={{
            favorites,
            quoteItems,
            toggleFavorite,
            isFavorite,
            addToQuote,
            removeFromQuote,
            updateQuoteQuantity,
            clearQuote
        }}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuote = () => {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
};
