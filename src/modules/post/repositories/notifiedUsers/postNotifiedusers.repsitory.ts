import { prisma } from '../../../db'

export default class PostNotifiedUsers {
    private prisma = prisma.postNotifiedUsers

    addUser(postId: string, userId: string) {
        return this.prisma.create({
            data: {
                postId,
                userId,
            },
        })
    }

    removeUser(postId: string, userId: string) {
        return this.prisma.delete({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        })
    }

    getUsers(postId: string) {
        return this.prisma.findMany({
            where: {
                postId,
            },
        })
    }

    addUserList(postId: string, userIds: string[]) {
        return this.prisma.createMany({
            data: userIds.map((userId) => ({
                postId,
                userId,
            })),
        })
    }

    removeUsersFromPost(postId: string) {
        return this.prisma.deleteMany({
            where: {
                postId,
            },
        })
    }
}
