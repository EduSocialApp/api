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

    checkBasicInformationsUser(name: string, displayName: string, biography: string) {
        if (!name || !displayName) {
            throw new AppError('Required fields are missing')
        }

        if (displayName.length > 20) {
            throw new AppError('Display name must have a maximum of 20 characters')
        }

        if (biography.length > 80) {
            throw new AppError('Biography must have a maximum of 80 characters')
        }
    }

    async isValid(id: string) {
        const user = await this.findById(id)
        return !!user
    }
}

export default new User()
