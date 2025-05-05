export interface AppErrorOptions {
    code?: string
    cause?: Error
    details?: any
}

export class AppError extends Error {
    public readonly statusCode: number
    public readonly code?: string
    public readonly cause?: Error
    public readonly details?: any

    constructor(message: string, statusCode: number = 400, options: AppErrorOptions = {}) {
        super(message)

        this.statusCode = statusCode
        this.code = options.code
        this.cause = options.cause
        this.details = options.details

        this.name = 'AppError'
        Object.setPrototypeOf(this, AppError.prototype)
        Error.captureStackTrace?.(this, AppError)
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            ...(this.details && { details: this.details }),
        }
    }
}
