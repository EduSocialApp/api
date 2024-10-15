import { NextFunction, Request, Response } from 'express'
import dbUser from '../../user.service'
import { AppError } from '@/functions/AppError'
import omitProperties from 'lodash/omit'

/**
 * Busca usuario por id
 */
export default async function getUserById(request: Request, response: Response, next: NextFunction) {
    try {
        let { id } = request.params

        if (id === 'me') id = request.user.id

        const user = await dbUser.findByIdDetailed(id)

        if (!user) {
            throw new AppError('User not found', 404)
        }

        if (request.user.id === user.id || request.user.role === 'ADMIN' || request.user.role === 'MODERATOR') {
            const userFiltred = omitProperties(user, ['password']) // Remove informações sensíveis
            return response.status(200).json(userFiltred)
        }

        response.status(200).json({
            id: user.id,
            name: user.name,
            role: user.role,
            biography: user.biography,
            displayName: user.displayName,
            pictureUrl: user.pictureUrl,
            organizations: [],
        })
    } catch (e) {
        next(e)
    }
}
