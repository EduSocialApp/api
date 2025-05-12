import { Router } from 'express'
import { ensureAuthenticated } from 'src/middlewares/ensureAuthenticated'
import { ensurePostExists } from 'src/middlewares/exists/ensurePostExists'
import likeOrUnlikePost from '../controllers/likeOrUnlikePost.controller'
import getPostById from '../controllers/getPostById.controller'

const postRoutes = Router()

postRoutes.post('/:id/likeOrUnlike', ensureAuthenticated, ensurePostExists, likeOrUnlikePost)
postRoutes.get('/:id', ensureAuthenticated, ensurePostExists, getPostById)

export { postRoutes }
