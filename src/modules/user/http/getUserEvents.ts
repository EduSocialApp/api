import { NextFunction, Request, Response } from 'express'

import dbPost from '../../../modules/post/post.service'
import dbUser from '../user.service'
import { AppError } from '../../../functions/AppError'

export default async function getUserEvents(request: Request, response: Response, next: NextFunction) {
    dbPost.userLoggedId = request.user.id

    try {
        // Buscar organizacoes do usuario logado
        const userLoggedInfos = await dbUser.findByIdDetailed(request.user.id)
        if (!userLoggedInfos) throw new AppError('User not found', 404)

        const usersId: string[] = [request.user.id]
        const organizationsId: string[] = []

        if (userLoggedInfos.organizations) {
            userLoggedInfos.organizations.forEach(({ organization }) => organizationsId.push(organization.id))
        }

        if (userLoggedInfos.supervisorUsers) {
            userLoggedInfos.supervisorUsers.forEach(({ supervisedUserId }) => usersId.push(supervisedUserId))
        }

        const listPosts = await dbPost.getEvents(usersId, organizationsId)
        response.status(200).json(listPosts)
    } catch (e) {
        next(e)
    }
}
