import { NextFunction, Request, Response } from 'express'
import { message } from '../services/message.service'
import { AppError } from '../../../functions/AppError'

export async function newMessage(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: conversationId } = request.params as { id: string }
        const { text } = request.body as { text?: string }

        if (!text) {
            throw new AppError('Message is required', 400)
        }

        const messageCreated = await message.new(conversationId, request.user.id, text)

        if (!messageCreated) {
            throw new AppError('Message not created', 400)
        }

        return response.status(201).json({
            id: messageCreated.id,
        })
    } catch (e) {
        next(e)
    }
}
