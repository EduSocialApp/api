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
