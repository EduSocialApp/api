import { NextFunction, Request, Response } from 'express'

import { organization } from '../services/organization.service'

/**
 * Aprova uma organizacao
 */
export async function approveOrganization(request: Request, response: Response, next: NextFunction) {
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
