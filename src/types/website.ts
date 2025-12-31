import { Timestamp } from 'firebase/firestore';

export type BlockType = 'USER_HERO' | 'USER_MENU_PREVIEW' | 'USER_HOURS_LOCATION' | 'USER_TEXT';

export interface WebsiteBlock {
    id: string;
    type: BlockType;
    content: any; // Flexible schema based on type
    settings?: {
        theme?: 'dark' | 'light';
        padding?: string;
    };
    order: number;
}

export interface WebsitePage {
    id: string;
    slug: string; // e.g. 'home', 'events'
    title: string;
    seoDescription?: string;
    blocks: WebsiteBlock[];
    isPublished: boolean;
    publishedAt?: Timestamp;
}

// --- Specific Block Content Interfaces ---

export interface HeroBlockContent {
    headline: string;
    subheadline: string;
    backgroundImageUrl: string;
    ctaText?: string;
    ctaLink?: string;
}

export interface MenuPreviewBlockContent {
    title: string;
    featuredCategoryIds: string[];
    limit: number;
}

export interface HoursLocationBlockContent {
    address: string;
    mapEmbedUrl?: string;
    schedule: { day: string; hours: string }[];
}
