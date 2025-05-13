import PostLikeRepository from '../../repositories/like/postLike.repository'

import { post } from '../post.service'

class PostLike extends PostLikeRepository {
    async like(postId: string, userId: string) {
        await this.create(postId, userId)
        await post.incrementLikesCounterByPostId(postId)
    }

    async unlike(postId: string, userId: string) {
        await this.delete(postId, userId)
        await post.decrementLikesCounterByPostId(postId)
    }

    async likeOrUnlike(postId: string, userId: string) {
        const hasLiked = await this.getLike(postId, userId)

        if (hasLiked) {
            this.unlike(postId, userId)
        } else {
            this.like(postId, userId)
        }
    }
}

const postLike = new PostLike()
export { postLike }
