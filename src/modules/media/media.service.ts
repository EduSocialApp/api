import MediaController from './media.controller'

import dbPostMedia from './post/postmedia.service'

export class Media extends MediaController {
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
        await dbPostMedia.create(postId, media.id)
    }
}

export default new Media()
