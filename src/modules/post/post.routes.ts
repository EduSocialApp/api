import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { Router } from 'express'
import likeOrUnlikePost from './http/likeOrUnlikePost'
import { ensurePostExists } from '../../middlewares/exists/ensurePostExists'
import getPostById from './http/getPostById'

const postRoutes = Router()

postRoutes.post('/:id/likeOrUnlike', ensureAuthenticated, ensurePostExists, likeOrUnlikePost)
postRoutes.get('/:id', ensureAuthenticated, ensurePostExists, getPostById)

export { postRoutes }
