import { PrismaClient } from '@prisma/client'

import organizations from '../src/modules/organization/organization.service'
import organizationsMembers from '../src/modules/organization/member/organizationmember.service'
import users from '../src/modules/user/user.service'

const prisma = new PrismaClient()

async function seed() {
    await prisma.organizationMember.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()

    // const u1 = await users.create({
    //     name: 'Admin',
    //     email: 'admin@root.com',
    //     password: 'admin',
    //     biography: 'lorem ipsum',
    //     birthday: new Date(),
    //     displayName: 'senhasegura',
    //     phone: '',
    //     pictureUrl: '',
    //     connectWithNeighbors: true,
    //     privacyPolicy: true,
    //     receiveEmails: true,
    //     receiveNotifications: true,
    //     termsOfUse: true,
    // })

    // const u2 = await users.create({
    //     name: 'John Doe',
    //     email: 'johndoe@example.com',
    //     password: 'senhasegura',
    //     biography: 'Full-stack developer and avid reader.',
    //     birthday: new Date('1992-03-15'),
    //     displayName: 'JohnD',
    //     phone: '1234567890',
    //     pictureUrl: '',
    //     connectWithNeighbors: true,
    //     privacyPolicy: true,
    //     receiveEmails: true,
    //     receiveNotifications: true,
    //     termsOfUse: true,
    // })

    // const u3 = await users.create({
    //     name: 'Jane Smith',
    //     email: 'janesmith@example.com',
    //     password: 'senhasegura',
    //     biography: 'UI/UX designer with a love for clean interfaces.',
    //     birthday: new Date('1988-09-25'),
    //     displayName: 'JaneS',
    //     phone: '',
    //     pictureUrl: '',
    //     connectWithNeighbors: true,
    //     privacyPolicy: true,
    //     receiveEmails: true,
    //     receiveNotifications: true,
    //     termsOfUse: true,
    // })

    // const u4 = await users.create({
    //     name: 'Alice Johnson',
    //     email: 'alicejohnson@example.com',
    //     password: 'senhasegura',
    //     biography: 'Project manager with a knack for organization.',
    //     birthday: new Date('1985-07-20'),
    //     displayName: 'AliceJ',
    //     phone: '',
    //     pictureUrl: '',
    //     connectWithNeighbors: true,
    //     privacyPolicy: true,
    //     receiveEmails: true,
    //     receiveNotifications: true,
    //     termsOfUse: true,
    // })

    // const u5 = await users.create({
    //     name: 'Bob Brown',
    //     email: 'bobbrown@example.com',
    //     password: 'senhasegura',
    //     biography: 'DevOps engineer who loves automation.',
    //     birthday: new Date('1990-11-30'),
    //     displayName: 'BobB',
    //     phone: '',
    //     pictureUrl: '',
    //     connectWithNeighbors: true,
    //     privacyPolicy: true,
    //     receiveEmails: false,
    //     receiveNotifications: true,
    //     termsOfUse: true,
    // })

    // prisma.user.update({
    //     where: {
    //         id: u1.id,
    //     },
    //     data: {
    //         role: 'ADMIN',
    //     },
    // })

    // const o1 = await organizations.create({
    //     name: 'EduSocial',
    //     biography: 'lorem ipsum',
    //     displayName: 'EduSocial',
    //     document: '00000000000000',
    //     email: 'contato@felipesobral.com.br',
    //     phone: '',
    //     pictureUrl: '',
    // })

    // const o2 = await organizations.create({
    //     name: 'Tech Innovators',
    //     biography: 'Innovating the tech world one step at a time.',
    //     displayName: 'Tech Innovators',
    //     document: '11111111111111',
    //     email: 'contact@techinnovators.com',
    //     phone: '',
    //     pictureUrl: '',
    // })

    // const o3 = await organizations.create({
    //     name: 'Health First',
    //     biography: 'Promoting health and wellness in the community.',
    //     displayName: 'Health First',
    //     document: '22222222222222',
    //     email: 'info@healthfirst.com',
    //     phone: '0987654321',
    //     pictureUrl: '',
    // })

    // const o4 = await organizations.create({
    //     name: 'Green Earth',
    //     biography: 'Dedicated to environmental sustainability.',
    //     displayName: 'Green Earth',
    //     document: '33333333333333',
    //     email: 'support@greenearth.com',
    //     phone: '',
    //     pictureUrl: '',
    // })

    // const o5 = await organizations.create({
    //     name: 'EduTech',
    //     biography: 'Bringing technology to education.',
    //     displayName: 'EduTech',
    //     document: '44444444444444',
    //     email: 'hello@edutech.com',
    //     phone: '',
    //     pictureUrl: '',
    // })

    // organizationsMembers.create({
    //     organizationId: o1.id,
    //     userId: u1.id,
    //     role: 'OWNER',
    // })

    // organizationsMembers.create({
    //     organizationId: o2.id,
    //     userId: u1.id,
    //     role: 'OWNER',
    // })

    // organizationsMembers.create({
    //     organizationId: o3.id,
    //     userId: u2.id,
    //     role: 'OWNER',
    // })

    // organizationsMembers.create({
    //     organizationId: o4.id,
    //     userId: u2.id,
    //     role: 'OWNER',
    // })

    // organizationsMembers.create({
    //     organizationId: o5.id,
    //     userId: u3.id,
    //     role: 'OWNER',
    // })
}

seed()
