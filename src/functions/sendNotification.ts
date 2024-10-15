import axios from 'axios'

import dbUser from '../modules/user/user.service'

export async function sendNotificationToAdmins(title: string, message: string) {
    const admins = await dbUser.findNotificationTokenAdmins()
    const tokens = admins.map((admin) => admin.sessions.map((session) => session.notificationToken || '')).flat() // Pega todos os tokens de notificação dos admins

    return sendNotificationByExpo(tokens, title, message)
}

export async function sendNotificationToAll(title: string, message: string) {
    const all = await dbUser.findNotificationTokenAll()
    const tokens = all.map((user) => user.sessions.map((session) => session.notificationToken || '')).flat() // Pega todos os tokens de notificação dos usuários

    return sendNotificationByExpo(tokens, title, message)
}

export async function sendNotificationToModerators(title: string, message: string) {
    const all = await dbUser.findNotificationTokenModerators()
    const tokens = all.map((user) => user.sessions.map((session) => session.notificationToken || '')).flat() // Pega todos os tokens de notificação dos usuários

    return sendNotificationByExpo(tokens, title, message)
}

export async function sendNotificationToAdminsAndModerators(title: string, message: string) {
    const all = await dbUser.findNotificationTokenAdminsAndModerators()
    const tokens = all.map((user) => user.sessions.map((session) => session.notificationToken || '')).flat() // Pega todos os tokens de notificação dos usuários

    return sendNotificationByExpo(tokens, title, message)
}

export async function sendNotificationToUserId(userId: string, title: string, message: string) {
    const user = await dbUser.findSessionByUserId(userId)
    if (!user) return

    const tokens = user.sessions.map((session) => session.notificationToken || '') // Pega todos os tokens de notificação do usuário

    return sendNotificationByExpo(tokens, title, message)
}

export function sendNotificationByNotificationToken(token: string, title: string, message: string) {
    return sendNotificationByExpo([token], title, message)
}

export function sendNotificationByExpo(expoTokens: string[], title: string, message: string, data: Object = {}) {
    const tokens = expoTokens.filter((token) => token) // Remove tokens vazios

    if (tokens.length === 0) return

    return axios.post('https://exp.host/--/api/v2/push/send', {
        to: tokens,
        title,
        body: message,
        data,
    })
}
