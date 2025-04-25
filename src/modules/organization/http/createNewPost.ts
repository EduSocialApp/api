import { NextFunction, Request, Response } from 'express'

import dbPost from '../../../modules/post/post.service'
import dbMedia from '../../../modules/media/media.service'
import { awsS3Upload } from '../../../functions/aws/s3/upload'

/**
 * Cria uma nova postagem com o usuario logado
 */
export default async function createNewPost(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: organizationId } = request.params
        let { content, startDate, endDate, level, notifiedUsers, title } = request.body as {
            content?: string
            startDate?: string
            endDate?: string
            level?: string
            notifiedUsers?: string[]
            title?: string
            organizationId?: string
        }

        if (!content) throw new Error('Content is required')
        if (!level) level = 'NORMAL'

        if (!['URGENT', 'IMPORTANT', 'NORMAL'].includes(level)) {
            throw new Error('Level is invalid')
        }

        if (content.length > 600) throw new Error('Content is too long')

        if (startDate) {
            startDate
        }

        // Cria postagem
        const post = await dbPost.create({
            userId: request.user.id,
            content,
            organizationId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            level: dbPost.parsePostLevel(level),
            title,
        })

        // Adiciona arquivos a postagem (caso existam)
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

        // Adiciona usuarios notificados a postagem (caso existam)
        if (notifiedUsers && notifiedUsers.length > 0) {
            // Primeiro preciso verificar quais usuarios fazem parte da organizacao
            //const usersBelongOrganization = await dbOrganizationMember.
        }

        response.status(201).json({
            id: post.id,
        })
    } catch (e) {
        next(e)
    }
}
