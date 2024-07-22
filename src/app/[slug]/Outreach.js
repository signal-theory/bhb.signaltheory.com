
import styles from './Outreach.module.css';

function Outreach({ headline, paragraph, listEvents }) {
    return (
        <>
        {listEvents.length > 0 && (
        <section className={styles.container} id="outreach">
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
                            <div className={styles.description} style={{marginBottom: '1rem'}}>{item.address}</div>
                            {item.link && <a href={item.link.url} className={`btn btn-yellow-outline ${styles.link}`} target={item.link.target}>
                                <span>{item.link.title}</span>
                            </a>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
        )}
        </>
    )
}
export default Outreach;