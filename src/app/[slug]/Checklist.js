
import styles from './Checklist.module.css';

function Checklist({ headline, paragraph, beforeChecklist, dayofChecklist }) {
    return (
        <section className={styles.container}>
            <h2>{headline}</h2>
            <p>{paragraph}</p>
            <div className={styles.checklist}>
                <div>
                    <p className={styles.title}>Before Election Day</p>
                    {beforeChecklist.map((item, index) => (
                        <div className={styles.checklistContainer} key={index}>
                            <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43.4238 20.7177L37.0331 15.723L39.2772 7.91349L31.1813 7.64119L28.4211 0L21.7116 4.554L15.0021 0L12.242 7.64119L4.14607 7.91349L6.38948 15.723L-0.000488281 20.7177L6.38948 25.713L4.14607 33.5219L12.242 33.7948L15.0021 41.4353L21.7116 36.8814L28.4211 41.4353L31.1813 33.7948L39.2772 33.5219L37.0331 25.713L43.4238 20.7177Z" fill="#282560"/>
                            </svg>
                            <div className={styles.item}>{item.checklist_item}</div>
                        </div>
                    ))}
                </div>
                <div>
                    <p className={styles.title}>Day of Election</p>
                    {dayofChecklist.map((item, index) => (
                        <div className={styles.checklistContainer} key={index}>
                            <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43.4238 20.7177L37.0331 15.723L39.2772 7.91349L31.1813 7.64119L28.4211 0L21.7116 4.554L15.0021 0L12.242 7.64119L4.14607 7.91349L6.38948 15.723L-0.000488281 20.7177L6.38948 25.713L4.14607 33.5219L12.242 33.7948L15.0021 41.4353L21.7116 36.8814L28.4211 41.4353L31.1813 33.7948L39.2772 33.5219L37.0331 25.713L43.4238 20.7177Z" fill="#282560"/>
                            </svg>
                            <div className={styles.item}>{item.checklist_item}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default Checklist;