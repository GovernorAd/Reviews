export interface Comment {
  id: string
  reviewId: string
  author: string

  userId?: string
  text: string
  createdAt: string
}
