import { NextFunction, Request, Response } from 'express'

import dbConversation from '../services/conversation.service'
import dbConversationParticipant from '../services/participant/conversationparticipant.service'
import dbMessage from '../../message/message.service'
import dbOrganization from '../../organization/organization.service'
import { AppError } from '../../../functions/AppError'
import { RoleConversationParticipantEnum } from '@prisma/client'

export default async function startConversation(request: Request, response: Response, next: NextFunction) {
    try {
        let { content, toUserId, toOrganizationId, fromOrganizationId } = request.body as {
            content?: string
            toUserId?: string
            toOrganizationId?: string
            fromOrganizationId?: string
        }

        let isConversationPrivate = false
        let senderRole: RoleConversationParticipantEnum = 'SENDER'

        if (!content) {
            throw new AppError('Content is required')
        }

        if (!toUserId && !toOrganizationId) {
            throw new AppError('Message recipient is not defined')
        }

        // Se não foi destinado a um usuário, mas sim para uma organização
        if (!toUserId && toOrganizationId) {
            // Busca o responsável pela organização
            const org = await dbOrganization.getOwners(toOrganizationId)
            if (org?.members.length === 0) {
                throw new AppError('Organization has no responsible')
            }

            toUserId = org?.members[0].user.id // Pega o primeiro responsável

            if (request.user.id === toUserId) {
                fromOrganizationId = toOrganizationId // responsavel pela organização mandando mensagem para ele mesmo
                senderRole = 'SENDER_RECIPIENT'
            }
        }

        if (!toUserId) {
            throw new AppError('Message recipient is not defined')
        }

        // Primeiro cria uma nova conversa
        const newConversation = await dbConversation.new(isConversationPrivate)

        // Adiciona os participantes na conversa
        await dbConversationParticipant.addParticipantOnConversation(newConversation.id, request.user.id, fromOrganizationId, senderRole) // Quem iniciou a conversa

        if (request.user.id !== toUserId) {
            await dbConversationParticipant.addParticipantOnConversation(newConversation.id, toUserId, toOrganizationId, 'RECIPIENT') // Para quem foi a conversa
        }

        // Cria uma mensagem inicial
        await dbMessage.new(newConversation.id, request.user.id, content)

        return response.status(200).json({
            conversationId: newConversation.id,
        })
    } catch (e) {
        next(e)
    }
}
