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
}
