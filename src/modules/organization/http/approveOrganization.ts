import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'

/**
 * Aprova uma organizacao
 */
export default async function approveOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        let { id } = request.params

        await organization.setVerified(id, true)

        response.status(200).json({
            message: 'Organization approved',
        })
    } catch (e) {
        next(e)
    }
}
