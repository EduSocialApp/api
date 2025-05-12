import uuid from '../../../functions/uuid'

import { prisma } from '../../db'

export default class Organization {
    private prisma = prisma.organization

    create({
        name,
        displayName,
        biography,
        email,
        document,
        pictureUrl,
        phone,
    }: {
        name: string
        displayName: string
        biography: string
        email: string
        document: string
        pictureUrl: string
        phone: string
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                name,
                displayName,
                biography,
                email,
                document,
                documentType: 'CNPJ',
                phone,
                pictureUrl,
                verified: false,
            },
        })
    }

    update({
        id,
        name,
        displayName,
        biography,
        email,
        document,
        pictureUrl,
        phone,
    }: {
        id: string
        displayName?: string
        biography?: string
        name?: string
        email?: string
        document?: string
        pictureUrl?: string
        phone?: string
    }) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                name,
                displayName,
                biography,
                email,
                document,
                pictureUrl,
                phone,
            },
        })
    }

    setVerified(id: string, verified: boolean, reason: string = '') {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                verified,
                rejectedVerificationMessage: reason,
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

    updateProfilePicture(id: string, url: string) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                pictureUrl: url,
            },
        })
    }

    getOwners(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
            select: {
                members: {
                    where: {
                        role: 'OWNER',
                    },
                    select: {
                        id: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                email: true,
                                pictureUrl: true,
                            },
                        },
                    },
                },
            },
        })
    }

    findByIdWithAddresses(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
            include: {
                addresses: {
                    select: {
                        address: true,
                    },
                },
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

    delete(id: string) {
        return this.prisma.delete({
            where: {
                id,
            },
        })
    }

    list({ skip = 0, take = 10, name, email }: { skip?: number; take?: number; name?: string; email?: string }) {
        return this.prisma.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: email,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                displayName: true,
                email: true,
                phone: true,
                document: true,
                pictureUrl: true,
                createdAt: true,
            },
            orderBy: [
                {
                    verified: 'desc',
                },
                {
                    name: 'asc',
                },
            ],
            skip,
            take,
        })
    }

    waitingVerification() {
        return this.prisma.findMany({
            where: {
                verified: false,
                rejectedVerificationMessage: null,
            },
            include: {
                addresses: {
                    select: {
                        address: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        role: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                document: true,
                                documentType: true,
                                emailVerified: true,
                                pictureUrl: true,
                                phone: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
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
                verified: true,
            },
            orderBy: [
                {
                    verified: 'desc',
                },
                {
                    name: 'asc',
                },
            ],
        })
    }
}
