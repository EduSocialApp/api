import MediaPostRepository from '../../repositories/post/mediaPost.respository'

class MediaPost extends MediaPostRepository {}

const mediaPost = new MediaPost()
export { mediaPost }
