export interface Subscriber {
	id: string
	name: string
	email: string
	avatar: string
	plan: 'monthly' | 'yearly'
	status: 'active' | 'expired' | 'cancelled'
	totalRevenue: number
	joinedAt: string
}

export interface Stats {
	name: string
	key: string
	value: number
	trend: number
	icon: string
	color: string
}

export interface Filters {
	search: string
	plan: string
	status: string
} 