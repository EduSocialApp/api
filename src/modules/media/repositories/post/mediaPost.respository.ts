import { prisma } from '../../../../database/prisma'

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
