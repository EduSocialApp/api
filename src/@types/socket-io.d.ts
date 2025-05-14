declare global {
    namespace Socket {
        data: {
            userId: string
            role: 'ADMIN' | 'MODERATOR' | 'USER'
        }
    }
}
