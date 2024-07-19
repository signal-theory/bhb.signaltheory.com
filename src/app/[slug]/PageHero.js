'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import styles from './PageHero.module.css'
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function Hero({ titleImage, titleImageAlt, pageTitle}) {
    
    useEffect(() => {
        gsap.to(".spin", {
            scrollTrigger: {
                trigger: ".spin",
                scrub: "true"
            },
            rotation: 360,
            duration: 1,
            ease: "none",
        });
    }, []); 

    return (
        <section className={styles.hero}>
            <div className={`spin ${styles.innerMain}`}></div>
            {titleImage ? (
            <>
                <h1 className='screen-reader-only'>{pageTitle}</h1>
                <Image
                    priority
                    alt={titleImageAlt}
                    src={titleImage}
                    width={650}
                    height={400}
                    className={`${styles.image}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                />
            </>
            ) : <h1>{pageTitle}</h1>}
        </section>
    )
}
export default Hero;