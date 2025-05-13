import { RoleConversationParticipantEnum } from '@prisma/client'
import { prisma } from '../../../../database/prisma'

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
