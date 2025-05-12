import uuid from '../../../../functions/uuid'

import { prisma } from '../../../db'
import { RoleOrganizationEnum } from '@prisma/client'

export default class OrganizationMember {
    private prisma = prisma.organizationMember

    async create({
        organizationId,
        role = RoleOrganizationEnum.USER,
        userId,
        invited = true,
    }: {
        userId: string
        organizationId: string
        role?: RoleOrganizationEnum
        invited?: boolean
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                userId,
                organizationId,
                role,
                invited,
            },
        })
    }

    updateInvitedStatus(id: string, invited: boolean) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                invited,
            },
        })
    }

    findById(id: string) {
        return this.prisma.findUnique({
            where: {
                id,
            },
        })
    }

    findByUserIdAndOrganizationId(userId: string, organizationId: string) {
        return this.prisma.findFirst({
            where: {
                userId,
                organizationId,
            },
        })
    }

    updateMemberRole(userId: string, organizationId: string, role: RoleOrganizationEnum) {
        return this.prisma.updateMany({
            where: {
                userId,
                organizationId,
            },
            data: {
                role,
            },
        })
    }

    countByOrganizationId(organizationId: string) {
        return this.prisma.count({
            where: {
                organizationId,
                invited: false,
            },
        })
    }

    listByOrganizationId(organizationId: string, cursor?: string, take: number = 10) {
        return this.prisma.findMany({
            where: {
                organizationId,
                invited: false,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        pictureUrl: true,
                    },
                },
                id: true,
                role: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
        })
    }

    listByUserId(userId: string) {
        return this.prisma.findMany({
            where: {
                userId,
            },
            select: {
                organization: true,
                createdAt: true,
                role: true,
                id: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    deleteLink(userId: string, organizationId: string) {
        return this.prisma.deleteMany({
            where: {
                userId,
                organizationId,
            },
        })
    }

    deleteAllLinksByOrganizationId(organizationId: string) {
        return this.prisma.deleteMany({
            where: {
                organizationId,
            },
        })
    }

    async usersBelongToOrganization(organizationId: string, userIds: string[]) {
        // Retorne somente o id dos usuarios que pertencem a organizacao
        const usersFiltered = await this.prisma.findMany({
            where: {
                organizationId,
                userId: {
                    in: userIds,
                },
            },
            select: {
                userId: true,
            },
        })

        return usersFiltered.map((user) => user.userId)
    }
}
