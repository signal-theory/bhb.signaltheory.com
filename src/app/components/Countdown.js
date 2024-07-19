import React from "react"
import Clock from "./Clock"
import styles from "./Countdown.module.css";


const Countdown = ({headline, deadline}) => {

  return (
    <div className={styles.countdown} id="countdown">
        <h2>{headline}</h2>
        <div className={styles.ticker}>
            <Clock deadline={deadline} />
        </div>
        <div className={styles.labels}>
            <div className={styles.label}>
                DAYS
            </div>
            <div className={styles.label}>
                HOURS
            </div>
            <div className={styles.label}>
                MINUTES
            </div>
        </div>
    </div >
  )
}

export default Countdown
