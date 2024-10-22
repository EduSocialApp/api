import uuid from '../../functions/uuid'
import { prisma } from '../db'

export default class MediaController {
    private prisma = prisma.media

    create({ description = '', mediaUrl, blurhash = '' }: { description?: string; blurhash?: string; mediaUrl: string }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                description,
                mediaUrl,
                blurhash,
            },
        })
    }
}
