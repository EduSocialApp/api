import { createHash } from 'crypto'

export function gravatarProfilePictureUrl(email: string): string {
    const emailHash = createHash('sha256').update(email).digest('hex')
    return `https://www.gravatar.com/avatar/${emailHash}`
}