declare global {
    namespace Express {
        namespace Multer {
            interface File {
                blurhash?: string
            }
        }
    }
}

export {}
