import { METADATABASE_API_URL } from '@/app/lib/constants';
import { fetchMetadata, fetchPageData, fetchACFImage } from '@/app/lib/utils';
import styles from "./page.module.css";

import NavbarState from '../components/NavbarState';
import PageHero from './PageHero';
import VoterLinks from './VoterLinks';
import Dates from './Dates';
import FAQ from './FAQ';
import Countdown from '../components/Countdown';
import Checklist from './Checklist'
import Congratulations from './Congratulations';
import Outreach from './Outreach';
import Babes from '../components/Babes';
import Footer from './Footer';

export async function generateMetadata({ params }) {
    const { slug } = params;
    try {
        const metadata = await fetchMetadata(slug);
        const metadataBase = METADATABASE_API_URL;

        // console.log("Fetched metadata:", metadata); // Debugging log

        return {
            metadataBase,
            title: metadata.title,
            description: metadata.description,
            openGraph: {
                images: metadata.ogImage ? [{ url: metadata.ogImage }] : []
            },
            jsonld: metadata.yoastMetadata?.schema?.["@graph"]
        };
    } catch (error) {
        console.error("Error in generateMetadata:", error);
        return {
            title: 'Error',
            description: 'Failed to fetch metadata',
        };
    }
}

export default async function Page({ params }) {
    const { slug } = params;
    let data;
    let titleImage;
    let checkRegistration;
    let paperRegistrationEN;
    let paperRegistrationES;
    let onlineRegistration;
    let importantDates = [];
    let countdownTo;
    let faqs = [];
    let beforeChecklist = [];
    let dayofChecklist = [];
    let listEvents = [];
    let babesList = [];
    let babesListWithImages = [];
    let checklistLink;

    try {
        const response = await fetchPageData({ slug });
        data = response[0];
        if (!data || !data.acf) {
            console.error("Data or ACF is undefined", data);
            return <div>Error loading page</div>;
        }

        try {
            if (data.acf.title_image) {
                titleImage = await fetchACFImage(data.acf.title_image);
            }
            checkRegistration = data.acf.check_registration || '';
            paperRegistrationEN = data.acf.paper_registration_english || '';
            paperRegistrationES = data.acf.paper_registration_spanish || '';
            onlineRegistration = data.acf.online_registration || '';
            importantDates = data.acf.important_dates || [];
            countdownTo = data.acf.countdown_date || 'primary';
            faqs = data.acf.faqs || [];
            beforeChecklist = data.acf.before_election_day || [];
            dayofChecklist = data.acf.day_of_election || [];
            listEvents = data.acf.outreach_events || [];
            checklistLink = data.acf.checklist_download_pdf || '';
        } catch (error) {
            console.error("Error fetching ACF data:", error);
        }

        // Fetch Babes section data by pageID
        const babesResponse = await fetchPageData({ pageID: 49 });
        babesList = babesResponse.acf?.babes || [];
        // Fetch image details for each item
        babesListWithImages = await Promise.all(babesList.map(async (item) => {
            const portrait = await fetchACFImage(item.portrait);
            return {
                ...item,
                portrait: portrait
            };
        }));
        // Shuffle the babesListWithImages array
        babesListWithImages = babesListWithImages.sort(() => Math.random() - 0.5);

    } catch (error) {
        console.error("Error in Page component:", error);
        return (
            <main className={styles.innerMain}>
                <div className={styles.innerHero}>
                    <h1>Error</h1>
                    <p>Failed to load page data.</p>
                </div>
            </main>
        );
    }

    if (!data) {
        console.error("Data is undefined or null");
        return (
            <main className={styles.innerMain}>
                <div className={styles.innerHero}>
                    <h1>Error</h1>
                    <p>Invalid page data.</p>
                </div>
            </main>
        );
    }

    const countdownHeadline = 'COUNTDOWN TO ' + countdownTo + ' ELECTION';
    const primaryElection = "August, 6, 2024 7:00:00";
    const generalElection = "November, 5, 2024 7:00:00";

    return (
        <>
        <NavbarState listEvents={listEvents} />
        <main className={styles.innerMain}>
            <div className='container'>
                <PageHero 
                    pageTitle={data.title.rendered} 
                    titleImage={titleImage?.sourceUrl || ''}
                    titleImageAlt={titleImage?.altText || 'alt'}
                    slug={slug}
                />
                <VoterLinks
                    headline="Are you registered to raise your voice?"
                    checkRegistration={checkRegistration}
                    paperRegistrationEN={paperRegistrationEN}
                    paperRegistrationES={paperRegistrationES}
                    onlineRegistration={onlineRegistration} />
                <Dates
                    headline="Dates that are a Big F*cking Deal"
                    paragraph="Jot these deadlines down so that you're ready to talk your sh*t at the polls when the time comes."
                    importantDates={importantDates} />
                <FAQ
                    headline="FAQs"
                    faqs={faqs} />
                <Countdown
                    headline={countdownHeadline}
                    deadline={countdownTo === 'Primary' ? primaryElection : generalElection} /> 
                <Checklist
                    headline="Vote Like You Mean It"
                    paragraph="Use this checklist to make sure you're ready to successfully b*tch with your ballot."
                    beforeChecklist={beforeChecklist}
                    dayofChecklist={dayofChecklist}
                    checklistLink={checklistLink} />
                <Congratulations />
                <Outreach
                    headline="Come b*tch with us" 
                    paragraph="Leading up to the election, we'll be out and about at some community events to get folks excited about exercising their constitutional right to complain." 
                    listEvents={listEvents} />
                <Babes
                    headline="THESE BABES V*TE"
                    paragraph="We're ready to go off at the polls. Will we see you there?"
                    babesList={babesListWithImages} />
                <Footer />
            </div>
        </main>
        </>
    );
}