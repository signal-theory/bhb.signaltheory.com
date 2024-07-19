
import styles from './Outreach.module.css';

function Outreach({ headline, paragraph, listEvents }) {
    return (
        <section className={styles.container}>
            <h2>{headline}</h2>
            <p>{paragraph}</p>
            <div className={styles.outreach}>
                {listEvents && listEvents.map((item, index) => (
                    <div className={styles.outreachContainer} key={index}>
                        <div>
                            <div className={styles.title}>{item.date}</div>
                        </div>
                     <div>
                        <div className={styles.title}>{item.title}</div>
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: item.description }}></div>
                        </div>
                        <div>
                            <div className={styles.title}>{item.venue_time}</div>
                            <div className={styles.description}>{item.address}</div>
                            {item.link && <a href={item.link.url} className={styles.link} target={item.link.target}>{item.link.title}</a>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default Outreach;