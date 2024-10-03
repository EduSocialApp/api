import uuid from '@/functions/uuid'

import { prisma } from '../db'

export default class OrganizationController {
    private prisma = prisma.organization

    create({ name, email, document, pictureUrl, phone }: { name: string; email: string; document: string; pictureUrl: string; phone: string }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                name,
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
        email,
        document,
        pictureUrl,
        phone,
    }: {
        id: string
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

    list({ skip = 0, take = 10, name, email, document }: { skip?: number; take?: number; name?: string; email?: string; document?: string }) {
        return this.prisma.findMany({
            where: {
                verified: true,
                name: {
                    contains: name,
                },
                email: {
                    contains: email,
                },
                document: {
                    contains: document,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                document: true,
                pictureUrl: true,
                createdAt: true,
            },
            orderBy: {
                name: 'asc',
            },
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
}
