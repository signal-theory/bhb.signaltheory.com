
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "./Navbar.module.css";

function Navbar() {
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

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <ul className={styles.navbarWrapper}>
                    <li>
                        <Link href="/" className={styles.logo}><span className='screen-reader-only'>HOME</span></Link>
                    </li>
                    <li>
                        <Link href="/voting-in-missouri">VOTING IN MISSOURI</Link>
                    </li>
                    <li>
                        <Link href="/voting-in-kansas">VOTING IN KANSAS</Link>
                    </li>
                    <li>
                        <Link href="/voting-in-texas">VOTING IN TEXAS</Link>
                    </li>
                    <li>
                        <Link href="/">FAQs</Link>
                    </li>
                    <li>
                        <Link href="/">MAKE A PLAN</Link>
                    </li>
                    <li>
                        <Link href="/">BHB OUTREACH</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navbar;