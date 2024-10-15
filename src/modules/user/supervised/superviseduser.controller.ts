import { prisma } from '../../db'

export default class SupervisedUserController {
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
}
