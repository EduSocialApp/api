import { NextFunction, Request, Response } from 'express'

import { conversation as dbConversation } from '../services/conversation.service'
import { AppError } from '../../../functions/AppError'

export async function getConversation(request: Request, response: Response, next: NextFunction) {
    try {
        const { conversationId } = request.params as {
            conversationId: string
        }

        const { withMessages, withParticipants } = request.query as {
            withMessages?: string
            withParticipants?: string
        }

        if (!conversationId) {
            throw new AppError('Conversation ID is required')
        }

        const conversation = await dbConversation.findById(conversationId, withMessages === 'true', withParticipants === 'true')

        if (!conversation) {
            throw new AppError('Conversation not found', 404)
        }

        return response.status(200).json(conversation)
    } catch (e) {
        next(e)
    }
}
