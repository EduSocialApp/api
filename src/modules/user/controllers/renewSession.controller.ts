import { NextFunction, Request, Response } from 'express'

import { AppError } from '../../../functions/AppError'

import { session } from '../../session'

// precisa terminar a funcao de renovacao de token
export async function renewToken(request: Request, response: Response, next: NextFunction) {
    try {
        const { refreshToken, notificationToken, deviceName } = request.body

        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new AppError('Refresh token is required')
        }

        const { accessToken, expirationDate } = await session.renew(
            refreshToken,
            deviceName || request.headers['user-agent'] || 'unknown',
            (request.ip || request.headers['x-forwarded-for']) as string,
            notificationToken
        )

        return response.status(200).json({ accessToken, expirationDate })
    } catch (e) {
        next(e)
    }
}
