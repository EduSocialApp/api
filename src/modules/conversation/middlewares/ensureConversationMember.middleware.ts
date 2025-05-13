import { NextFunction, Request, Response } from 'express'
import { conversationParticipant } from '../services/participant/conversationParticipant.service'
import { AppError } from '../../../functions/AppError'

export async function ensureConversationMember(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id: string }

        const data = await conversationParticipant.findById(id, request.user.id)

        if (!data) {
            throw new AppError('You are not a member of this conversation', 403)
        }

        next()
    } catch (e) {
        next(e)
    }
}
