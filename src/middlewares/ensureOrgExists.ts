import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

import organization from '../modules/organization/organization.service'

/**
 * Middleware para garantir que a organização informada via parametro existe
 */
export async function ensureOrgExists(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const org = await organization.findById(id)

        if (!org) {
            throw new AppError('Organization not found', 404)
        }

        next()
    } catch (e) {
        next(e)
    }
}
