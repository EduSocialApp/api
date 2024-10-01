import { AppError } from '@/functions/AppError'
import { gravatarProfilePictureUrl } from '@/functions/gravatar'
import { userScopes } from '@/modules/user/user.scopes'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'
import dbAddress from '../../address/address.service'
import organizationAddress from '../../address/organization/organizationaddress.service'

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

        let { name, email, document, phone, pictureUrl, address } = request.body as {
            name: string
            email: string
            document: string
            phone: string
            pictureUrl: string
            address: {
                street: string
                number: string
                neighborhood: string
                city: string
                state: string
                country: string
                zipCode: string
                ibgeCode: string
                complement: string
            }
        }

        if (!phone || typeof phone !== 'string') {
            phone = ''
        }

        if (typeof name !== 'string' || typeof document !== 'string' || typeof email !== 'string') {
            throw new AppError('Invalid body')
        }

        if (!address) {
            throw new AppError('Address is required')
        }

        if (!address.ibgeCode) {
            throw new AppError('IBGE code is required')
        }

        if (!pictureUrl || typeof pictureUrl !== 'string') {
            pictureUrl = gravatarProfilePictureUrl(email)
        }

        const { id, createdAt } = await organization.create({ name, email, document, pictureUrl, phone })

        // Criar endereço
        const { id: addressId } = await dbAddress.create(address)

        if (!addressId) {
            organization.delete(id) // Deletar organização criada caso ocorra erro ao criar o endereço
            throw new AppError('Error creating address')
        }

        // Criar vinculo entre a organização e o endereço
        await organizationAddress.link(id, addressId)

        // Criar vinculo entre o usuário que criou a organização e a organização
        await organizationMember.create({
            userId: request.user.id,
            organizationId: id,
            role: 'OWNER', // Define o usuário como dono da organização
        })

        response.status(201).json({
            id,
            createdAt,
        })
    } catch (e) {
        next(e)
    }
}
