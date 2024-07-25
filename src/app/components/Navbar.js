'use client';
import { usePathname } from 'next/navigation'
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import styles from "./Navbar.module.css";
import { AppContext } from '../context/AppContext';
import { useMyState } from '../context/useMyState';

function Navbar() {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;
    // handle selectedState functions
    const { setMyState } = useContext(AppContext); 
    const { selectedMyState } = useMyState();
    const [isMounted, setIsMounted] = useState(false);

    const handleStateSelect = (state) => {
        setMyState(state);
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
                        <Link href="/" className={`${styles.logo} ${isActive('/') ? styles.active : ''}`}><span className='screen-reader-only'>HOME</span></Link>
                    </li>
                    <li>
                        <Link href="/voting-in-missouri" className={isActive('/voting-in-missouri') ? styles.active : ''} onClick={() => handleStateSelect('voting-in-missouri')}>VOTING IN MISSOURI</Link>
                    </li>
                    <li>
                        <Link href="/voting-in-kansas" className={isActive('/voting-in-kansas') ? styles.active : ''} onClick={() => handleStateSelect('voting-in-kansas')}>VOTING IN KANSAS</Link>
                    </li>
                    <li>
                        <Link href="/voting-in-texas" className={isActive('/voting-in-texas') ? styles.active : ''} onClick={() => handleStateSelect('voting-in-texas')}>VOTING IN TEXAS</Link>
                    </li>
                    {isMounted && selectedMyState && (
                        <>
                            <li>
                                <Link href={`/${selectedMyState.toLowerCase()}#faqs`} className={isActive(`/${selectedMyState.toLowerCase()}#faqs`) ? styles.active : ''}>FAQs</Link>
                            </li>
                            <li>
                                <Link href={`/${selectedMyState.toLowerCase()}#make-a-plan`} className={isActive(`/${selectedMyState.toLowerCase()}#make-a-plan`) ? styles.active : ''}>MAKE A PLAN</Link>
                            </li>
                            <li>
                                <Link href={`/${selectedMyState.toLowerCase()}#outreach`} className={isActive(`/${selectedMyState.toLowerCase()}#outreach`) ? styles.active : ''}>BHB OUTREACH</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;