import { validatePasswordHash } from '@/functions/password'

import { createAccessToken } from '@/functions/jwt'
import { AppError } from '@/functions/AppError'

import session from '@/modules/session/session.service'

import UserController from './user.controller'

export class User extends UserController {

    async authenticate(email: string, password: string, identifier?: string): Promise<{ accessToken: string, refreshToken: string }> {
        if (!password || !email) {
            throw new AppError('Email and password are required')
        }

        const user = await this.findByEmail(email)

        if (user && await validatePasswordHash(password, user.password)) {
            const { id, token } = createAccessToken({
                options: {
                    subject: user.id,
                    expiresIn: '1h'
                }
            })

            const refreshToken = await session.create(user.id, identifier)

            return {
                accessToken: token,
                refreshToken
            }
        }

        throw new AppError('Invalid email or password', 401)
    }
}

export default new User()