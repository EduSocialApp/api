import uuid from '../../../functions/uuid'
import { prisma } from '../../../database/prisma'

export default class Conversation {
    private prisma = prisma.conversation

    new(isPrivate = false) {
        return this.prisma.create({
            data: {
                id: uuid(),
                isPrivate,
            },
        })
    }

    // Atualiza ultimo update da conversa
    updateLastActivity(conversationId: string) {
        return this.prisma.update({
            where: {
                id: conversationId,
            },
            data: {
                updatedAt: new Date(),
            },
        })
    }

    findByUserId(userId: string) {
        return this.prisma.findMany({
            where: {
                participants: {
                    some: {
                        userId,
                    },
                },
            },
            select: {
                id: true,
                isPrivate: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                unresolvedReason: true,
                messages: {
                    take: 1,
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                name: true,
                                pictureUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                participants: {
                    where: {
                        OR: [{ role: 'SENDER' }, { role: 'SENDER_RECIPIENT' }, { role: 'RECIPIENT' }],
                    },
                    select: {
                        role: true,
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                name: true,
                                pictureUrl: true,
                            },
                        },
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                pictureUrl: true,
                                verified: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
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
