import uuid from '@/functions/uuid'

import { prisma } from '../db'
import { userScopes } from './user.scopes'

export default class UserController {
    private prisma = prisma.user

    create({
        name,
        displayName,
        biography,
        email,
        password,
        pictureUrl,
        phone,
        birthday,
        connectWithNeighbors,
        privacyPolicy,
        receiveEmails,
        receiveNotifications,
        termsOfUse,
    }: {
        name: string
        displayName: string
        biography: string
        email: string
        password: string
        pictureUrl: string
        phone: string
        birthday: Date
        connectWithNeighbors?: boolean
        privacyPolicy?: boolean
        receiveEmails?: boolean
        receiveNotifications?: boolean
        termsOfUse?: boolean
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                name,
                displayName,
                biography,
                email,
                password,
                document: '',
                documentType: 'UNKNOW',
                pictureUrl,
                phone,
                birthday,
                role: 'USER',
                connectWithNeighbors,
                privacyAccepted: privacyPolicy,
                receiveEmails,
                receiveNotifications,
                termsAccepted: termsOfUse,
                scopes: [userScopes.organization.create],
            },
        })
    }

    pendingOrganizationInvitationsByUserId(userId: string) {
        return this.prisma.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                organizations: {
                    where: {
                        invited: true,
                    },
                    select: {
                        id: true,
                        role: true,
                        organization: {
                            select: {
                                id: true,
                                displayName: true,
                                verified: true,
                                pictureUrl: true,
                                name: true,
                                biography: true,
                            },
                        },
                    },
                    orderBy: {
                        updatedAt: 'desc',
                    },
                },
            },
        })
    }

    ableToInvitedToOrganization(query: string, organizationId: string = '', cursor?: string, take: number = 10) {
        return this.prisma.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take,
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        displayName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                displayName: true,
                pictureUrl: true,
                biography: true,
                organizations: {
                    where: {
                        organizationId,
                    },
                    select: {
                        id: true,
                        role: true,
                        invited: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })
    }

    updateProfilePictureUrl(id: string, pictureUrl: string) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                pictureUrl,
            },
        })
    }

    updateBasicInformations(id: string, { name, biography, displayName }: { name: string; displayName: string; biography: string }) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                name,
                biography,
                displayName,
            },
        })
    }

    findByIdDetailed(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
            include: {
                organizations: {
                    select: {
                        id: true,
                        role: true,
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                pictureUrl: true,
                            },
                        },
                    },
                },
                supervisedUsers: {
                    select: {
                        supervisorUserId: true,
                        updatedAt: true,
                        supervisorUser: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                pictureUrl: true,
                                biography: true,
                            },
                        },
                    },
                },
                supervisorUsers: {
                    select: {
                        supervisedUserId: true,
                        updatedAt: true,
                        supervisedUser: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                pictureUrl: true,
                                biography: true,
                            },
                        },
                    },
                },
            },
        })
    }

    findById(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
        })
    }

    findSessionByUserId(id: string) {
        return this.prisma.findFirst({
            where: {
                id,
            },
            select: {
                sessions: true,
            },
        })
    }

    findByEmail(email: string) {
        return this.prisma.findUnique({
            where: {
                email,
            },
        })
    }

    findByDocument(document: string) {
        return this.prisma.findFirst({
            where: {
                document,
            },
        })
    }

    findByEmailAndPassword(email: string, password: string) {
        return this.prisma.findFirst({
            where: {
                email,
                password,
            },
        })
    }

    findNotificationTokenAdmins() {
        return this.prisma.findMany({
            where: {
                role: 'ADMIN',
                receiveNotifications: true,
            },
            select: {
                id: true,
                displayName: true,
                sessions: {
                    select: {
                        notificationToken: true,
                    },
                },
            },
        })
    }

    findNotificationTokenAdminsAndModerators() {
        return this.prisma.findMany({
            where: {
                OR: [
                    {
                        role: 'ADMIN',
                    },
                    {
                        role: 'MODERATOR',
                    },
                ],
                receiveNotifications: true,
            },
            select: {
                id: true,
                displayName: true,
                sessions: {
                    select: {
                        notificationToken: true,
                    },
                },
            },
        })
    }

    findNotificationTokenModerators() {
        return this.prisma.findMany({
            where: {
                role: 'MODERATOR',
                receiveNotifications: true,
            },
            select: {
                id: true,
                displayName: true,
                sessions: {
                    select: {
                        notificationToken: true,
                    },
                },
            },
        })
    }

    findNotificationTokenAll() {
        return this.prisma.findMany({
            where: {
                receiveNotifications: true,
            },
            select: {
                id: true,
                displayName: true,
                sessions: {
                    select: {
                        notificationToken: true,
                    },
                },
            },
        })
    }

    findByQuery(query: string, cursor?: string, take: number = 10) {
        return this.prisma.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            take,
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        displayName: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                displayName: true,
                pictureUrl: true,
                biography: true,
            },
            orderBy: {
                name: 'asc',
            },
        })
    }
}
