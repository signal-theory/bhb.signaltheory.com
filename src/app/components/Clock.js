'use client';
import React, { useEffect, useState } from "react";
import styles from './Countdown.module.css';

const Clock = ({ deadline }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [daysPercentage, setDaysPercentage] = useState(0);
  const [hoursPercentage, setHoursPercentage] = useState(0);
  const [minutesPercentage, setMinutesPercentage] = useState(0);

  const leading0 = (num) => {
    return num < 10 ? "0" + num : num;
  };

  const getTimeUntil = (deadline) => {
    const time = Date.parse(deadline) - Date.parse(new Date());
    if (time > 0) {
      const daysLeft = Math.ceil(time / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.ceil((time / (1000 * 60 * 60)) % 24);
      const minutesLeft = Math.ceil((time / 1000 / 60) % 60);

      setDays(daysLeft);
      setHours(hoursLeft);
      setMinutes(minutesLeft);

      setDaysPercentage((daysLeft / 365) * 100);
      setHoursPercentage((hoursLeft / 24) * 100);
      setMinutesPercentage((minutesLeft / 60) * 100);
    }
  };

  useEffect(() => {
    setInterval(() => getTimeUntil(deadline), 1000);

    return () => getTimeUntil(deadline);
  }, [deadline]);

  return (
    <>
      <div className={styles.bubble}>
        <div className={styles.pie} style={{ '--percentage': daysPercentage }}></div>
        <div className={styles.time}>
          {leading0(days)}
        </div>
      </div>
      <div className={styles.bubble}>
        <div className={styles.pie} style={{ '--percentage': hoursPercentage }}></div>
        <div className={styles.time}>
          {leading0(hours)}
        </div>
      </div>
      <div className={styles.bubble}>
        <div className={styles.pie} style={{ '--percentage': minutesPercentage }}></div>
        <div className={styles.time}>
          {leading0(minutes)}
        </div>
      </div>
    </>
  );
};

export default Clock;
