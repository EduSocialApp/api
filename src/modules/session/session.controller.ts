import uuid from '@/functions/uuid'

import { prisma } from '../db'

export default class SessionController {
    private prisma = prisma.session

    async update({ id, content }: { id: string, content: string }) {
        await this.prisma.update({
            where: {
                id
            },
            data: {
                content
            }
        })
    }

    async create(userId: string, identifier: string = 'UNKNOW', ip: string = '') {
        const id = uuid()

        await this.prisma.create({
            data: {
                id,
                userId,
                content: '',
                identifier,
                ip
            }
        })

        return id
    }

    async delete(refreshToken: string) {
        await this.prisma.delete({
            where: {
                id: refreshToken
            }
        })
    }

    findById(refreshToken: string) {
        return this.prisma.findUnique({
            where: {
                id: refreshToken
            }
        })
    }
}