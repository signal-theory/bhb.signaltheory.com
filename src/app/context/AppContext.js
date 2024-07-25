'use client';
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [myState, setMyState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedState') || '';
        }
        return '';
    });

    const [checkedItems, setCheckedItems] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCheckedItems = localStorage.getItem('checkedItems');
            return savedCheckedItems ? JSON.parse(savedCheckedItems) : [];
        }
        return [];
    });

    // Update localStorage whenever the checkedItems changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
        }
    }, [checkedItems]);

    // Update localStorage whenever the myState changes
    useEffect(() => {
        if (typeof window !== 'undefined' && myState) {
            localStorage.setItem('selectedState', myState);
        }
    }, [myState]);

    return (
        <AppContext.Provider value={{
            myState, setMyState,
            checkedItems, setCheckedItems
        }}>
            {children}
        </AppContext.Provider>
    );
};