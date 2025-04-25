import { AppError } from '../../../functions/AppError'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'

/**
 * Rejeita uma organizacao
 */
export default async function rejectOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        let { id } = request.params
        const { reason } = request.body as { reason: string }

        if (!reason) {
            throw new AppError('Reason is required', 400)
        }

        await organization.setVerified(id, false, reason)

        response.status(200).json({
            message: 'Organization rejetected',
        })
    } catch (e) {
        next(e)
    }
}
