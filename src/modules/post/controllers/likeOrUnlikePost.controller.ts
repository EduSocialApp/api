import { NextFunction, Request, Response } from 'express'

import { postLike as dbPostLike } from '../services/like/postLike.service'

/**
 * Curte ou descurte uma postagem com o usuario logado
 */
export async function likeOrUnlikePost(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        await dbPostLike.likeOrUnlike(id, request.user.id)

        response.status(200).send()
    } catch (e) {
        next(e)
    }
}
