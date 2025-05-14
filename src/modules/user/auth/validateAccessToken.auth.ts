import { AppError } from '../../../functions/AppError'
import { verifyAcessToken } from '../../../functions/jwt'
import { session as dbSession } from '../../session'
import { user as dbUser } from '../services/user.service'

interface Payload {
    sub: string
    jti: string
}

/**
 * Valida accesstoken
 */
export async function validateAccessToken(accessToken: string = '') {
    if (accessToken.toLowerCase().startsWith('bearer')) {
        accessToken = accessToken.slice(6).trim()
    }

    if (!accessToken) {
        throw new AppError('Token missing', 401)
    }

    // Verificar se o token é valido e recupera informacoes do payload
    const { sub: userId, jti } = verifyAcessToken(accessToken) as Payload

    // Verificar se existe uma sessao ativa para este token
    const session = await dbSession.findByAccessTokenHash(jti)
    if (!session) throw new AppError('Invalid token', 401)

    const user = await dbUser.findByIdDetailed(userId)

    if (!user) {
        throw new AppError('User not found', 401)
    }

    return {
        id: userId, // ID do usuario
        scopes: user.scopes, // Escopos do usuario
        role: user.role, // Nivel do usuario
        sessionId: session.id, // ID da sessao autenticada
        notificationToken: user.receiveNotifications ? session.notificationToken : null, // Token de notificacao
        supervisedUsers: user.supervisorUsers.map(({ supervisedUserId }) => supervisedUserId), // Usuarios supervisionados
        supervisorUsers: user.supervisedUsers.map(({ supervisorUserId }) => supervisorUserId), // Usuarios supervisores
        organizations: user.organizations.map(({ role, organization }) => ({ role, id: organization.id })), // Organizacoes que o usuario pertence
    }
}
