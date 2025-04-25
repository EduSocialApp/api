import { PostLevelEnum } from '@prisma/client'
import uuid from '../../functions/uuid'
import { prisma } from '../db'

export default class PostController {
    private prisma = prisma.post
    userLoggedId: string | undefined = undefined

    parsePostLevel(level: string): PostLevelEnum {
        switch (level) {
            case 'URGENT':
                return PostLevelEnum.URGENT
            case 'IMPORTANT':
                return PostLevelEnum.IMPORTANT
            case 'NORMAL':
                return PostLevelEnum.NORMAL
            default:
                return PostLevelEnum.NORMAL
        }
    }

    create({
        userId,
        organizationId,
        title = '',
        content,
        startDate,
        endDate,
        level = PostLevelEnum.NORMAL,
    }: {
        userId?: string
        organizationId?: string
        title?: string
        content: string
        startDate?: Date
        endDate?: Date
        level?: PostLevelEnum
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                title,
                content,
                userId,
                organizationId,
                startDate,
                endDate,
                level,
            },
        })
    }

    updateLikesCounterByPostId(id: string, likesCount: number) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                likesCount,
            },
        })
    }

    incrementLikesCounterByPostId(id: string, increment: number = 1) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                likesCount: {
                    increment,
                },
            },
        })
    }

    decrementLikesCounterByPostId(id: string, decrement: number = 1) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                likesCount: {
                    decrement,
                },
            },
        })
    }

    findById(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                likesCount: true,
                updatedAt: true,
                createdAt: true,
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
                                blurhash: true,
                            },
                        },
                    },
                },
                likes: this.userLoggedId // Se o usuario estiver logado, verifica se ele curtiu a postagem
                    ? {
                          where: {
                              userId: this.userLoggedId,
                          },
                      }
                    : undefined,
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
                createdAt: true,
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
                                blurhash: true,
                            },
                        },
                    },
                },
                likes: this.userLoggedId // Se o usuario estiver logado, verifica se ele curtiu a postagem
                    ? {
                          where: {
                              userId: this.userLoggedId,
                          },
                          select: {
                              userId: true,
                              postId: true,
                              updatedAt: true,
                          },
                      }
                    : undefined,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })
    }

    async countLikesByOrganizationId(organizationId: string) {
        const result = await this.prisma.aggregate({
            _sum: {
                likesCount: true,
            },
            where: {
                organizationId,
            },
        })

        return result._sum.likesCount || 0
    }
}
