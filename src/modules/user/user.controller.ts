import { DocumentEnum } from '@prisma/client'

import uuid from '@/functions/uuid'

import { prisma } from '../db'

export default class UserController {
    private prisma = prisma.user

    create({
        name,
        email,
        password,
        pictureUrl,
        phone,
        birthday
    }: {
        name: string
        email: string
        password: string
        pictureUrl: string
        phone: string
        birthday: Date
    }) {

        return this.prisma.create({
            data: {
                id: uuid(),
                name,
                email,
                password,
                document: '',
                documentType: 'UNKNOW',
                pictureUrl,
                phone,
                birthday,
                role: 'USER',
                scopes: ['CREATE_ORGANIZATION']
            }
        })
    }

    findById(id: string) {
        return this.prisma.findUnique({
            where: {
                id
            }
        })
    }

    findByEmail(email: string) {
        return this.prisma.findUnique({
            where: {
                email
            }
        })
    }

    findByDocument(document: string) {
        return this.prisma.findUnique({
            where: {
                document
            }
        })
    }

    findByEmailAndPassword(email: string, password: string) {
        return this.prisma.findFirst({
            where: {
                email,
                password
            }
        })
    }
}