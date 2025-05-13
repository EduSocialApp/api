import os from 'os'

export function getLocalIp(): string | null {
    const interfaces = os.networkInterfaces()

    // Percorre todas as interfaces disponíveis
    for (const name of Object.keys(interfaces)) {
        // Para cada interface, verifica suas configurações
        for (const net of interfaces[name] || []) {
            // Verifica se é IPv4 e se não é uma interface interna (ex: 127.0.0.1)
            if (net.family === 'IPv4' && !net.internal) {
                return net.address
            }
        }
    }

    return null
}
