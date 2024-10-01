import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'

/**
 * Retorna informações básicas de uma organização
 */
export default async function findOrganizationById(request: Request, response: Response, next: NextFunction) {
    try {
        const organizationData = await organization.findByIdWithAddresses(request.params.id)

        response.status(200).json(organizationData)
    } catch (e) {
        next(e)
    }
}
