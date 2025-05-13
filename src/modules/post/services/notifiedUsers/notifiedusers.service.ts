import PostNotifiedUsersRepository from '../../repositories/notifiedUsers/postNotifiedusers.repsitory'

class PostNotifiedUsers extends PostNotifiedUsersRepository {}

const postNotifiedUsers = new PostNotifiedUsers()
export { postNotifiedUsers }
