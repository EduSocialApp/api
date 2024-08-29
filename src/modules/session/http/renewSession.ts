import { NextFunction, Request, Response } from 'express'

import { AppError } from '@/functions/AppError'

import session from '../session.service'

// precisa terminar a funcao de renovacao de token
export default async function renewToken(request: Request, response: Response, next: NextFunction) {
    try {
        const { refreshToken } = request.body

        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new AppError('Refresh token is required')
        }

        const accessToken = await session.renew(refreshToken, request.headers['user-agent'] || 'unknown')
        return response.status(200).json({ accessToken })
    } catch (e) {
        next(e)
    }
}