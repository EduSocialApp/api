import { NextFunction, Request, Response } from 'express'

import dbPost from '@/modules/post/post.service'
import dbUser from '../../user.service'
import { AppError } from '@/functions/AppError'

/**
 * Busca feed do usuario
 * Quais postagens irao aparecer?
 * - Postagens do proprio usuario
 * - Postagens de usuarios que o usuario segue
 * - Postagens de usuarios que fazem parte da mesma organizacao
 * - Postagens de usuarios supervisionados
 */
export default async function getUserFeed(request: Request, response: Response, next: NextFunction) {
    try {
        let { lastPostId } = request.query as { lastPostId: string }

        // Buscar organizacoes do usuario logado
        const userLoggedInfos = await dbUser.findByIdDetailed(request.user.id)
        if (!userLoggedInfos) throw new AppError('User not found', 404)

        const usersId: string[] = [request.user.id]
        const organizationsId: string[] = []

        if (userLoggedInfos.organizations) {
            userLoggedInfos.organizations.forEach(({ id }) => organizationsId.push(id))
        }

        if (userLoggedInfos.supervisorUsers) {
            userLoggedInfos.supervisorUsers.forEach(({ supervisedUserId }) => usersId.push(supervisedUserId))
        }

        const listPosts = await dbPost.getFeed(usersId, organizationsId, lastPostId, 30)

        lastPostId = listPosts.length > 0 ? listPosts[listPosts.length - 1]?.id : lastPostId || ''

        response
            .status(200)
            .setHeader('last-post-id', lastPostId || '')
            .json(listPosts)
    } catch (e) {
        next(e)
    }
}
