'use client';
import { useEffect } from "react";
import styles from './Cursor.module.css'

function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    document.body.style.cursor = 'none'; 

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

    const handleScroll = () => {
        cursor.style.transform = ' translate(-23px, -42px) scale(0)';
        document.body.style.cursor = 'default';
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            cursor.style.transform = ' translate(-23px, -42px) scale(1)';
            document.body.style.cursor = 'none';
        }, 50); // Adjust the timeout as needed
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);
    return (
        <div id="custom-cursor" className={styles.customCursor} />
    )
}
export default Cursor;