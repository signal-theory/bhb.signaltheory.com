'use client';
import { useEffect } from "react";
import styles from './Cursor.module.css'

function Cursor() {
    useEffect(() => {
        const cursor = document.getElementById('custom-cursor');
        const handleMouseMove = (event) => {
          cursor.style.left = `${event.pageX}px`;
          cursor.style.top = `${event.pageY}px`;
        };

        const handleMouseDown = () => {
            cursor.classList.add(styles.active);
        };
    
        const handleMouseUp = () => {
            cursor.classList.remove(styles.active);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mousedown', handleMouseDown);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }, []);
    return (
        <div id="custom-cursor" className={styles.customCursor} />
    )
}
export default Cursor;