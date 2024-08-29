declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string
        EDUSOCIAL_PORT_BACKEND: number
        EDUSOCIAL_SECRET: string
    }
}