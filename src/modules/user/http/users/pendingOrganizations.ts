import { NextFunction, Request, Response } from 'express'

import user from '../../user.service'

/**
 * Organizações pendentes
 */
export default async function pendingOrganizations(request: Request, response: Response, next: NextFunction) {
    try {
        const pendingOrganizationsUser = await user.pendingOrganizationInvitationsByUserId(request.user.id)

        response.status(200).json(pendingOrganizationsUser)
    } catch (e) {
        next(e)
    }
}
