import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../functions/AppError'

import { organizationMember } from '../services/member/organizationMember.service'

/**
 * Aceita vinculo com a organizacao
 */
export async function approveUserLinkOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        let { organizationMemberId } = request.params // id do link de vinculo

        const member = await organizationMember.findById(organizationMemberId)

        if (!member) {
            throw new AppError('User not linked to organization', 404)
        }

        if (member.userId !== request.user.id) {
            throw new AppError('Permission denied', 403) // Não é o dono do link
        }

        if (!member.invited) {
            throw new AppError('User already linked to organization', 400)
        }

        await organizationMember.updateInvitedStatus(organizationMemberId, false)

        response.status(200).json({ message: 'User linked to organization' })
    } catch (e) {
        next(e)
    }
}
