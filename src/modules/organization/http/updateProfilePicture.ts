import { AppError } from '@/functions/AppError'
import { NextFunction, Request, Response } from 'express'

import organization from '../organization.service'

/**
 * Troca a foto de perfil da organização
 */
export default async function updateProfilePicture(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.file?.filename) throw new AppError('No file uploaded', 400)

        await organization.updateProfilePicture(request.params.id, request.file.filename)

        response.status(200).json({ message: 'Profile picture updated', newPictureUrl: request.file.filename })
    } catch (e) {
        next(e)
    }
}
