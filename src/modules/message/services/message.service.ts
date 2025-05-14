import { conversationParticipant } from '../../conversation'
import MessageRepository from '../repositories/message.repository'
import { getSocketIdsFromUserIds } from '../../../server/socket/socketConnections'
import { getSocket } from '../../../server/socket'

class Message extends MessageRepository {
    async notifyNewMessage(messageId: string, messageClientId: string = '', socket: boolean = false, push = false) {
        if (!socket && !push) return

        // Primeiro busca corpo da mensagem (como deve aparecer no app)
        const message = await this.findById(messageId)

        if (!messageId || !message?.conversationId) return

        // Busca por todos participantes da conversa
        const participantsId = await conversationParticipant.findUserIdsByConversationId(message?.conversationId)

        if (socket) {
            // Se algum participante estiver conectado, manda notificacao via socket
            const socketsIds = getSocketIdsFromUserIds(participantsId)

            if (socketsIds.length > 0)
                getSocket()
                    .to(socketsIds)
                    .emit('newMessage', { ...message, messageClientId })
        }
    }
}

const message = new Message()
export { message }
