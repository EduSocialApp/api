import { NextFunction, Request, Response } from 'express'

import { post as dbPost } from '../services/post.service'

export async function getPostById(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        if (!id) throw new Error('Post ID not provided')

        const post = await dbPost.findById(id)

        if (!post) {
            return response.status(404).json({ message: 'Post not found' })
        }

        return response.status(200).json(post)
    } catch (e) {
        next(e)
    }
}
