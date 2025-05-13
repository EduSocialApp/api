import { NextFunction, Request, Response } from 'express'

import { post as dbPost } from '../../../modules/post'

export async function getUserPosts(request: Request, response: Response, next: NextFunction) {
    dbPost.userLoggedId = request.user.id

    try {
        const { id } = request.params as { id: string }
        let { lastPostId } = request.query as { lastPostId: string }

        const listPosts = await dbPost.getFeed([id], [], lastPostId, 30)

        lastPostId = listPosts.length > 0 ? listPosts[listPosts.length - 1]?.id : lastPostId || ''

        response
            .status(200)
            .setHeader('last-post-id', lastPostId || '')
            .json(listPosts)
    } catch (e) {
        next(e)
    }
}
