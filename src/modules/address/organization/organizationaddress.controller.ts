import { prisma } from '../../db'

export default class OrganizationAddressController {
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
}
