import { AppError } from '@/functions/AppError'
import { awsS3Upload } from '@/functions/aws/s3/upload'
import { NextFunction, Request, Response } from 'express'

/**
 * Middleware para fazer upload de arquivos para o S3
 */
export async function uploadS3Middleware(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.file) throw new AppError('No file uploaded', 400)

        const fileInAWS = await awsS3Upload(request.file.path, request.file.mimetype)

        if (!fileInAWS) throw new AppError('Upload to S3 failed', 500)

        request.file.filename = fileInAWS.Location

        next()
    } catch (e) {
        next(new AppError('Upload to S3 failed', 500))
    }
}

/**
 * Middleware para fazer upload de multiplos arquivos para o S3
 */
export async function uploadMultipleFilesS3Middleware(request: Request, response: Response, next: NextFunction) {
    try {
        if (!Array.isArray(request.files)) throw new AppError('No file uploaded', 400)

        for (const file of request.files) {
            const fileInAWS = await awsS3Upload(file.path, file.mimetype)

            if (!fileInAWS) throw new AppError('Upload to S3 failed', 500)

            file.filename = fileInAWS.Location
        }

        next()
    } catch (e) {
        next(new AppError('Upload to S3 failed', 500))
    }
}
