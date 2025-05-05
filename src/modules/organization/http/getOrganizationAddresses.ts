import { NextFunction, Request, Response } from 'express'
import organizationaddressService from '../../address/organization/organizationaddress.service'

export default async function getOrganizationAddresses(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id?: string }

        if (!id) {
            throw new Error('Organization ID is required')
        }

        const addresses = await organizationaddressService.findAddressesByOrganizationId(id)

        response.status(200).json(addresses.map((link) => link.address))
    } catch (e) {
        next(e)
    }
}
