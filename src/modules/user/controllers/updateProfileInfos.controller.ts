import { NextFunction, Request, Response } from 'express'

import { user } from '../services/user.service'

/**
 * Altera informações do perfil do usuário
 */
export async function updateProfileInformations(request: Request, response: Response, next: NextFunction) {
    try {
        let { id } = request.params as { id: string }
        let { name, displayName, biography } = request.body as { name: string; displayName: string; biography: string }

        user.checkBasicInformationsUser(name || '', displayName || '', biography || '')

        if (!biography) {
            biography = ''
        }

        await user.updateBasicInformations(id || request.user.id, {
            name,
            displayName,
            biography,
        })

        response.status(204).send()
    } catch (e) {
        next(e)
    }
}
