import PostLikeRepository from '../../repositories/like/postLike.repository'

import dbPost from '../post.service'

class PostLike extends PostLikeRepository {
    async like(postId: string, userId: string) {
        await this.create(postId, userId)
        await dbPost.incrementLikesCounterByPostId(postId)
    }

    async unlike(postId: string, userId: string) {
        await this.delete(postId, userId)
        await dbPost.decrementLikesCounterByPostId(postId)
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
export default postLike
