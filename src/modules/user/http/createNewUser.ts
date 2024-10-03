import { NextFunction, Request, Response } from 'express'

import { passwordToHash } from '@/functions/password'
import { AppError } from '@/functions/AppError'
import { gravatarProfilePictureUrl } from '@/functions/gravatar'

import user from '../user.service'

/**
 * Cria novo usuario
 */
export default async function createNewUser(request: Request, response: Response, next: NextFunction) {
    try {
        let {
            name,
            displayName,
            biography,
            password,
            email,
            birthday,
            pictureUrl,
            phone,
            permissions: { connectWithNeighbors, privacyPolicy, receiveEmails, receiveNotifications, termsOfUse },
        } = request.body as {
            name: string
            displayName: string
            biography: string
            password: string
            email: string
            birthday: string
            pictureUrl: string
            phone: string
            permissions: {
                connectWithNeighbors: boolean
                privacyPolicy: boolean
                receiveEmails: boolean
                receiveNotifications: boolean
                termsOfUse: boolean
            }
        }

        if (!phone || typeof phone !== 'string') {
            phone = ''
        }

        if (!biography) {
            biography = ''
        }

        if (!name || !password || !email || !birthday || !displayName) {
            throw new AppError('Required fields are missing')
        }

        if (termsOfUse !== true) {
            throw new AppError('You must accept the terms of use')
        }

        if (privacyPolicy !== true) {
            throw new AppError('You must accept the privacy policy')
        }

        if (displayName.length > 20) {
            throw new AppError('Display name must have a maximum of 20 characters')
        }

        if (biography.length > 80) {
            throw new AppError('Biography must have a maximum of 80 characters')
        }

        if (await user.findByEmail(email)) {
            throw new AppError('Email already exists')
        }

        if (password.length < 8) {
            throw new AppError(
                'Password entered is too weak. Please choose a stronger password with at least 8 characters, including uppercase and lowercase letters, and numbers'
            )
        }

        if (!pictureUrl || typeof pictureUrl !== 'string') {
            pictureUrl = gravatarProfilePictureUrl(email)
        }

        const hashPassword = await passwordToHash(password)

        const { id, createdAt } = await user.create({
            name,
            displayName,
            biography,
            password: hashPassword,
            email,
            birthday: new Date(birthday),
            pictureUrl,
            phone,
            connectWithNeighbors,
            privacyPolicy,
            receiveEmails,
            receiveNotifications,
            termsOfUse,
        })

        response.status(201).json({
            id,
            createdAt,
        })
    } catch (e) {
        next(e)
    }
}
