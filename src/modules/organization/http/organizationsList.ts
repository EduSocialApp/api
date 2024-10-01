import { NextFunction, Request, Response } from 'express'

import organizationService from '../organization.service'

export default async function organizationsList(request: Request, response: Response, next: NextFunction) {
    try {
        const { name, email, document } = request.query as { name?: string; email?: string; document?: string }
        const skip = Number(request.headers['skip']) || 0

        const list = await organizationService.list({ skip, take: 20, name, email, document })

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
