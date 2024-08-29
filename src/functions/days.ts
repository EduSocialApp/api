/**
 * Adiciona dias a uma data
 * @returns Data com os dias adicionados
 */
export function addDays(date: Date, days: number = 30): Date {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)

    return newDate
}