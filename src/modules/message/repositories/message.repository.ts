import uuid from '../../../functions/uuid'
import { prisma } from '../../../database/prisma'

export default class Message {
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

    findById(id: string) {
        return this.prisma.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                conversationId: true,
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        name: true,
                        pictureUrl: true,
                    },
                },
                media: {
                    select: {
                        blurhash: true,
                        mediaUrl: true,
                    },
                },
            },
        })
    }
}
