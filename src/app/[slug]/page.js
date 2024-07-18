import { METADATABASE_API_URL } from '@/app/lib/constants';
import { fetchMetadata, fetchPageData, fetchACFImage } from '@/app/lib/utils';
import styles from "./page.module.css";

import PageHero from './PageHero';
import VoterLinks from './VoterLinks';
import Dates from './Dates';
import FAQ from './FAQ';

export async function generateMetadata({ params }) {
    const { slug } = params;
    try {
        const metadata = await fetchMetadata(slug);
        const metadataBase = METADATABASE_API_URL;
      
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
    try {
        const response = await fetchPageData(slug);
        data = response[0];
        
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
          } catch (error) {
            console.error("Error fetching title image:", data.acf.title_image);
          }
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

    return (
        <main className={styles.innerMain}>
            <div className='container'>
                <PageHero 
                    pageTitle={data.title.rendered} 
                    titleImage={titleImage ? titleImage.sourceUrl : ''}
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
            </div>
        </main>
    );
}