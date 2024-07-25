
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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