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

    const [toggled, setToggled] = useState(false);
    const toggleNav = () => {
        setToggled(prevState => !prevState);
    };

    return (
        <>
             <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}> 
                <Link href="/" className={`${styles.logo} ${toggled ? styles.logoActive  : ''}`} aria-label='Go to Homepage'>
                    <span className='screen-reader-only'>HOME</span>
                </Link>
               {isMounted && ( 
                    <ul className={`${styles.navbarWrapper} ${toggled ? styles.menuActive  : ''}`}>
                        <li>
                            <Link href={`#voter-links`} onClick={toggleNav}>REGISTER TO VOTE</Link>
                        </li>
                        <li>
                            <Link href={`#deadlines`} onClick={toggleNav}>DEADLINES</Link>
                        </li>
                        <li>
                            <Link href={`#faqs`} onClick={toggleNav}>FAQs</Link>
                        </li>
                        <li>
                            <Link href={`#make-a-plan`} onClick={toggleNav}>MAKE A PLAN</Link>
                        </li>
                        <li>
                            <Link  href={`#outreach`} onClick={toggleNav}>BHB OUTREACH</Link>
                        </li>
                    </ul>
                )}
                <button 
                    className={`${styles.toggleBtn} ${toggled ? styles.btnActive  : ''}`}
                    aria-label="Open Navigation Menu"
                    onClick={toggleNav}>
                        <span className='screen-reader-only'>Toggle Menu</span>
                </button>
            </nav>
        </>
    );
}

export default NavbarState;