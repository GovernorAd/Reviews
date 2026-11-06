import { randomUUID } from 'node:crypto'

import type { Comment } from '../comments/comment.types.js'
import type {
  CreateReviewInput,
  ModerateReviewInput,
  UpdateReviewInput,
} from './review.schema.js'
import { reviewSeed } from './review.seed.js'
import type {
  AdminReviewsResult,
  CarBrandSummary,
  PaginatedReviews,
  Review,
  ReviewFilters,
  ReviewSort,
  ReviewStatusCounts,
  ReviewStatusFilter,
} from './review.types.js'

const comparators: Record<ReviewSort, (a: Review, b: Review) => number> = {
  newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  oldest: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  rating: (a, b) => b.rating - a.rating || Date.parse(b.createdAt) - Date.parse(a.createdAt),
}

interface CreateCommentRecord {
  text: string
  author: string
  userId: string
}

const normalize = (value: string) => value.toLocaleLowerCase('ru-RU')

class ReviewRepository {
  private reviews: Review[] = reviewSeed.map((review) => ({
    ...review,
    status: 'approved',
    comments: [...review.comments],
  }))

  findPage(filters: ReviewFilters, page: number, limit: number): PaginatedReviews {
    const search = filters.search ? normalize(filters.search) : undefined
    const brand = filters.brand ? normalize(filters.brand) : undefined
    const version = filters.version ? normalize(filters.version) : undefined

    const filtered = this.reviews
      .filter((review) => {
        if (review.status !== 'approved') {
          return false
        }

        const matchesSearch =
          !search ||
          normalize(review.carBrand).includes(search) ||
          normalize(review.carVersion).includes(search) ||
          normalize(review.author).includes(search) ||
          normalize(review.text).includes(search)
        const matchesBrand = !brand || normalize(review.carBrand) === brand
        const matchesVersion = !version || normalize(review.carVersion) === version
        const matchesRating = filters.minRating === undefined || review.rating >= filters.minRating

        return matchesSearch && matchesBrand && matchesVersion && matchesRating
      })
      .sort(comparators[filters.sort])

    return this.toPage(filtered, page, limit)
  }

  findAdminPage(
    status: ReviewStatusFilter,
    page: number,
    limit: number,
  ): AdminReviewsResult {
    const counts: ReviewStatusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    }

    for (const review of this.reviews) {
      counts[review.status] += 1
    }

    const filtered = this.reviews
      .filter((review) => status === 'all' || review.status === status)
      .sort(comparators.newest)

    return {
      ...this.toPage(filtered, page, limit),
      counts,
    }
  }

  getCatalog(): CarBrandSummary[] {
    const brands = new Map<
      string,
      {
        brand: string
        total: number
        versions: Map<string, { version: string; total: number }>
      }
    >()

    for (const review of this.reviews) {
      if (review.status !== 'approved') {
        continue
      }

      const brandKey = normalize(review.carBrand)
      let brandEntry = brands.get(brandKey)

      if (!brandEntry) {
        brandEntry = {
          brand: review.carBrand,
          total: 0,
          versions: new Map(),
        }
        brands.set(brandKey, brandEntry)
      }

      brandEntry.total += 1

      const versionKey = normalize(review.carVersion)
      const versionEntry = brandEntry.versions.get(versionKey)

      if (versionEntry) {
        versionEntry.total += 1
      } else {
        brandEntry.versions.set(versionKey, {
          version: review.carVersion,
          total: 1,
        })
      }
    }

    return [...brands.values()]
      .map((entry) => ({
        brand: entry.brand,
        total: entry.total,
        versions: [...entry.versions.values()].sort(
          (a, b) => b.total - a.total || a.version.localeCompare(b.version, 'ru'),
        ),
      }))
      .sort((a, b) => a.brand.localeCompare(b.brand, 'ru'))
  }

  findById(id: string): Review | undefined {
    return this.reviews.find((review) => review.id === id)
  }

  create(input: CreateReviewInput & { author: string; userId: string }): Review {
    const review: Review = {
      id: randomUUID(),
      carBrand: input.carBrand,
      carVersion: input.carVersion,
      imageUrl: input.imageUrl,
      author: input.author,
      rating: input.rating,
      text: input.text,
      createdAt: new Date().toISOString(),
      userId: input.userId,
      status: 'pending',
      comments: [],
    }

    this.reviews = [review, ...this.reviews]

    return review
  }

  update(id: string, input: UpdateReviewInput): Review | null {
    const review = this.findById(id)

    if (!review) {
      return null
    }

    review.carBrand = input.carBrand
    review.carVersion = input.carVersion
    review.imageUrl = input.imageUrl
    review.rating = input.rating
    review.text = input.text
    review.updatedAt = new Date().toISOString()

    return review
  }

  moderate(id: string, input: ModerateReviewInput): Review | null {
    const review = this.findById(id)

    if (!review) {
      return null
    }

    review.status = input.status
    review.moderationReason = input.status === 'rejected' ? input.reason : undefined
    review.moderatedAt = new Date().toISOString()
    review.updatedAt = review.moderatedAt

    return review
  }

  addComment(reviewId: string, input: CreateCommentRecord): Comment | null {
    const review = this.findById(reviewId)

    if (!review) {
      return null
    }

    const comment: Comment = {
      id: randomUUID(),
      reviewId,
      author: input.author,
      userId: input.userId,
      text: input.text,
      createdAt: new Date().toISOString(),
    }

    review.comments.push(comment)

    return comment
  }

  delete(id: string): boolean {
    const nextReviews = this.reviews.filter((review) => review.id !== id)

    if (nextReviews.length === this.reviews.length) {
      return false
    }

    this.reviews = nextReviews

    return true
  }

  private toPage(reviews: Review[], page: number, limit: number): PaginatedReviews {
    const total = reviews.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    return {
      items: reviews.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }
}

export const reviewRepository = new ReviewRepository()
