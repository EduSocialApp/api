import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import uuid from '@/functions/uuid'
import mime from 'mime/lite'
import { resolve } from 'path'

/**
 * Middleware para upload de um único arquivo
 */
export async function uploadSingleFileMiddleware(request: Request, response: Response, next: NextFunction) {
    multer({
        storage: multer.diskStorage({
            destination: resolve('..', 'files', 'tmp'),
            filename: (request, file, callback) => {
                return callback(null, `${uuid()}.${mime.getExtension(file.mimetype)}`)
            },
        }),
    }).single('file')(request, response, next)
}

/**
 * Middleware para upload de múltiplos arquivos
 */
export async function uploadMultipleFilesMiddleware(request: Request, response: Response, next: NextFunction) {
    multer({
        storage: multer.diskStorage({
            destination: resolve('..', 'files', 'tmp'),
            filename: (request, file, callback) => {
                return callback(null, `${uuid()}.${mime.getExtension(file.mimetype)}`)
            },
        }),
    }).array('files', 10)(request, response, next)
}
