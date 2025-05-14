export const socketConnections = new Map<string, string>() // userId -> socketId

export function getSocketIdFromUserId(userId: string) {
    return socketConnections.get(userId)
}

export function getSocketIdsFromUserIds(usersIds: string[]): string[] {
    return usersIds.map((userId) => socketConnections.get(userId)).filter((socketId): socketId is string => Boolean(socketId))
}
