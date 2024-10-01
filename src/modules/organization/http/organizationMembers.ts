import { NextFunction, Request, Response } from 'express'

import organizationMemberService from '../member/organizationmember.service'
import { AppError } from '@/functions/AppError'

/**
 * Verifica se o usuário autenticado tem permissão para listar membros de uma organização
 */
async function hasPermissionToListOrganizationMembers(user: Request['user'], orgId: string) {
    // Se for admin ou moderador, pode listar membros de qualquer organização
    if (user.role === 'ADMIN' || user.role === 'MODERATOR') return true

    // Se for usuário comum, verifica se é membro da organização
    const orgMember = await organizationMemberService.findByUserIdAndOrganizationId(user.id, orgId)

    // Se não for membro, não pode listar membros
    if (!orgMember) return false
}

/**
 * Retorna lista de membros de uma organização
 */
export default async function organizationMembers(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params
        const skip = Number(request.headers['skip']) || 0

        // hasPermissionToLink
        if (!(await hasPermissionToListOrganizationMembers(request.user, id))) {
            throw new AppError('Permission denied', 403)
        }

        const list = await organizationMemberService.listByOrganizationId(id, 20, skip)

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
