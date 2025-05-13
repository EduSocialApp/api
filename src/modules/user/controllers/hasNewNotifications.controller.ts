import { NextFunction, Request, Response } from 'express'

import { user } from '../services/user.service'

/**
 * Notificações do usuario
 */
export async function hasNewNotifications(request: Request, response: Response, next: NextFunction) {
    try {
        const pendingOrganizationsUser = await user.pendingOrganizationInvitationsByUserId(request.user.id)

        const pendingOrganizations = pendingOrganizationsUser?.organizations.length || 0

        const total = pendingOrganizations

        response.status(200).json({ total, pendingOrganizations })
    } catch (e) {
        next(e)
    }
}
