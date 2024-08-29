import { NextFunction, Request, Response } from 'express'

import { AppError } from '@/functions/AppError'

import user from '../user.service'

export default async function authenticateUser(request: Request, response: Response, next: NextFunction) {
    try {
        const { email, password } = request.body

        if (!email || !password) {
            throw new AppError('Email and password are required')
        }

        const auth = await user.authenticate(email, password, request.headers['user-agent'] || 'unknown')

        return response.status(200).json(auth)
    } catch (e) {
        next(e)
    }
}