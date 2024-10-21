import uuid from '../../functions/uuid'
import { prisma } from '../db'

export default class MediaController {
    private prisma = prisma.media

    create({ description = '', mediaUrl }: { description?: string; mediaUrl: string }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                description,
                mediaUrl,
            },
        })
    }
}
