import type { User } from './user.types';

export interface Creator extends User {
	bio: string
	coverImage?: string
	subscriberCount: number
	categories: string[]
	monthlyPrice: number
	isCreator: boolean
} 