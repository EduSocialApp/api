import { NextFunction, Request, Response } from 'express'

import dbPostLike from '../like/postlike.service'

/**
 * Curte ou descurte uma postagem com o usuario logado
 */
export default async function likeOrUnlikePost(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        await dbPostLike.likeOrUnlike(id, request.user.id)

        response.status(200).send()
    } catch (e) {
        next(e)
    }
}
