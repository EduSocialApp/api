import { sendNotificationToUserId } from '../../../functions/sendNotification'
import { NextFunction, Request, Response } from 'express'
import dbUser from '../user.service'
import { AppError } from '../../../functions/AppError'

import dbSupervisedUser from '../supervised/superviseduser.service'
import dbShareLink from '../../shareLink/sharelink.service'

/**
 * Cria vinculo entre supervisor e usuário
 */
export default async function linkSupervisorToUser(request: Request, response: Response, next: NextFunction) {
    try {
        let { userId, supervisorId, sharedCode } = request.body as { userId: string; supervisorId: string; sharedCode: string }

        if (sharedCode) {
            // Busca usuario pelo codigo compartilhado
            const sharedLink = await dbShareLink.verifySharedLink(sharedCode)

            if (!sharedLink.userId) {
                throw new AppError('Invalid shared link', 400)
            }

            userId = sharedLink.userId
        } else {
            // Verifica se o usuario tem permissao para fazer vinculo com usuarios sem codigo compartilhado
            // Somente ADMIN e MODERATOR podem fazer vinculo com usuarios sem codigo compartilhado
            if (request.user.role !== 'ADMIN' && request.user.role !== 'MODERATOR') {
                throw new AppError('User not authorized', 401)
            }
        }

        if (!supervisorId) {
            // Se não for informado o supervisorId, assume que o usuario logado é o supervisor
            supervisorId = request.user.id
        } else {
            // Verifica se o usuario tem permissao para fazer vinculo entre supervisor e usuario
            // Somente ADMIN e MODERATOR podem fazer vinculo entre supervisor e usuario
            if (request.user.role !== 'ADMIN' && request.user.role !== 'MODERATOR') {
                throw new AppError('User not authorized', 401)
            }

            // Verifica se o supervisorId informado é um usuario valido
            if (!(await dbUser.isValid(supervisorId))) {
                throw new AppError('Supervisor not found', 404)
            }
        }

        // Verifica se o usuario informado é um usuario valido
        if (!(await dbUser.isValid(userId))) {
            throw new AppError('User not found', 404)
        }

        // Verifica se usuarios ja possuem vinculo
        if (await dbSupervisedUser.usersHaveLink(request.user.id, userId)) {
            throw new AppError('Users already linked', 400)
        }

        // Cria vinculo entre supervisor e usuario
        await dbSupervisedUser.linkUserToSupervisor(supervisorId, userId)

        // Notifica usuario que ele foi vinculado a um supervisor
        sendNotificationToUserId(userId, 'Vinculo com supervisor', 'Você foi vinculado a um supervisor')

        if (sharedCode) {
            // Incrementa contador de uso do codigo compartilhado
            await dbShareLink.incrementUsedCount(sharedCode)
        }

        response.status(201).send({
            message: 'User linked to supervisor',
        })
    } catch (e) {
        next(e)
    }
}
