import { createAccessToken } from '@/functions/jwt'
import SessionController from './session.controller'
import { addDays } from '@/functions/days'
import { AppError } from '@/functions/AppError'

export class Session extends SessionController {
    private daysLimitSession = 30

    async validate(refreshToken: string): Promise<boolean> {
        const session = await super.findById(refreshToken)

        if (!session) {
            return false
        }

        const limit = addDays(session.createdAt, this.daysLimitSession)

        // Checa se a sessao expirou
        if (limit > new Date()) {
            return true // Sessao valida
        }

        // Caso tenha expirado...
        await super.delete(refreshToken) // Deleta sessao
        return false
    }

    async renew(refreshToken: string, identifier: string): Promise<string> {
        const session = await super.findById(refreshToken)

        if (!session) {
            throw new AppError('Invalid refresh token', 400)
        }

        // Calcula o limite maximo de vida da sessao
        const limit = addDays(session.createdAt, this.daysLimitSession)

        // Verifica se a sessao ja expirou ou se o identificador nao bate com quem gerou
        if (limit < new Date() || session.identifier !== identifier) {
            await super.delete(refreshToken) // Delete the session
            throw new AppError('Refresh token expired', 401)
        }

        // Cria accessToken
        const { token } = createAccessToken({
            options: {
                subject: session.userId,
                expiresIn: '1h'
            }
        })

        // Atualiza a sessao com o novo token
        await super.update({
            id: session.id,
            content: session.content
        })

        return token
    }
}

export default new Session()