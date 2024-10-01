import uuid from '../../functions/uuid'
import { prisma } from '../db'

export default class AddressController {
    private prisma = prisma.address

    create({
        state,
        street,
        city,
        complement,
        country,
        ibgeCode,
        neighborhood,
        number,
        zipCode,
    }: {
        street: string
        number: string
        complement: string
        neighborhood: string
        city: string
        state: string
        country: string
        zipCode: string
        ibgeCode: string
    }) {
        return this.prisma.create({
            data: {
                id: uuid(),
                street,
                state,
                city,
                complement,
                country,
                ibgeCode,
                neighborhood,
                number,
                zipCode,
                geolocation: '',
            },
        })
    }
}
