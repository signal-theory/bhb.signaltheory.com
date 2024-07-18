
import styles from './Dates.module.css';

function Dates({ headline, paragraph, importantDates }) {
    return (
        <section className={styles.container}>
            <h2>{headline}</h2>
            <p>{paragraph}</p>
            <div className={styles.dates}>
            {importantDates.map((item, index) => (
                <div className={styles.datesContainer} key={index}>
                    <div className={styles.number}>{index + 1}</div>
                    <div className={styles.date}>{item.date}</div>
                    <div className={styles.title}>{item.title}</div>
                </div>
            ))}
            </div>
        </section>
    )
}
export default Dates;