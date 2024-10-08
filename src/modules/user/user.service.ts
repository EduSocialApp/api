import { validatePasswordHash } from '@/functions/password'

import { createAccessToken } from '@/functions/jwt'
import { AppError } from '@/functions/AppError'

import session from '@/modules/session/session.service'

import UserController from './user.controller'

export class User extends UserController {
    async authenticate(email: string, password: string, identifier?: string, ip?: string, notificationToken?: string) {
        if (!password || !email) {
            throw new AppError('Email and password are required')
        }

        const user = await this.findByEmail(email)

        if (user && (await validatePasswordHash(password, user.password))) {
            const expirationDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 3) // Adiciona 3 horas a partir de agora

            const { id, token } = createAccessToken({
                options: {
                    subject: user.id,
                    expiresIn: '3h',
                },
            })

            const refreshToken = await session.create(user.id, id, identifier, ip, notificationToken)

            return {
                accessToken: token,
                refreshToken,
                expirationDate,
            }
        }

        throw new AppError('Invalid email or password', 401)
    }
}

export default new User()
