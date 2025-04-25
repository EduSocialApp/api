import { NextFunction, Request, Response } from 'express'

import dbPost from '@/modules/post/post.service'
import dbMedia from '@/modules/media/media.service'
import { awsS3Upload } from '@/functions/aws/s3/upload'

/**
 * Cria uma nova postagem com o usuario logado
 */
export default async function createNewPost(request: Request, response: Response, next: NextFunction) {
    try {
        const { content } = request.body

        if (!content) throw new Error('Content is required')

        if (content.length > 600) throw new Error('Content is too long')

        const post = await dbPost.create({
            userId: request.user.id,
            content,
        })

        if (Array.isArray(request.files) && request.files.length > 0) {
            for (const file of request.files) {
                try {
                    const fileInAWS = await awsS3Upload(file.path, file.mimetype)

                    await dbMedia.newMediaPost({
                        postId: post.id,
                        mediaUrl: fileInAWS.Location,
                        blurhash: file.blurhash,
                    })
                } catch (e) {
                    console.log(e)
                    // ignore upload failed
                }
            }
        }

        response.status(201).json({
            id: post.id,
        })
    } catch (e) {
        next(e)
    }
}
