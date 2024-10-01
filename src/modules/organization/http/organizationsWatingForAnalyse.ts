import { NextFunction, Request, Response } from 'express'

import organizationService from '../organization.service'

export default async function organizationsWaitingForAnalysis(request: Request, response: Response, next: NextFunction) {
    try {
        const list = await organizationService.waitingVerification()

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
