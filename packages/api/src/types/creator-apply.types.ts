export interface SocialMediaLink {
	platform: 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'facebook'
	url: string
}

export interface CreatorPricing {
	amount: number
	models: string[]
}

export interface CreatorLegal {
	termsOfService: boolean
	contentGuidelines: boolean
	legallyAnAdult: boolean
}

export interface CreatorApplicationPayload {
	displayName: string
	username: string
	bio: string
	categories: string[]
	socialMedia: SocialMediaLink[]
	pricing: CreatorPricing
	legal: CreatorLegal
} 