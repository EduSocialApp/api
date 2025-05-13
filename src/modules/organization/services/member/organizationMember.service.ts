import OrganizationMemberRepository from '../../repositories/member/organizationMember.repository'

class OrganizationMember extends OrganizationMemberRepository {}

const organizationMember = new OrganizationMember()
export { organizationMember }
