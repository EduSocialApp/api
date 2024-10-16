import { prisma } from '../db'
import { generateRandomText } from '@/functions/generate'

export default class ShareLinkController {
    private prisma = prisma.shareLink

    createShareUserLink(userId: string, data = '') {
        return this.prisma.create({
            data: {
                id: generateRandomText(6),
                userId,
                data,
                type: 'USER',
                maxUses: 1,
            },
        })
    }

    findById(id: string) {
        return this.prisma.findUnique({
            where: { id },
        })
    }

    incrementUsedCount(id: string) {
        return this.prisma.update({
            where: { id },
            data: {
                countUsed: {
                    increment: 1,
                },
            },
        })
    }
}
