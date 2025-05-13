import { NextFunction, Request, Response } from 'express'

import { AppError } from '../../../functions/AppError'

import { user } from '../services/user.service'

/**
 * Autentica usuario com email e senha
 */
export async function authenticateUser(request: Request, response: Response, next: NextFunction) {
    try {
        const { email, password, notificationToken, deviceName } = request.body

        if (!email || !password) {
            throw new AppError('Email and password are required')
        }

        const auth = await user.authenticate(
            email,
            password,
            deviceName || request.headers['user-agent'] || 'unknown',
            (request.ip || request.headers['x-forwarded-for']) as string,
            notificationToken
        )

        return response.status(200).json(auth)
    } catch (e) {
        next(e)
    }
}
