import { NextFunction, Request, Response } from 'express'
import { conversation } from '../services/conversation.service'

export async function getUserConversations(request: Request, response: Response, next: NextFunction) {
    try {
        const list = await conversation.findByUserId(request.user.id)

        response.status(200).json(list || [])
        return
    } catch (e) {
        next(e)
    }
}
