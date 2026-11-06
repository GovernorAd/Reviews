export interface Comment {
  id: string
  reviewId: string
  author: string
  userId?: string
  text: string
  createdAt: string
}

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

export interface AdminReviewsQuery {
  status?: ReviewStatusFilter
  page?: number
  limit?: number
}

export type ModerateReviewPayload =
  | { status: 'approved' }
  | { status: 'rejected'; reason: string }

export type UpdateReviewPayload = CreateReviewPayload

export interface CarVersionSummary {
  version: string
  total: number
}

export interface CarBrandSummary {
  brand: string
  total: number
  versions: CarVersionSummary[]
}

export type ReviewSort = 'newest' | 'oldest' | 'rating'

export interface ReviewsQuery {
  search?: string
  brand?: string
  version?: string
  minRating?: number
  sort?: ReviewSort
  page?: number
  limit?: number
}

export interface CreateReviewPayload {
  carBrand: string
  carVersion: string
  imageUrl?: string
  rating: number
  text: string
}

export interface CreateCommentPayload {
  text: string
}
