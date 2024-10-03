import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'

/**
 * Retorna informações básicas de uma organização
 */
export default async function findOrganizationById(request: Request, response: Response, next: NextFunction) {
    try {
        const organizationData = await organization.findByIdWithAddresses(request.params.id)

        if (request.user.role === 'ADMIN' || request.user.role === 'MODERATOR') {
            const owners = await organization.getOwners(request.params.id)

            return response.status(200).json({ ...organizationData, owners: owners?.members || [] })
        }

        response.status(200).json(organizationData)
    } catch (e) {
        next(e)
    }
}
