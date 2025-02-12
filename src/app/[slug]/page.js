import { voterLinksData } from '../../data/voterLinks';
import { datesData } from '../../data/dates';
import { faqsData } from '../../data/faqs';
import { checklistData } from '../../data/checklist';
import { babesData } from '../../data/babes';
import { metadataData } from '../../data/metadata';
import styles from "./page.module.css";

import NavbarState from '../components/NavbarState';
import PageHero from './PageHero';
import VoterLinks from './VoterLinks';
import Dates from './Dates';
import FAQ from './FAQ';
// import Countdown from '../components/Countdown';
import Checklist from './Checklist'
import Congratulations from './Congratulations';
import Outreach from './Outreach';
import Babes from '../components/Babes';
import Footer from './Footer';

export async function generateMetadata({ params }) {
    const { slug } = params;
    const metadata = metadataData[slug];

    if (!metadata) {
        return {
            metatitle: 'Error',
            description: 'Page not found',
        };
    }

    return {
        metadataBase: metadata.metadataBase,
        metatitle: metadata.metatitle,
        description: metadata.description,
        openGraph: {
            images: [{ url: metadata.ogImage }]
        }
    };
}

export default async function Page({ params }) {
    const { slug } = params;
    let countdownTo;
    let listEvents = [];

    const countdownHeadline = 'COUNTDOWN TO ' + countdownTo + ' ELECTION';
    const primaryElection = "August, 6, 2024 7:00:00";
    const generalElection = "November, 5, 2024 7:00:00";

    return (
        <>
        <NavbarState listEvents={listEvents} />
        <main className={styles.innerMain}>
            <div className='container'>
                <PageHero 
                    pageTitle={metadataData[slug].title} 
                    titleImage={metadataData[slug].titleImage}
                    titleImageAlt={metadataData[slug].title}
                    slug={slug}
                />
                {voterLinksData[slug] ? (
                    <VoterLinks data={voterLinksData[slug]} />
                ) : (
                    console.error(`No voter links data found for slug: ${slug}`)
                )}
                {datesData[slug] ? (
                    <Dates data={datesData[slug]} />
                ) : (
                    console.error(`No dates data found for slug: ${slug}`)
                )}
                {faqsData[slug] ? (
                    <FAQ data={faqsData[slug]} />
                ) : (
                    console.error(`No FAQs data found for slug: ${slug}`)
                )}
                {/* <Countdown
                    headline={countdownHeadline}
                    deadline={countdownTo === 'Primary' ? primaryElection : generalElection} />  */}
                {checklistData[slug] ? (
                    <Checklist 
                        data={checklistData[slug]} />
                ) : (
                    console.error(`No checklist data found for slug: ${slug}`)
                )}
                <Congratulations />
                <Outreach
                    headline="Come b*tch with us" 
                    paragraph="Leading up to the election, we'll be out and about at some community events to get folks excited about exercising their constitutional right to complain." 
                    listEvents={listEvents} />
                <Babes data={babesData} />
                <Footer />
            </div>
        </main>
        </>
    );
}
