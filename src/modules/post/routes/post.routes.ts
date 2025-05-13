import { Router } from 'express'
import { ensureAuthenticated } from '../../user/middlewares/ensureAuthenticated.middleware'
import { ensurePostExists } from '../middlewares/ensurePostExists.middleware'
import { likeOrUnlikePost } from '../controllers/likeOrUnlikePost.controller'
import { getPostById } from '../controllers/getPostById.controller'

const postRoutes = Router()

postRoutes.post('/:id/likeOrUnlike', ensureAuthenticated, ensurePostExists, likeOrUnlikePost)
postRoutes.get('/:id', ensureAuthenticated, ensurePostExists, getPostById)

export { postRoutes }
