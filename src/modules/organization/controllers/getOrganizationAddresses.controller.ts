import { NextFunction, Request, Response } from 'express'

import addressOrganization from '../../address/services/organization/addresOrganization.service'

export async function getOrganizationAddresses(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id?: string }

        if (!id) {
            throw new Error('Organization ID is required')
        }

        const addresses = await addressOrganization.findAddressesByOrganizationId(id)

        response.status(200).json(addresses.map((link) => link.address))
    } catch (e) {
        next(e)
    }
}
