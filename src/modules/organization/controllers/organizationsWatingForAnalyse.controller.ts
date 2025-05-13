import { NextFunction, Request, Response } from 'express'

import { organization } from '../services/organization.service'

/**
 * Retorna lista de organizações aguardando análise
 */
export async function organizationsWaitingForAnalysis(request: Request, response: Response, next: NextFunction) {
    try {
        const list = await organization.waitingVerification()

        response.status(200).json(list)
    } catch (e) {
        next(e)
    }
}
