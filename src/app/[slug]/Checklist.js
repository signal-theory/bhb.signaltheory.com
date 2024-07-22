
'use client';
import { useEffect } from 'react';
import styles from './Checklist.module.css';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function Checklist({ headline, paragraph, beforeChecklist, dayofChecklist, checklistLink, checklistShare }) {

    useEffect(() => {
        gsap.to(".rollTop", {
            scrollTrigger: {
                trigger: ".rollTop",
                scrub: "true"
            },
            x: -400,
            rotation: 360,
            duration: 3,
        });
    }, []); 
    useEffect(() => {
        gsap.to(".rollBottom", {
            scrollTrigger: {
                trigger: ".rollBottom",
                scrub: "true"
            },
            x: 400,
            rotation: 360,
            duration: 3,
        });
    }, []); 

    return (
        <>
        {(beforeChecklist.length > 0 || dayofChecklist.length > 0) && (
        <section className={styles.container} id="make-a-plan">
            <h2>{headline}</h2>
            <p>{paragraph}</p>
            <div className={`rollTop ${styles.voteBurst}`}></div>
            <div className={styles.checklist}>
                <div>
                    <p className={styles.title}>Before Election Day</p>
                    {beforeChecklist.map((item, index) => (
                        <div className={styles.checklistContainer} key={index}>
                            <div className={styles.item}>{item.checklist_item}</div>
                        </div>
                    ))}
                </div>
                <div>
                    <p className={styles.title}>Day of Election</p>
                    {dayofChecklist.map((item, index) => (
                        <div className={styles.checklistContainer} key={index}>
                            <div className={styles.item}>{item.checklist_item}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.links}>
                {checklistLink && <a href={checklistLink.sourceUrl} className={`btn btn-blue ${styles.link}`} target="_blank">
                    <span>DOWNLOAD CHECKLIST</span>
                </a>}
                <button 
                    id="share" 
                    className="button"
                    style={{marginLeft: '10px'}}>
                        SHARE
                </button>
            </div>
            <div className={`rollBottom ${styles.voteCircle}`}></div>
        </section>
        )}
        </>
    )
}
export default Checklist;