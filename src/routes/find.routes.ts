import { Router } from 'express'
import sort from 'lodash/sortBy'

import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'

import dbOrganizations from '../modules/organization/organization.service'
import dbUser from '../modules/user/user.service'

const findRoutes = Router()

findRoutes.get('/', ensureAuthenticated, async (request, response, next) => {
    try {
        let { query, lastUserId, lastOrgId } = request.query as { query: string; lastUserId: string; lastOrgId: string }

        const organizations = await dbOrganizations.findByQuery(query, lastOrgId)
        const users = await dbUser.findByQuery(query, lastUserId)

        lastUserId = users.length > 0 ? users[users.length - 1]?.id : lastUserId
        lastOrgId = organizations.length > 0 ? organizations[organizations.length - 1]?.id : lastOrgId

        const results: { id: string; title: string; info: string; urlPicture: string; type: string; verified: boolean }[] = [
            ...organizations.map((organization) => ({
                id: organization.id,
                title: organization.displayName,
                info: organization.biography,
                urlPicture: organization.pictureUrl,
                type: 'ORG',
                verified: organization.verified,
            })),
            ...users.map((user) => ({
                id: user.id,
                title: user.displayName,
                info: user.biography,
                urlPicture: user.pictureUrl,
                type: 'USER',
                verified: false,
            })),
        ]

        return response
            .status(200)
            .setHeader('last-user-id', lastUserId || '')
            .setHeader('last-organization-id', lastOrgId || '')
            .json(sort(results, [(result) => !result.verified, 'title'])) // Ordenar por verificados primeiro e depois por título
    } catch (e) {
        next(e)
    }
})

export { findRoutes }
