import { PAGES_API_URL, MEDIA_API_URL } from './constants';
import he from 'he';

export async function fetchMetadata(slug) {
    const url = `${PAGES_API_URL}?slug=${slug}`;
  
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`Failed to fetch metadata. Status: ${res.status}, URL: ${url}`);
        const errorText = await res.text();
        console.error(`Response Text: ${errorText}`);
        throw new Error('Failed to fetch metadata');
    }
  
    const data = await res.json();
    const yoastMetadata = data[0]?.yoast_head_json || {};
    const ogImage = yoastMetadata.og_image ? yoastMetadata.og_image[0]?.url : null;
    return {
        title: he.decode(yoastMetadata.title) || 'Default Title',
        description: yoastMetadata.description || 'Default Description',
        ogImage: ogImage,
        yoastMetadata: yoastMetadata
    };
}

export async function fetchPageData({ slug, pageID }) {
    let url;
    if (slug) {
        url = `${PAGES_API_URL}?slug=${slug}`;
    } else if (pageID) {
        url = `${PAGES_API_URL}/${pageID}?_embed`;
    } else {
        throw new Error('Either slug or pageID must be provided');
    }

    const res = await fetch(url);
    if (!res.ok) {
        console.error(`Failed to fetch page data. Status: ${res.status}, URL: ${url}`);
        const errorText = await res.text();
        console.error(`Response Text: ${errorText}`);
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export async function fetchACFImage(imageId) {
    const res = await fetch(`${MEDIA_API_URL}/${imageId}`);
    if (!res.ok) {
        console.error(`Failed to fetch image data. Status: ${res.status}, URL: ${MEDIA_API_URL}/${imageId}`);
        const errorText = await res.text();
        console.error(`Response Text: ${errorText}`);
        throw new Error('Failed to fetch image data');
    }
    const imageData = await res.json();
    return {
        sourceUrl: imageData.source_url,
        altText: imageData.alt_text || 'Image'
    };
}

export async function fetchMediaData(mediaId, size = 'full') {
    const res = await fetch(`${MEDIA_API_URL}/${mediaId}`);
    if (!res.ok) {
        console.error(`Failed to fetch media data. Status: ${res.status}, URL: ${MEDIA_API_URL}/${mediaId}`);
        const errorText = await res.text();
        console.error(`Response Text: ${errorText}`);
        throw new Error(`Failed to fetch data for media ${mediaId}`);
    }
    const data = await res.json();
    const imageUrl = data.media_details.sizes[size]
        ? data.media_details.sizes[size].source_url
        : data.source_url;
    return {
        ...data,
        source_url: imageUrl
    };
}