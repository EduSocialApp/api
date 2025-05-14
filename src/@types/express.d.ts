declare namespace Express {
    export interface Request {
        user: {
            id: string
            scopes: string[]
            role: 'ADMIN' | 'MODERATOR' | 'USER'
            sessionId: string
            notificationToken: string | null
            supervisedUsers: string[]
            supervisorUsers: string[]
            organizations: {
                id: string
                role: 'OWNER' | 'MODERATOR' | 'USER'
            }[]
        }
    }
}
