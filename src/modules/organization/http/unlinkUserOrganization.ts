import { RoleOrganizationEnum } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

import { AppError } from '@/functions/AppError'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'

/**
 * Verifica se o usuário logado tem permissão para desvincular um membro com determinada funcao a uma organização
 */
function hasPermissionToUnlink(user: Request['user'], orgMemberRole: RoleOrganizationEnum, orgMemberLoggedRole?: RoleOrganizationEnum): boolean {
    const { role: userRole } = user

    if (orgMemberRole === 'OWNER') {
        return userRole === 'ADMIN' || userRole === 'MODERATOR'
    }

    if (orgMemberRole === 'MODERATOR') {
        return userRole === 'ADMIN' || userRole === 'MODERATOR' || orgMemberLoggedRole === 'OWNER'
    }

    if (orgMemberRole === 'USER') {
        return userRole === 'ADMIN' || userRole === 'MODERATOR' || orgMemberLoggedRole === 'OWNER' || orgMemberLoggedRole === 'MODERATOR'
    }

    return false
}

/**
 * Desvincula um usuário a uma organização
 */
export default async function unlinkUserOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: organizationId } = request.params
        const { userId } = request.body

        // Usuario logado na organizacao informada na requisicao
        const userLoggedOrgLink = await organizationMember.findByUserIdAndOrganizationId(request.user.id, organizationId)

        const orgMember = await organizationMember.findByUserIdAndOrganizationId(userId, organizationId)
        if (!orgMember) {
            throw new AppError('User is not linked to this organization', 404)
        }

        if (!hasPermissionToUnlink(request.user, orgMember.role, userLoggedOrgLink?.role)) {
            throw new AppError('Permission denied', 403)
        }

        await organizationMember.deleteLink(userId, organizationId)

        response.status(200).send({ status: 'success' })
    } catch (e) {
        next(e)
    }
}
