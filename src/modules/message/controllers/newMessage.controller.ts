import { NextFunction, Request, Response } from 'express'
import { message } from '../services/message.service'
import { AppError } from '../../../functions/AppError'
import { conversation } from '../../conversation'

export async function newMessage(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: conversationId } = request.params as { id: string }
        const { text, messageClientId } = request.body as { text?: string; messageClientId?: string }

        if (!text) {
            throw new AppError('Message is required', 400)
        }

        const messageCreated = await message.new(conversationId, request.user.id, text)

        if (!messageCreated) {
            throw new AppError('Message not created', 400)
        }

        // Atualizar ultimo update da conversa
        await conversation.updateLastActivity(conversationId)

        message.notifyNewMessage(messageCreated.id, messageClientId, true)

        return response.status(201).json({
            id: messageCreated.id,
        })
    } catch (e) {
        next(e)
    }
}
