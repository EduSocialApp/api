import OrganizationAddressController from './organizationaddress.controller'

import address from '../address.service'

export class OrganizationAddress extends OrganizationAddressController {
    /**
     * Delete um endereço de uma organização
     */
    async deleteAddressOrganization(organizationId: string, addressId: string) {
        await this.unlink(organizationId, addressId)
        await address.delete(addressId)
    }

    /**
     * Deleta todos os endereços de uma organização
     */
    async deleteAdressesOrganization(organizationId: string) {
        const addresses = await this.findAddressesByOrganizationId(organizationId)

        for (const address of addresses) {
            await this.deleteAddressOrganization(organizationId, address.addressId)
        }
    }
}

export default new OrganizationAddress()
