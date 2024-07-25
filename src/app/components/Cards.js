'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link'
import styles from './Cards.module.css'
import { AppContext } from '../context/AppContext';

const cardData = [
    { title: 'MISSOURI', linkTo: '/voting-in-missouri', name: 'voting-in-missouri' },
    { title: 'KANSAS', linkTo: '/voting-in-kansas', name: 'voting-in-kansas' },
    { title: 'TEXAS', linkTo: '/voting-in-texas', name: 'voting-in-texas' }
];

function Cards() {

    const { setMyState } = useContext(AppContext); 

    const handleStateSelect = (state) => {
        setMyState(state);
      };

    return (
        <aside className={styles.cardsWrapper}>
            <div className={styles.cardsContainer}>
                {cardData.map((card, index) => (
                    <Link className={styles.card} key={index} href={card.linkTo} onClick={() => handleStateSelect(card.name)}>
                        <h5 className={styles.cardTitle}>{card.title}</h5>
                        <svg width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.889 23.8785C16.4288 23.8785 16.0557 24.2516 16.0557 24.7118C16.0557 25.1721 16.4288 25.5452 16.889 25.5452L32.0959 25.5452L26.2858 31.3552C25.9604 31.6807 25.9604 32.2083 26.2858 32.5338C26.6112 32.8592 27.1389 32.8592 27.4643 32.5338L34.697 25.3011C35.0224 24.9757 35.0224 24.448 34.697 24.1226L27.4643 16.8899C27.1389 16.5645 26.6112 16.5645 26.2858 16.8899C25.9604 17.2154 25.9604 17.743 26.2858 18.0684L32.0959 23.8785L16.889 23.8785Z" fill="#EF4239"/>
                            <circle cx="25.5" cy="25" r="24.1667" stroke="#EF4239" strokeWidth="1.66667"/>
                        </svg>
                    </Link>
                ))}
            </div>
        </aside>
    );
}

export default Cards;