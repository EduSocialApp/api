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

    setVerified(id: string, verified: boolean) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                verified,
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
}
