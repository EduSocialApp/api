import { AppError } from '../../functions/AppError'
import { NextFunction, Request, Response } from 'express'

import dbPost from '../../modules/post/post.service'

/**
 * Middleware para garantir que o post informado via parametro existe
 */
export async function ensurePostExists(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const post = await dbPost.findById(id)

        if (!post) {
            throw new AppError('Post not found', 404)
        }

        next()
    } catch (e) {
        next(e)
    }
}
