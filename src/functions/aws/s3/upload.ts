import { AppError } from '../../../functions/AppError'
import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'

export async function awsS3Upload(filepath: string, mimeType?: string, expirationDate?: Date, deleteAfterUpload = true) {
    if (!fs.existsSync(filepath)) {
        throw new AppError('File not found', 404)
    }

    const fileName = path.basename(filepath)

    // Configura credenciais da AWS
    const s3 = new AWS.S3({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        region: process.env.AWS_REGION,
    })

    // Faz upload do arquivo
    const fileInS3 = await s3
        .upload({
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: fileName,
            Body: fs.readFileSync(filepath),
            Expires: expirationDate,
            ContentType: mimeType,
        })
        .promise()

    // Deleta arquivo após upload
    if (deleteAfterUpload) {
        fs.unlinkSync(filepath)
    }

    return fileInS3
}
