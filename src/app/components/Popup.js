'use client';
import { useMyState } from '../context/useMyState';
import styles from './Popup.module.css'

function Popup() {
    const { selectedMyState } = useMyState();
    const popupClass = selectedMyState ? styles.popup : `${styles.popup} ${styles.open}`;
    return(
        <div className={popupClass}>
            <h5 className={styles.title}>SELECT YOUR STATE</h5>
        </div>
    )
}
export default Popup;