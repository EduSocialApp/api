import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'
import user from '../../user/user.service'
import { organizationScopes } from '../organization.scopes'

export default async function linkUserOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        // const { organizationId, userId, role } = request.body
        // const org = await organization.findById(organizationId)
        // if (!org) {
        //     throw new AppError('Organization not found', 404)
        // }
        // const orgMember = await organizationMember.findByUserIdAndOrganizationId(request.user.id, organizationId)
        // if (role === 'MODERATOR' && (request.user.role !== 'ADMIN' && request.user.role !== 'MODERATOR' || !orgMember?.scopes.includes(organizationScopes.linkModerator))) {
        //     throw new AppError('Permission denied', 403)
        // }
        // if (role === 'SUPERVISOR' && (request.user.role !== 'ADMIN' && request.user.role !== 'MODERATOR' || orgMember?.role === 'OWNER' || !orgMember?.scopes.includes(organizationScopes.linkSupervisor))) {
        //     throw new AppError('Permission denied', 403)
        // }
        // const usu = await user.findById(userId)
        // if (!usu) {
        //     throw new AppError('User not found', 404)
        // }
    } catch (e) {
        next(e)
    }
}
