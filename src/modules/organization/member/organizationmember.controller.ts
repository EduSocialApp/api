import uuid from '@/functions/uuid'

import { prisma } from '../../db'
import { RoleOrganizationEnum } from '@prisma/client'

export default class OrganizationMemberController {
    private prisma = prisma.organizationMembers

    async create({
        organizationId,
        role = RoleOrganizationEnum.USER,
        scopes,
        userId,
    }: {
        userId: string
        organizationId: string
        scopes: string[]
        role?: RoleOrganizationEnum
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                userId,
                organizationId,
                role,
                scopes,
            },
        })
    }

    updateScopes(id: string, scopes: string[]) {
        return this.prisma.update({
            where: {
                id,
            },
            data: {
                scopes,
            },
        })
    }

    deleteLink(id: string) {
        return this.prisma.delete({
            where: {
                id,
            },
        })
    }
}
