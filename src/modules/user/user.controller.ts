import uuid from '@/functions/uuid'

import { prisma } from '../db'
import { userScopes } from './user.scopes'

export default class UserController {
    private prisma = prisma.user

    create({
        name,
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

    findByIdDetailed(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
            include: {
                organizations: {
                    where: {
                        organization: {
                            verified: true,
                        },
                    },
                    select: {
                        id: true,
                        role: true,
                        organization: {
                            select: {
                                id: true,
                                name: true,
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
}
