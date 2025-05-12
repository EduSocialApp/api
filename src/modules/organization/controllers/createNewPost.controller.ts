import { NextFunction, Request, Response } from 'express'

import dbPost from '../../../modules/post/post.service'
import dbMedia from '../../../modules/media/services/media.service'
import { awsS3Upload } from '../../../functions/aws/s3/upload'
import addressOrganization from 'src/modules/address/services/organization/addresOrganization.service'
import { AppError } from '../../../functions/AppError'

/**
 * Cria uma nova postagem com o usuario logado
 */
export default async function createNewPost(request: Request, response: Response, next: NextFunction) {
    try {
        const { id: organizationId } = request.params
        let { content, startDate, endDate, level, notifiedUsers, title, addressId } = request.body as {
            content?: string
            startDate?: string
            endDate?: string
            level?: string
            notifiedUsers?: string[]
            title?: string
            organizationId?: string
            addressId?: string
        }

        if (content) content = content.trim()
        if (title) title = title.trim()

        if (!content) throw new AppError('Content is required')
        if (!level) level = 'NORMAL'

        if (!['URGENT', 'IMPORTANT', 'NORMAL'].includes(level)) {
            throw new AppError('Level is invalid')
        }

        if (content.length > 600) throw new AppError('Content is too long')

        const objStartDate = startDate ? new Date(startDate) : undefined
        const objEndDate = endDate ? new Date(endDate) : undefined

        // Checa se a data de inicio é maior que a data de fim, caso ambas existam
        if (objStartDate && objEndDate && objStartDate > objEndDate) {
            throw new AppError('Start date must be earlier than the end date')
        }

        // Caso a data de inicio exista, checa se é maior que a data atual
        if (objStartDate && objStartDate < new Date()) {
            throw new AppError('Start date must be greater than the current date')
        }

        // Caso o endereço exista, checa se é da organização
        if (addressId && !(await addressOrganization.isAddressInOrganization(organizationId, addressId))) {
            throw new AppError('Address does not belong to the organization')
        }

        // Cria postagem
        const post = await dbPost.create({
            userId: request.user.id,
            content,
            organizationId,
            startDate: objStartDate,
            endDate: objEndDate,
            level: dbPost.parsePostLevel(level),
            title,
            addressId,
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
                    // ignore upload failed
                }
            }
        }

        // Adiciona usuarios notificados a postagem (caso existam)
        if (notifiedUsers && notifiedUsers.length > 0) {
        }

        response.status(201).json({
            id: post.id,
        })
    } catch (e) {
        next(e)
    }
}
