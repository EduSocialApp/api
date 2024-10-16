import SupervisedUserController from './superviseduser.controller'

export class SupervisedUser extends SupervisedUserController {
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

export default new SupervisedUser()
