import { sign as signToken, SignOptions, verify as verifyToken } from 'jsonwebtoken'

import uuid from './uuid'

const secret = process.env.SECRET || 'segredo-muito-secreto'

export function createAccessToken({ options, payload }: { payload?: object, options?: SignOptions }): { id: string, token: string } {
    const id = uuid()

    const token = signToken(payload || {}, secret, {
        ...options,
        issuer: 'edusocial-api',
        jwtid: id
    })

    return { id, token }
}

export function verifyAcessToken(token: string) {
    return verifyToken(token, secret)
}