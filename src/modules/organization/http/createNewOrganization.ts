import { AppError } from '@/functions/AppError'
import { gravatarProfilePictureUrl } from '@/functions/gravatar'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'
import organizationMember from '../member/organizationmember.service'
import dbAddress from '../../address/address.service'
import organizationAddress from '../../address/organization/organizationaddress.service'
import { sendNotificationToAdminsAndModerators } from '../../../functions/sendNotification'

/**
 * Cria nova organizacao
 */
export default async function createNewOrganization(request: Request, response: Response, next: NextFunction) {
    try {
        let { name, email, document, phone, pictureUrl, address, displayName, biography } = request.body as {
            name: string
            email: string
            document: string
            phone: string
            pictureUrl: string
            displayName: string
            biography: string
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

        if (!phone) {
            phone = ''
        }

        if (!biography) {
            biography = ''
        }

        if (!name || !email || !document || !displayName) {
            throw new AppError('Required fields are missing')
        }

        if (!address) {
            throw new AppError('Address is required')
        }

        if (!address.ibgeCode) {
            throw new AppError('IBGE code is required')
        }

        if (displayName.length > 20) {
            throw new AppError('Display name must have a maximum of 20 characters')
        }

        if (biography.length > 80) {
            throw new AppError('Biography must have a maximum of 80 characters')
        }

        document = document.replace(/\D/g, '') // Remove caracteres não numéricos do documento

        let org = await organization.findByDocument(document)

        if (org && !org.verified && org.rejectedVerificationMessage) {
            await organization.fullDelete(org.id) // Deletar organização caso ela tenha sido rejeitada e estiver solicitando novamente a verificação
            org = null
        }

        if (org) {
            throw new AppError('Organization already exists', 409)
        }

        if (!pictureUrl || typeof pictureUrl !== 'string') {
            pictureUrl = gravatarProfilePictureUrl(email)
        }

        const { id, createdAt } = await organization.create({ name, email, document, pictureUrl, phone, displayName, biography })

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
            invited: false,
        })

        sendNotificationToAdminsAndModerators('Nova organização criada', `A organização ${displayName} foi criada`)

        response.status(201).json({
            id,
            createdAt,
        })
    } catch (e) {
        next(e)
    }
}
