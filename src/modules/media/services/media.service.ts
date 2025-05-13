import MediaRepository from '../repositories/media.repository'

import { mediaPost } from './post/mediaPost.repository'

class Media extends MediaRepository {
    async newMediaPost({
        postId,
        description = '',
        mediaUrl,
        blurhash,
    }: {
        postId: string
        description?: string
        blurhash?: string
        mediaUrl: string
    }) {
        // Primeiro cria a midia
        const media = await this.create({ description, mediaUrl, blurhash })

        // Faz vinculo da midia com o post
        await mediaPost.create(postId, media.id)
    }
}

const media = new Media()
export { media }
