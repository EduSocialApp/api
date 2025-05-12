import { RoleConversationParticipantEnum } from '@prisma/client'
import { prisma } from '../../../db'

export default class ConversationParticipant {
    private prisma = prisma.conversationParticipant

    addParticipantOnConversation(conversationId: string, userId: string, organizationId?: string, role: RoleConversationParticipantEnum = 'MEMBER') {
        return this.prisma.create({
            data: {
                conversationId,
                userId,
                organizationId,
                role,
            },
        })
    }
}
