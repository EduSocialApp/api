import { OrganizationMember, RoleOrganizationEnum } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

import { AppError } from '@/functions/AppError'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'
import user from '../../user/user.service'

/**
 * Verifica se o usuário logado tem permissão para vincular um membro com determinada funcao a uma organização
 */
function hasPermissionToLink(user: Request['user'], role: RoleOrganizationEnum, orgMemberLoggedRole?: RoleOrganizationEnum): boolean {
    const { role: userRole } = user

    if (role === 'OWNER') {
        return userRole === 'ADMIN' || userRole === 'MODERATOR' || orgMemberLoggedRole === 'OWNER'
    }

    if (role === 'MODERATOR') {
        return userRole === 'ADMIN' || userRole === 'MODERATOR' || orgMemberLoggedRole === 'OWNER'
    }

    if (role === 'USER') {
        return userRole === 'ADMIN' || userRole === 'MODERATOR' || orgMemberLoggedRole === 'OWNER' || orgMemberLoggedRole === 'MODERATOR'
    }

    return false
}

/**
 * Vincula um usuário a uma organização
 */
export default async function linkUserOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        const { organizationId, userId, role } = request.body

        const org = await organization.findById(organizationId)
        if (!org) {
            throw new AppError('Organization not found', 404)
        }

        // Usuario logado na organizacao informada na requisicao
        const userLoggedOrgLink = await organizationMember.findByUserIdAndOrganizationId(request.user.id, organizationId)

        if (!hasPermissionToLink(request.user, role, userLoggedOrgLink?.role)) {
            throw new AppError('Permission denied', 403)
        }

        const userExists = await user.findById(userId)
        if (!userExists) {
            throw new AppError('User not found', 404)
        }

        let orgMember = await organizationMember.findByUserIdAndOrganizationId(userId, organizationId)

        if (orgMember) {
            await organizationMember.updateMemberRole(userId, organizationId, role)
        } else {
            orgMember = await organizationMember.create({ organizationId, role, userId })
        }

        response.status(201).json(orgMember)
    } catch (e) {
        next(e)
    }
}