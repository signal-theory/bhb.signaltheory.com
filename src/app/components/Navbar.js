'use client';
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import styles from "./Navbar.module.css";
import { AppContext } from '../context/AppContext';
import { useMyState } from '../context/useMyState';

function Navbar() {

    // handle selectedState functions
    const { setMyState } = useContext(AppContext); 
    const { selectedMyState } = useMyState();
    const [isMounted, setIsMounted] = useState(false);

    const handleStateSelect = (state) => {
        setMyState(state);
    };

    const handleLinkClick = (e, state) => {
        if (!selectedMyState) {
            console.log('pick a state first')
            e.preventDefault();
            // setShowPopup(true);
        } else {
            // handleStateSelect(state);
        }
    };

    // handle navbar background color on scroll
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <ul className={styles.navbarWrapper}>
                    <li>
                        <Link href="/" className={styles.logo}><span className='screen-reader-only'>HOME</span></Link>
                    </li>
                    <li>
                        <Link href="/voting-in-missouri" onClick={() => handleStateSelect('voting-in-missouri')}>VOTING IN MISSOURI</Link>
                    </li>
                    <li>
                        <Link href="/voting-in-kansas" onClick={() => handleStateSelect('voting-in-kansas')}>VOTING IN KANSAS</Link>
                    </li>
                    <li>
                        <Link href="/voting-in-texas" onClick={() => handleStateSelect('voting-in-texas')}>VOTING IN TEXAS</Link>
                    </li>
                    {isMounted && selectedMyState && (
                        <>
                            <li>
                                <Link href={`/${selectedMyState.toLowerCase()}#faqs`} onClick={(e) => handleLinkClick(e, selectedMyState)}>FAQs</Link>
                            </li>
                            <li>
                                <Link href={`/${selectedMyState.toLowerCase()}#make-a-plan`} onClick={(e) => handleLinkClick(e, selectedMyState)}>MAKE A PLAN</Link>
                            </li>
                            <li>
                                <Link href={`/${selectedMyState.toLowerCase()}#outreach`} onClick={(e) => handleLinkClick(e, selectedMyState)}>BHB OUTREACH</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;