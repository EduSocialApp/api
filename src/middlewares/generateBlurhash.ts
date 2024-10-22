import { NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import { encode } from 'blurhash'

sharp.cache(false) // Desabilita cache pois nao e necessario

// https://docs.expo.dev/versions/latest/sdk/image/#generating-a-blurhash-on-a-server
// https://blurha.sh/

async function blurhashByBuffer(imagePath: string) {
    try {
        const { data, info } = await sharp(imagePath).resize(128, 128).ensureAlpha().raw().toBuffer({
            resolveWithObject: true,
        })
        return encode(Uint8ClampedArray.from(data), info.width, info.height, 4, 4)
    } catch {
        // Apenas ignora caso ocorra erro
    }
}

/**
 * Gera blurhash de uma imagem
 */
export async function generateBlurhash(request: Request, response: Response, next: NextFunction) {
    // Gera blurhash de apenas um arquivo
    if (request.file) {
        const blurhash = await blurhashByBuffer(request.file.path)

        request.file.blurhash = blurhash
    }

    // Gera blurhash de varios arquivos
    if (Array.isArray(request.files)) {
        for (const file of request.files) {
            const blurhash = await blurhashByBuffer(file.path)
            file.blurhash = blurhash
        }
    }

    next()
}
