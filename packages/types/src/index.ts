// User types
export interface User {
  id: string
  email: string
  displayName: string
  username: string
  profileImage?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Creator types
export interface Creator extends User {
  bio: string
  coverImage?: string
  subscriberCount: number
  categories: string[]
  monthlyPrice: number
  isCreator: boolean
}

// Subscription types
export interface Subscription {
  id: string
  userId: string
  creatorId: string
  status: 'active' | 'cancelled' | 'expired'
  startDate: string
  endDate?: string
  price: number
}

// Content types
export interface Content {
  id: string
  creatorId: string
  title: string
  description: string
  type: 'post' | 'video' | 'image' | 'audio'
  url: string
  thumbnailUrl?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
