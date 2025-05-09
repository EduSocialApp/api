import { NextFunction, Request, Response } from 'express'

import dbUser from '../user.service'
import { AppError } from '../../../functions/AppError'

export default async function getLoggedContactList(request: Request, response: Response, next: NextFunction) {
    try {
        const list = await dbUser.contactList(request.user.id)

        if (!list) {
            throw new AppError('User not found', 404)
        }

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
