import uuid from 'src/functions/uuid'
import { prisma } from '../db'

export default class ConversationController {
    private prisma = prisma.conversation

    new(isPrivate = false) {
        return this.prisma.create({
            data: {
                id: uuid(),
                isPrivate,
            },
        })
    }

    findById(id: string, withMessages = false, withParticipants = false) {
        return this.prisma.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                isPrivate: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                messages: withMessages && {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                pictureUrl: true,
                                name: true,
                            },
                        },
                        media: {
                            select: {
                                blurhash: true,
                                mediaUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                participants: withParticipants && {
                    select: {
                        role: true,
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                pictureUrl: true,
                                name: true,
                            },
                        },
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                pictureUrl: true,
                                verified: true,
                            },
                        },
                    },
                },
            },
        })
    }
}
