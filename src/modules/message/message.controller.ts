import uuid from '../../functions/uuid'
import { prisma } from '../db'

export default class MessageController {
    private prisma = prisma.message

    new(conversationId: string, userId: string, content: string) {
        return this.prisma.create({
            data: {
                id: uuid(),
                conversationId,
                userId,
                content,
            },
        })
    }

    updateById(id: string, values: { content?: string; mediaId?: string }) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                ...values,
            },
        })
    }
}
