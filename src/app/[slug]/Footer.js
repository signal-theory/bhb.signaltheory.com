import styles from './Footer.module.css'
import FooterSVG from './FooterSVG';

function Footer() {
    return(
        <footer>
            <div className={styles.container}>
                <div className={styles.menu}>
                    <div>
                        <h4 className={styles.title}>EXPLORE</h4>
                        <div className={styles.links}>
                            <button className={styles.link}>FAQs</button>
                            <button className={styles.link}>RESOURCES</button>
                        </div>
                    </div>
                    <div>
                        <h4 className={styles.title}>SOCIAL</h4>
                        <div>
                            <a className={styles.link} href="" target='_blank'>INSTAGRAM</a>
                            <a className={styles.link} href="" target='_blank'>FACEBOOK</a>
                        </div>
                    </div>
                    <div>
                        <button>CONTACT US</button>
                    </div>
                </div>
                <div className={styles.image}>
                    <FooterSVG />
                </div>
                <div className={styles.copyright}>
                    <img src="/logo-footer.svg" alt="Babes Helpin' Babes at Signal Theory" />
                    <span>&copy; {new Date().getFullYear()} Babes Helpin' Babes</span>
                </div>
            </div>
        </footer>
    )
}
export default Footer;