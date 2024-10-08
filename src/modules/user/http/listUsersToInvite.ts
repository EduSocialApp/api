import { NextFunction, Request, Response } from 'express'

import user from '../../user/user.service'

/**
 * Lista de usuários que podem ser convidados para uma organização ou para ser um supervisionado
 */
export default async function listUsersToInvite(request: Request, response: Response, next: NextFunction) {
    try {
        let { query, organizationId, lastUserId } = request.query as { query: string; organizationId: string; lastUserId: string }

        const listUsers = await user.ableToInvitedToOrganization(query, organizationId, lastUserId)

        lastUserId = listUsers.length > 0 ? listUsers[listUsers.length - 1]?.id : lastUserId

        response
            .status(200)
            .setHeader('last-user-id', lastUserId || '')
            .json(listUsers)
    } catch (e) {
        next(e)
    }
}
