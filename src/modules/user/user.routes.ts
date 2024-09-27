import { Router } from 'express'

import renewToken from '../session/http/renewSession'

import authenticateUser from './http/authenticateUser'
import createNewUser from './http/createNewUser'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import getUserById from './http/getUserById'

const userRoutes = Router()

userRoutes.post('/login', authenticateUser)
userRoutes.patch('/login', renewToken)

userRoutes.post('/register', createNewUser)

userRoutes.get('/:id', ensureAuthenticated, getUserById)

export { userRoutes }
