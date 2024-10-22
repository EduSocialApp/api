import PostLikeController from './postlike.controller'

import dbPost from '../../post/post.service'

export class PostLike extends PostLikeController {
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

export default new PostLike()
