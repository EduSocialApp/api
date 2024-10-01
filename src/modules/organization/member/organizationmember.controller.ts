import uuid from '@/functions/uuid'

import { prisma } from '../../db'
import { RoleOrganizationEnum } from '@prisma/client'

export default class OrganizationMemberController {
    private prisma = prisma.organizationMember

    async create({
        organizationId,
        role = RoleOrganizationEnum.USER,
        userId,
    }: {
        userId: string
        organizationId: string
        role?: RoleOrganizationEnum
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                userId,
                organizationId,
                role,
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

    listByOrganizationId(organizationId: string, take: number = 10, skip: number = 0) {
        return this.prisma.findMany({
            where: {
                organizationId,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        pictureUrl: true,
                    },
                },
                role: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take,
            skip,
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
