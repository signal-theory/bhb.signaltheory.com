'use client';
import { useState, useEffect } from 'react';
import styles from './FAQ.module.css';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function FAQ({ headline, faqs }) {

    const [toggled, setToggled] = useState(null);
    const toggleAccordion = (index) => {
        if (toggled === index) {
            return setToggled(null);
        }
        setToggled(index);
    };

    useEffect(() => {
        gsap.to(".shake", {
            scrollTrigger: {
                trigger: ".shake",
                toggleActions: "restart pause pause pause"
            },
            x: 100,
            y: 100,
            rotation: 60,
            duration: 1,
            scale: 1.3,
            ease: "bounce.out",
            delay: 0.2
        });
    }, []); 

    return (
        <section className={styles.container}>
            <div className={`shake ${styles.firecracker}`}></div>
            <h2>{headline}</h2>
            <div className={styles.faqs}>
                {faqs.map((item, index) => (
                    <div className={styles.faqItem} key={index}>
                        <button 
                            aria-expanded={toggled === index}  // Update aria-expanded
                            aria-controls={`sec${index + 1}`}
                            onClick={() => toggleAccordion(index)}
                            id={`accordion${index + 1}id`}
                            className={`${styles.question}  ${toggled === index ? styles.active  : ''}`} >
                            {item.question}
                        </button>
                        <div
                            id={`sec${index + 1}`}
                            role="region"
                            className={`${styles.answer} ${toggled === index ? styles.open : ''}`}  // Remove hidden attribute
                            aria-labelledby={`accordion${index + 1}id`}
                        >
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default FAQ;