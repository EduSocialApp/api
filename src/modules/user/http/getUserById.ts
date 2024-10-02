import { NextFunction, Request, Response } from 'express'
import dbUser from '../user.service'
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

        // Remove informações sensíveis
        const userFiltred = omitProperties(user, ['password'])

        if (request.user.id === user.id || request.user.role === 'ADMIN' || request.user.role === 'MODERATOR') {
            return response.status(200).json(userFiltred)
        }

        response.status(200).json({
            id: userFiltred.id,
            name: userFiltred.name,
            pictureUrl: userFiltred.pictureUrl,
            organizations: userFiltred.organizations,
        })
    } catch (e) {
        next(e)
    }
}
