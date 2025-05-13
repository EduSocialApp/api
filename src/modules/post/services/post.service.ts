import PostRepository from '../repositories/post.repository'

class Post extends PostRepository {}

const post = new Post()
export { post }
