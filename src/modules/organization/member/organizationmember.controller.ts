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
        return this.prisma.update({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
            data: {
                role,
            },
        })
    }

    deleteLink(userId: string, organizationId: string) {
        return this.prisma.delete({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        })
    }
}
