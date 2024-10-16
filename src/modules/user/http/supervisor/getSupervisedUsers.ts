import { NextFunction, Request, Response } from 'express'

import dbSupervisedUser from '../../supervised/superviseduser.service'

/**
 * Busca usuarios supervisionados pelo supervisor
 */
export default async function getSupervisedUsers(request: Request, response: Response, next: NextFunction) {
    try {
        const supervisedUsers = await dbSupervisedUser.findSupervisedUsersBySupervisorId(request.user.id)

        response.status(200).send(supervisedUsers)
    } catch (e) {
        next(e)
    }
}
