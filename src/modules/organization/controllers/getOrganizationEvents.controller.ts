import { NextFunction, Request, Response } from 'express'

import { post as dbPost } from '../../../modules/post'
import { user as dbUser } from '../../../modules/user'

export async function getOrganizationEvents(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: organizationId } = request.params as { id: string }

        const userLoggedInfos = await dbUser.findByIdDetailed(request.user.id)
        const usersId: string[] = [request.user.id]

        if (userLoggedInfos && userLoggedInfos.supervisorUsers) {
            userLoggedInfos.supervisorUsers.forEach(({ supervisedUserId }) => usersId.push(supervisedUserId))
        }

        const listPosts = await dbPost.getEvents(usersId, [organizationId])

        response.status(200).json(listPosts)
    } catch (e) {
        next(e)
    }
}
