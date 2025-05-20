import type { User } from './user.types';
export type SocialMediaPlatform = 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'youtube';
export interface SocialMediaLink {
    platform: SocialMediaPlatform;
    username: string;
    url: string;
}
export interface Creator extends User {
    bio: string;
    coverImage?: string;
    subscriberCount: number;
    categories: string[];
    monthlyPrice: number;
    isCreator: boolean;
    socialMedia?: SocialMediaLink[];
}
export interface CreatorApplicationPayload {
    displayName: string;
    username: string;
    bio: string;
    categories: string[];
    socialMedia: SocialMediaLink[];
    pricing: {
        amount: number;
        models: string[];
    };
    legal: {
        termsOfService: boolean;
        legallyAnAdult: boolean;
        contentGuidelines: boolean;
    };
}
//# sourceMappingURL=creator.types.d.ts.map