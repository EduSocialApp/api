import { prisma } from '../../../db'

export default class MediaPost {
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
