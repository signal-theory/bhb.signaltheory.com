'use client';
import { usePathname } from 'next/navigation'
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import styles from "./Navbar.module.css";
import { AppContext } from '../context/AppContext';
import { useMyState } from '../context/useMyState';

function NavbarState() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    // handle selectedState functions
    const { setMyState } = useContext(AppContext); 
    const { selectedMyState } = useMyState();
    let navState;
    if (selectedMyState === "voting-in-missouri") {
        navState = 'MISSOURI'
    }
    if (selectedMyState === "voting-in-kansas") {
        navState = 'KANSAS'
    }
    if (selectedMyState === "voting-in-texas") {
        navState = 'TEXAS'
    }
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
                        <Link href="/" className={styles.logo}><span className='screen-reader-only'>HOME</span></Link>
                    </li>
                    {isMounted && (
                        <>
                        <li>
                            <Link href={`#voter-links`}>VOTING IN {navState}</Link>
                        </li>
                        <li>
                            <Link href={`#deadlines`}>DEADLINES</Link>
                        </li>
                        <li>
                            <Link href={`#faqs`}>FAQs</Link>
                        </li>
                        <li>
                            <Link href={`#make-a-plan`}>MAKE A PLAN</Link>
                        </li>
                        <li>
                            <Link href={`#outreach`}>BHB OUTREACH</Link>
                        </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default NavbarState;