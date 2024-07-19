
import Link from 'next/link';
import styles from "./Navbar.module.css";

function Navbar() {


    return (
        <>
            <nav className={styles.navbar}>
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