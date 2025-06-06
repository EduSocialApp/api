import { NextFunction, Request, Response } from 'express'

import { post } from '../../../modules/post'

export async function getOrganizationPosts(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: organizationId } = request.params as { id: string }
        let { lastPostId } = request.query as { lastPostId: string }

        const listPosts = await post.getFeed([], [organizationId], lastPostId, 30)

        lastPostId = listPosts.length > 0 ? listPosts[listPosts.length - 1]?.id : lastPostId || ''

        response
            .status(200)
            .setHeader('last-post-id', lastPostId || '')
            .json(listPosts)
    } catch (e) {
        next(e)
    }
}
