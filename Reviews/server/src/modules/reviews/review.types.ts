import type { Comment } from '../comments/comment.types.js'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type ReviewStatusFilter = ReviewStatus | 'all'

export interface Review {
  id: string
  carBrand: string
  carVersion: string
  imageUrl?: string
  author: string
  rating: number
  text: string
  createdAt: string
  updatedAt?: string
  userId?: string
  status: ReviewStatus
  moderationReason?: string
  moderatedAt?: string
  comments: Comment[]
}

export type ReviewSort = 'newest' | 'oldest' | 'rating'

export interface ReviewFilters {
  search?: string
  brand?: string
  version?: string
  minRating?: number
  sort: ReviewSort
}

export interface ReviewsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedReviews {
  items: Review[]
  pagination: ReviewsPagination
}

export interface ReviewStatusCounts {
  pending: number
  approved: number
  rejected: number
}

export interface AdminReviewsResult extends PaginatedReviews {
  counts: ReviewStatusCounts
}

export interface CarVersionSummary {
  version: string
  total: number
}

export interface CarBrandSummary {
  brand: string
  total: number
  versions: CarVersionSummary[]
}
