import { NextFunction, Request, Response } from 'express'
import dbUser from '../user.service'
import { AppError } from '@/functions/AppError'

/**
 * Busca usuario por id
 */
export default async function getUserById(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params

        const user = await dbUser.findByIdDetailed(id)

        if (!user) {
            throw new AppError('User not found', 404)
        }

        const { name, email, pictureUrl, phone, organizations } = user

        response.status(200).json({ name, email, pictureUrl, phone, id, organizations })
    } catch (e) {
        next(e)
    }
}
