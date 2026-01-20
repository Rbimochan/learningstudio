'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreContextValue {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Hydrate Theme
    useEffect(() => {
        const savedTheme = (localStorage.getItem('study_theme') as 'light' | 'dark') || 'light';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('study_theme', newTheme);
            return newTheme;
        });
    };

    return (
        <StoreContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within a StoreProvider");
    return context;
};
