'use client';
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen((prev) => !prev);
    };

    return (
        <AppContext.Provider value={{
            isNavOpen, setIsNavOpen,
            toggleNav,
        }}>
            {children}
        </AppContext.Provider>
  );
};