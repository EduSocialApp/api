import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { Router } from 'express'
import likeOrUnlikePost from './http/likeOrUnlikePost'
import { ensurePostExists } from '@/middlewares/exists/ensurePostExists'

const postRoutes = Router()

postRoutes.post('/:id/likeOrUnlike', ensureAuthenticated, ensurePostExists, likeOrUnlikePost)

export { postRoutes }
