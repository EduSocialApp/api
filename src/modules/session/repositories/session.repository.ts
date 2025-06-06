import uuid from '../../../functions/uuid'

import { prisma } from '../../../database/prisma'

export default class Session {
    private prisma = prisma.session

    async update({
        id,
        content,
        ip,
        accessTokenHash,
        identifier,
        notificationToken,
    }: {
        id: string
        content: string
        ip: string
        accessTokenHash: string
        identifier: string
        notificationToken: string
    }) {
        await this.prisma.update({
            where: {
                id,
            },
            data: {
                content,
                ip,
                accessTokenHash,
                identifier,
                notificationToken,
            },
        })
    }

    async create(userId: string, accessTokenHash = '', identifier: string = 'UNKNOW', ip: string = '', notificationToken = '') {
        const id = uuid()

        await this.prisma.create({
            data: {
                id,
                accessTokenHash,
                userId,
                content: '',
                identifier,
                notificationToken,
                ip,
            },
        })

        return id
    }

    async delete(refreshToken: string) {
        await this.prisma.delete({
            where: {
                id: refreshToken,
            },
        })
    }

    findById(refreshToken: string) {
        return this.prisma.findUnique({
            where: {
                id: refreshToken,
            },
        })
    }

    findByAccessTokenHash(accessTokenHash: string) {
        return this.prisma.findFirst({
            where: {
                accessTokenHash,
            },
        })
    }
}
