import axios from 'axios'

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

export function sendNotificationByNotificationToken(token: string, title: string, message: string) {
    return sendNotificationByExpo([token], title, message)
}
