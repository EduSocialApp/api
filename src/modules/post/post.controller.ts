import uuid from '../../functions/uuid'
import { prisma } from '../db'

export default class PostController {
    private prisma = prisma.post

    create({ userId, organizationId, title = '', content }: { userId?: string; organizationId?: string; title?: string; content: string }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                title,
                content,
                userId,
                organizationId,
            },
        })
    }

    getFeed(usersId: string[], organizationsId: string[], cursor?: string, take: number = 10) {
        return this.prisma.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take,
            where: {
                OR: [
                    {
                        userId: {
                            in: usersId,
                        },
                    },
                    {
                        organizationId: {
                            in: organizationsId,
                        },
                    },
                ],
            },
            select: {
                id: true,
                title: true,
                content: true,
                likesCount: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
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
                medias: {
                    select: {
                        media: {
                            select: {
                                id: true,
                                mediaUrl: true,
                                description: true,
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
}
