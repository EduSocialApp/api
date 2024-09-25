import { AppError } from '@/functions/AppError'
import { gravatarProfilePictureUrl } from '@/functions/gravatar'
import { userScopes } from '@/modules/user/user.scopes'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'

/**
 * Cria nova organizacao
 * - Somente usuarios com a permissao `userScopes.organization.create` podem criar uma organizacao
 * - Inicialmente, todos usuarios terao a permissao para criar uma organizacao
 */
export default async function createNewOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        // Verifica se o usuário tem permissão para criar uma organização
        if (!request.user.scopes.includes(userScopes.organization.create)) {
            throw new AppError('Permission denied', 403)
        }

        let { name, email, document, phone, pictureUrl } = request.body

        if (!phone || typeof phone !== 'string') {
            phone = ''
        }

        if (typeof name !== 'string' || typeof document !== 'string' || typeof email !== 'string') {
            throw new AppError('Invalid body')
        }

        if (!pictureUrl || typeof pictureUrl !== 'string') {
            pictureUrl = gravatarProfilePictureUrl(email)
        }

        const { id, createdAt } = await organization.create({ name, email, document, pictureUrl, phone })

        // Criar vinculo entre o usuário que criou a organização e a organização
        await organizationMember.create({
            userId: request.user.id,
            organizationId: id,
            role: 'OWNER', // Define o usuário como dono da organização
            scopes: [],
        })

        response.status(201).json({
            id,
            createdAt,
        })
    } catch (e) {
        next(e)
    }
}
