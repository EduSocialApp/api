import { NextFunction, Request, Response } from 'express'
import { conversation } from '../services/conversation.service'
import { AppError } from '../../../functions/AppError'

export async function ensureConversationExists(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        const data = await conversation.findById(id)

        if (!data) {
            throw new AppError('Conversation not found', 404)
        }

        next()
    } catch (e) {
        next(e)
    }
}
