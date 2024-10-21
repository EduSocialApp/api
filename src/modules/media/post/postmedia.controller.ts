import { prisma } from '../../db'

export default class PostMediaController {
    private prisma = prisma.postMedia

    create(postId: string, mediaId: string) {
        return this.prisma.create({
            data: {
                postId,
                mediaId,
            },
        })
    }
}
