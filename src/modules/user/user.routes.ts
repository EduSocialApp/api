import { Router } from 'express'

import renewToken from '../session/http/renewSession'

import authenticateUser from './http/authenticateUser'
import createNewUser from './http/createNewUser'

const userRoutes = Router()

userRoutes.post('/login', authenticateUser)
userRoutes.patch('/login', renewToken)

userRoutes.post('/register', createNewUser)

export { userRoutes }