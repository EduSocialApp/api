import uuid from '@/functions/uuid'

import { prisma } from '../../db'
import { RoleOrganizationEnum } from '@prisma/client'

export default class OrganizationMemberController {
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
            },
        })
    }

    listByOrganizationId(organizationId: string, cursor?: string, take: number = 10) {
        return this.prisma.findMany({
            where: {
                organizationId,
                invited: true,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
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
}
