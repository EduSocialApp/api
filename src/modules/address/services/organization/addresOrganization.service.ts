import AddressOrganizationRepository from '../../repositories/organization/addressOrganization.repository'

import { address } from '../address.service'

export class AddressOrganization extends AddressOrganizationRepository {
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

const addressOrganization = new AddressOrganization()
export { addressOrganization }
