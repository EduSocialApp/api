import { prisma } from '../../../../database/prisma'

export default class AddressOrganization {
    private prisma = prisma.organizationAddress

    link(organizationId: string, addressId: string) {
        return this.prisma.create({
            data: {
                organizationId,
                addressId,
            },
        })
    }

    unlink(organizationId: string, addressId: string) {
        return this.prisma.delete({
            where: {
                organizationId_addressId: {
                    organizationId,
                    addressId,
                },
            },
        })
    }

    findAddressesByOrganizationId(organizationId: string) {
        return this.prisma.findMany({
            where: {
                organizationId,
            },
            include: {
                address: true,
            },
        })
    }

    async isAddressInOrganization(organizationId: string, addressId: string) {
        const addressLink = await this.prisma.findFirst({
            where: {
                organizationId,
                addressId,
            },
        })

        return !!addressLink
    }
}
