// export interface Discounts {
//   quarterly: string;
//   biAnnual: string;
//   yearly: string;
// }

// export interface Legal {
//   terms: boolean;
//   isAdult: boolean;
// }

// export interface SocialMedia {
//   facebook: string;
//   instagram: string;
//   twitter: string;
//   tiktok: string;
// }

// export interface FormValues {
//   displayName: string;
//   username: string;
//   bio: string;
//   categories: string[];
//   social: SocialMedia;
//   pricing: Discounts;
//   legal: Legal;
//   monthlyPrice: number;
//   discounts: Discounts;
//   quarterlyPrice: number;
//   biAnnualPrice: number;
//   yearlyPrice: number;
// }

export interface SocialMediaItem {
	platform: string
	url: string
}

export interface Pricing {
	amount: number
	tiers: {
		[key: string]: number // quarterly, biAnnual, yearly discounts
	}
}

export interface Legal {
	termsOfService: boolean
	contentGuidelines: boolean
	isAdult: boolean
}

export interface FormValues {
	displayName: string
	username: string
	bio: string
	categories: string[]
	socialMedia: SocialMediaItem[]
	pricing: Pricing
	legal: Legal
}
