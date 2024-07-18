'use client';
import { useState } from 'react';
import styles from './FAQ.module.css';

function FAQ({ headline, faqs }) {

    const [toggled, setToggled] = useState(null);
    const toggleAccordion = (index) => {
        if (toggled === index) {
            return setToggled(null);
        }
        setToggled(index);
    };

    return (
        <section className={styles.container}>
            <h2>{headline}</h2>
            <div className={styles.faqs}>
                {faqs.map((item, index) => (
                    <div className={styles.faqItem} key={index}>
                        <button 
                            aria-expanded={toggled === index}  // Update aria-expanded
                            aria-controls={`sec${index + 1}`}
                            onClick={() => toggleAccordion(index)}
                            id={`accordion${index + 1}id`}
                            className={`${styles.question} ${toggled === index ? styles.active : ''}`} >
                            {item.question}
                        </button>
                        <div
                            id={`sec${index + 1}`}
                            role="region"
                            className={`${styles.answer} ${toggled === index ? styles.open : styles.closed}`}
                            aria-labelledby={`accordion${index + 1}id`}
                            hidden={toggled !== index}  // Update hidden attribute
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