import { NextFunction, Request, Response } from 'express'
import dbUser from '../user.service'
import { AppError } from '../../../functions/AppError'

/**
 * Atualiza a foto de perfil do usuário logado
 */
export default async function profilePicture(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params as { id?: string }

        if (!request.file?.filename) throw new AppError('No file uploaded', 400)

        await dbUser.updateProfilePictureUrl(id || request.user.id, request.file.filename)

        response.status(200).json({ message: 'Profile picture updated', newPictureUrl: request.file.filename })
    } catch (e) {
        next(e)
    }
}
