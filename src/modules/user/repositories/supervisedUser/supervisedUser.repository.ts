import { prisma } from '../../../../database/prisma'

export default class SupervisedUser {
    private prisma = prisma.supervisedUser

    findSupervisedUsersBySupervisorId(supervisorUserId: string) {
        return this.prisma.findMany({
            where: {
                supervisorUserId,
            },
            select: {
                supervisedUserId: true,
                updatedAt: true,
                supervisedUser: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                        biography: true,
                    },
                },
            },
        })
    }

    findSupervisedUserBySupervisorIdAndSupervisedId(supervisorUserId: string, supervisedUserId: string) {
        return this.prisma.findFirst({
            where: {
                supervisorUserId,
                supervisedUserId,
            },
            select: {
                updatedAt: true,
                supervisedUser: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                        biography: true,
                    },
                },
            },
        })
    }

    linkUserToSupervisor(supervisorUserId: string, supervisedUserId: string) {
        return this.prisma.create({
            data: {
                supervisorUserId,
                supervisedUserId,
            },
        })
    }

    findLinkUsers(userA: string, userB: string) {
        return this.prisma.findFirst({
            where: {
                OR: [
                    {
                        supervisorUserId: userA,
                        supervisedUserId: userB,
                    },
                    {
                        supervisorUserId: userB,
                        supervisedUserId: userA,
                    },
                ],
            },
            select: {
                supervisedUserId: true,
                supervisorUserId: true,
                supervisedUser: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                        biography: true,
                    },
                },
                supervisorUser: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                        biography: true,
                    },
                },
                updatedAt: true,
            },
        })
    }

    findLinksUser(userId: string) {
        return this.prisma.findMany({
            where: {
                OR: [
                    {
                        supervisorUserId: userId,
                    },
                    {
                        supervisedUserId: userId,
                    },
                ],
            },
            select: {
                supervisedUserId: true,
                supervisorUserId: true,
                supervisedUser: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                        biography: true,
                    },
                },
                supervisorUser: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                        biography: true,
                    },
                },
                updatedAt: true,
            },
        })
    }
}
