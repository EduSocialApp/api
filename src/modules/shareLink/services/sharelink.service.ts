import { ShareLink as IShareLink } from '@prisma/client'
import ShareLinkRepository from '../repositories/sharelink.repository'
import { AppError } from '../../../functions/AppError'

class ShareLink extends ShareLinkRepository {
    async verifySharedLink(id: string): Promise<IShareLink> {
        const link = await this.findById(id)

        if (!link) throw new AppError('Link not found', 404)

        if (link.maxUses > 0 && link.countUsed >= link.maxUses) {
            throw new AppError('Link exceeded maximum uses', 400)
        }

        if (link.expiresAt && link.expiresAt < new Date()) {
            throw new AppError('Link expired', 400)
        }

        return link
    }
}

const shareLink = new ShareLink()
export { shareLink }
