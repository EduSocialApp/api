import OrganizationController from './organization.controller'

import organizationAdress from '../address/organization/organizationaddress.service'
import organizationMember from './member/organizationmember.service'
import postService from '../post/post.service'

export class Organization extends OrganizationController {
    async fullDelete(id: string) {
        await organizationMember.deleteAllLinksByOrganizationId(id) // deleta todos os membros da organização
        await organizationAdress.deleteAdressesOrganization(id) // deleta todos os endereços da organização
        await this.delete(id) // deleta organização
    }

    getTotalLikes(id: string) {
        return postService.countLikesByOrganizationId(id)
    }

    getTotalMembers(id: string) {
        return organizationMember.countByOrganizationId(id)
    }
}

export default new Organization()
