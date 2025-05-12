import { prisma } from '../../../db'

export default class PostLike {
    private prisma = prisma.postLike

    create(postId: string, userId: string) {
        return this.prisma.create({
            data: {
                postId,
                userId,
            },
        })
    }

    delete(postId: string, userId: string) {
        return this.prisma.delete({
            where: {
                userId_postId: {
                    postId,
                    userId,
                },
            },
        })
    }

    getLike(postId: string, userId: string) {
        return this.prisma.findFirst({
            where: {
                postId,
                userId,
            },
            select: {
                postId: true,
                userId: true,
            },
        })
    }
}
