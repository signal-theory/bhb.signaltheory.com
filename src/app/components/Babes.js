
import Image from 'next/image';
import styles from './Babes.module.css';

function Babes({ headline, paragraph, babesList }) {
    return(
        <section className={styles.container}>
            <h2>{headline}</h2>
            <p>{paragraph}</p>
            <div className={styles.babesList}>
                {babesList.map((item, index) => (
                    <div className={styles.babe} key={index}>
                        <div className={styles.portrait}>
                            <Image 
                                src={item.portrait?.sourceUrl || ''}
                                alt={item.portrait?.altText || ''}
                                width={400}
                                height={400}
                            /> 
                        </div>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.title}>{item.title}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default Babes;