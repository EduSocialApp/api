import SupervisedUserRepository from '../../repositories/supervisedUser/supervisedUser.repository'

class SupervisedUser extends SupervisedUserRepository {
    /**
     *  Verifica se um usuário está vinculado a um supervisor
     */
    async userLinkedToSupervisor(supervisorId: string, userId: string) {
        const link = await this.findSupervisedUserBySupervisorIdAndSupervisedId(supervisorId, userId)
        return !!link
    }

    async usersHaveLink(userA: string, userB: string) {
        const link = await this.findLinkUsers(userA, userB)
        return !!link
    }
}

const supervisedUser = new SupervisedUser()
export { supervisedUser }
