
'use client';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './Checklist.module.css';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { FacebookShare, TwitterShare, LinkedinShare, WhatsappShare, FacebookMessengerShare, EmailShare, RedditShare } from 'react-share-kit';

function Checklist({ headline, paragraph, beforeChecklist, dayofChecklist, checklistLink, checklistShare }) {
    
    const shareUrl = 'https://bhb.signaltheory.com';
    const title = 'Use this checklist to make sure you\'re ready to successfully b*tch with your ballot.';
    const size = '40px'
    const [ shareLinks, openShareLinks ] = useState(false)

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


    const { checkedItems, setCheckedItems } = useContext(AppContext);

    const handleItemClick = (index) => {
        setCheckedItems((prev) => {
            if (prev.includes(index)) {
                return prev.filter((item) => item !== index);
            } else {
                return [...prev, index];
            }
        });
    };

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
                       <div 
                            className={`${styles.checklistContainer} ${checkedItems.includes(index) ? styles.clicked : ''}`} 
                            key={index}
                            onClick={() => handleItemClick(index)}
                        >
                            <div className={styles.item}>{item.checklist_item}</div>
                        </div>
                    ))}
                </div>
                <div>
                    <p className={styles.title}>Day of Election</p>
                    {dayofChecklist.map((item, index) => (
                        <div 
                            className={`${styles.checklistContainer} ${checkedItems.includes(index + beforeChecklist.length) ? styles.clicked : ''}`} 
                            key={index}
                            onClick={() => handleItemClick(index + beforeChecklist.length)}
                        >
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
                    className={`button ${styles.shareBtn}`}
                    onClick={() => openShareLinks(!shareLinks)}>
                        <span>SHARE</span>
                        <div className={shareLinks ? styles.openShareLinks : styles.shareLinks}>
                        <FacebookShare 
                            url={shareUrl} 
                            quote={title}
                            round blankTarget size={size} />
                        <TwitterShare
                            url={shareUrl}
                            title={title}
                            hashtags={["#react-share-kit", "#front-end"]}
                            round blankTarget size={size} />
                        <LinkedinShare 
                            url={shareUrl}
                            round blankTarget size={size} />
                        <WhatsappShare
                            url={shareUrl}
                            title={title}
                            separator=":: "
                            round blankTarget size={size} />
                        {/* <FacebookMessengerShare
                            url={shareUrl}
                            redirectUri={shareUrl}
                            appId={'dmm4kj9djk203k4liuf994p'}
                            /> */}
                            <EmailShare
                                url={shareUrl}
                                subject={'Vote Like You Mean It'}
                                body={title}
                                round blankTarget size={size} />
                            <RedditShare 
                                url={shareUrl}
                                round blankTarget size={size}  />
                    </div>
                </button>
            </div>
            
            <div className={`rollBottom ${styles.voteCircle}`}></div>
        </section>
        )}
        </>
    )
}
export default Checklist;