import { NextFunction, Request, Response } from 'express'

import { passwordToHash } from '@/functions/password'
import { AppError } from '@/functions/AppError'
import { gravatarProfilePictureUrl } from '@/functions/gravatar'

import user from '../user.service'

export default async function createNewUser(request: Request, response: Response, next: NextFunction) {
    try {
        let { name, password, email, birthday, pictureUrl, phone } = request.body

        if (!phone || typeof phone !== 'string') {
            phone = ''
        }

        if (typeof name !== 'string' || typeof password !== 'string' || typeof email !== 'string' || typeof birthday !== 'string') {
            throw new AppError('Invalid body')
        }

        if (!name || !password || !email || !birthday) {
            throw new AppError('Required fields are missing')
        }

        if (await user.findByEmail(email)) {
            throw new AppError('Email already exists')
        }

        if (password.length < 8) {
            throw new AppError('Password entered is too weak. Please choose a stronger password with at least 8 characters, including uppercase and lowercase letters, and numbers')
        }

        if (!pictureUrl || typeof pictureUrl !== 'string') {
            pictureUrl = gravatarProfilePictureUrl(email)
        }

        const hashPassword = await passwordToHash(password)

        const { id, createdAt } = await user.create({
            name,
            password: hashPassword,
            email,
            birthday: new Date(birthday),
            pictureUrl,
            phone
        })

        response.status(201).json({
            id,
            createdAt
        })
    } catch (e) {
        next(e)
    }
}