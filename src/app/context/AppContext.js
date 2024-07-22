'use client';
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen((prev) => !prev);
    };

    const [myState, setMyState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedState') || '';
        }
        return '';
    });

    // Update localStorage whenever the myState changes
    useEffect(() => {
        if (typeof window !== 'undefined' && myState) {
            localStorage.setItem('selectedState', myState);
        }
    }, [myState]);

    return (
        <AppContext.Provider value={{
            isNavOpen, setIsNavOpen,
            toggleNav,
            myState, setMyState
        }}>
            {children}
        </AppContext.Provider>
    );
};