
import Image from 'next/image';
import styles from './PageHero.module.css'
function Hero({ titleImage, titleImageAlt, pageTitle}) {
    return (
        <section className={styles.hero}>
            {titleImage ? (
            <>
                <h1 className='screen-reader-only'>{pageTitle}</h1>
                <Image
                    priority
                    alt={titleImageAlt}
                    src={titleImage}
                    width={650}
                    height={400}
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                />
            </>
            ) : <h1>{pageTitle}</h1>}
        </section>
    )
}
export default Hero;