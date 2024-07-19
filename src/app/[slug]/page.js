import { METADATABASE_API_URL } from '@/app/lib/constants';
import { fetchMetadata, fetchPageData, fetchACFImage } from '@/app/lib/utils';
import styles from "./page.module.css";

import PageHero from './PageHero';
import VoterLinks from './VoterLinks';
import Dates from './Dates';
import FAQ from './FAQ';
import Countdown from '../components/Countdown';
import Checklist from './Checklist'
import Congratulations from './Congratulations';
import Outreach from './Outreach';
import Babes from '../components/Babes';

export async function generateMetadata({ params }) {
    const { slug } = params;
    try {
        const metadata = await fetchMetadata(slug);
        const metadataBase = METADATABASE_API_URL;
        if (!metadata) {
            console.error("Metadata is undefined");
            return {};
        }
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
    let importantDates = [];
    let faqs = [];
    let beforeChecklist = [];
    let dayofChecklist = [];
    let listEvents = [];
    let babesList = [];
    let babesListWithImages = [];
    let checklistLink;
    try {
        const response = await fetchPageData({slug});
        data = response[0];
        if (!data || !data.acf) {
            console.error("Data or ACF is undefined", data);
            return <div>Error loading page</div>;
        }
        try {
            if (data.acf && data.acf.title_image) {
              titleImage = await fetchACFImage(data.acf.title_image);
            }
            if (data.acf && data.acf.important_dates) {
                importantDates = data.acf.important_dates;
            }
            if (data.acf && data.acf.faqs) {
                faqs = data.acf.faqs;
            }
            if (data.acf && data.acf.before_election_day) {
                beforeChecklist = data.acf.before_election_day;
            }
            if (data.acf && data.acf.day_of_election) {
                dayofChecklist = data.acf.day_of_election;
            }
            if (data.acf && data.acf.outreach_events) {
                listEvents = data.acf.outreach_events;
            }
            if (data.acf && data.acf.checklist_download_pdf) {
                checklistLink = data.acf.checklist_download_pdf;
            }
          } catch (error) {
            console.error("Error fetching title image:", data.acf.title_image);
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

    // Log the rendered output to help identify discrepancies
    // console.log("Server-rendered data:", data);

    return (
        <main className={styles.innerMain}>
            <div className='container'>
                
                <PageHero 
                    pageTitle={data.title.rendered} 
                    titleImage={titleImage?.sourceUrl || ''}
                    titleImageAlt={titleImage?.altText || 'alt'}
                />
                <VoterLinks
                    headline="Are you registered to raise your voice?" />
               
                <Dates
                    headline="Dates that are a Big F*cking Deal"
                    paragraph="Jot these deadlines down so that you're ready to talk your sh*t at the polls when the time comes."
                    importantDates={importantDates} />
                <FAQ
                    headline="FAQs"
                    faqs={faqs} />
                <Countdown
                    headline="COUNTDOWN TO ELECTION"
                    deadline="November, 5, 2024 7:00:00" /> 
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

            </div>
        </main>
    );
}