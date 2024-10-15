import SupervisedUserController from './superviseduser.controller'

export class SupervisedUser extends SupervisedUserController {
    /**
     *  Verifica se um usuário está vinculado a um supervisor
     */
    userLinkedToSupervisor(userId: string, supervisorId: string) {
        const link = this.findSupervisedUserBySupervisorIdAndSupervisedId(supervisorId, userId)
        return !!link
    }
}

export default new SupervisedUser()
