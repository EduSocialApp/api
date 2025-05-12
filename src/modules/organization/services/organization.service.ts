import OrganizationRepository from '../repositories/organization.repository'

import addressOrganization from '../../address/services/organization/addresOrganization.service'
import organizationMember from '../services/member/organizationMember.service'
import postService from '../post/post.service'

class Organization extends OrganizationRepository {
    async fullDelete(id: string) {
        await organizationMember.deleteAllLinksByOrganizationId(id) // deleta todos os membros da organização
        await addressOrganization.deleteAdressesOrganization(id) // deleta todos os endereços da organização
        await this.delete(id) // deleta organização
    }

    getTotalLikes(id: string) {
        return postService.countLikesByOrganizationId(id)
    }

    getTotalMembers(id: string) {
        return organizationMember.countByOrganizationId(id)
    }
}

const organization = new Organization()
export default organization
