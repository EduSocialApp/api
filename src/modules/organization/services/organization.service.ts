import OrganizationRepository from '../repositories/organization.repository'

import { addressOrganization } from '../../address'
import { organizationMember } from '../services/member/organizationMember.service'
import { post } from '../../post'

class Organization extends OrganizationRepository {
    async fullDelete(id: string) {
        await organizationMember.deleteAllLinksByOrganizationId(id) // deleta todos os membros da organização
        await addressOrganization.deleteAdressesOrganization(id) // deleta todos os endereços da organização
        await this.delete(id) // deleta organização
    }

    getTotalLikes(id: string) {
        return post.countLikesByOrganizationId(id)
    }

    getTotalMembers(id: string) {
        return organizationMember.countByOrganizationId(id)
    }
}

const organization = new Organization()
export { organization }
