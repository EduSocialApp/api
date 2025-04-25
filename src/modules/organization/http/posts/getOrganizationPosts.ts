import { NextFunction, Request, Response } from 'express'

import dbPost from '../../../../modules/post/post.service'

export default async function getOrganizationPosts(request: Request, response: Response, next: NextFunction) {
    try {
        const { organizationId } = request.params as { organizationId: string }
        let { lastPostId } = request.query as { lastPostId: string }

        const listPosts = await dbPost.getFeed([], [organizationId], lastPostId, 30)

        lastPostId = listPosts.length > 0 ? listPosts[listPosts.length - 1]?.id : lastPostId || ''

        response
            .status(200)
            .setHeader('last-post-id', lastPostId || '')
            .json(listPosts)
    } catch (e) {
        next(e)
    }
}
