'use client';
import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import styles from './Footer.module.css';
import FooterSVG from './FooterSVG';
import { AppContext } from '../context/AppContext';

function Footer() {

    const { setMyState } = useContext(AppContext); 

    const handleStateSelect = (state) => {
        setMyState(state);
      };

    return(
        <footer>
            <div className={styles.container}>
                <div className={styles.menu}>
                    <div>
                        <h4 className={styles.title}>EXPLORE</h4>
                        <div className={styles.links}>
                            <Link href="#faqs" className={styles.link}>FAQs</Link>
                            <Link href="#outreach" className={styles.link}>RESOURCES</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className={styles.title}>SOCIAL</h4>
                        <div>
                            <a className={styles.link} href="https://www.instagram.com/babeshelpinbabes_st/" target='_blank'>INSTAGRAM</a>
                            <a className={styles.link} href="https://www.facebook.com/BabesHelpinBabesST" target='_blank'>FACEBOOK</a>
                        </div>
                    </div>
                    <div>
                        <a className={styles.contactBtn} href="mailto:babeshelpinbabes@signaltheory.com"><span>CONTACT US</span></a>
                    </div>
                </div>
                <div className={styles.image}>
                    <FooterSVG />
                </div>
                <div className={styles.copyright}>
                    <Link href="/">
                        <Image
                            className={styles.logo}
                            width={300}
                            height={100}
                            src="/logo-footer.svg" 
                            alt="Babes Helpin' Babes at Signal Theory" />
                    </Link>
                    <span>&copy; {new Date().getFullYear()} Babes Helpin&apos; Babes</span>
                </div>
            </div>
        </footer>
    )
}
export default Footer;