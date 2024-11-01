import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'

/**
 * Retorna informações básicas de uma organização
 */
export default async function findOrganizationById(request: Request, response: Response, next: NextFunction) {
    try {
        const organizationData = await organization.findByIdWithAddresses(request.params.id)

        const totalMembers = await organization.getTotalMembers(request.params.id)
        const totalLikes = await organization.getTotalLikes(request.params.id)

        const organizationDataWithStats = {
            ...organizationData,
            stats: {
                members: totalMembers,
                likes: totalLikes,
                medals: 0,
            },
        }

        if (request.user.role === 'ADMIN' || request.user.role === 'MODERATOR') {
            const owners = await organization.getOwners(request.params.id)

            return response.status(200).json({ ...organizationDataWithStats, owners: owners?.members || [] })
        }

        response.status(200).json(organizationDataWithStats)
    } catch (e) {
        next(e)
    }
}
