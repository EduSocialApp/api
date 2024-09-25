declare namespace Express {
    export interface Request {
        user: {
            id: string
            scopes: string[]
        }
    }
}
