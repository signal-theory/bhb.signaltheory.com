

import Hero from './components/Hero';
import Popup from './components/Popup';
import Stickers from './components/Stickers';
import Cards from './components/Cards';
import styles from './page.module.css'

export default function Home() {

    return (
        <>
          <main className={`${styles.main}`}>
            <Hero />
            <Stickers />
          </main>
          <Cards />
        </>
    );
}