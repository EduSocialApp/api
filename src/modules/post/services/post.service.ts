import PostRepository from '../repositories/post.repository'

class Post extends PostRepository {}

export const post = new Post()
export default post
