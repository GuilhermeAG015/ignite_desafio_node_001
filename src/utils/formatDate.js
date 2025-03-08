import { format } from 'date-fns'

export function formatDate() {
  const date = new Date()
  const dateFormatted = format(date, 'yyyy-MM-dd - HH:mm:ss')

  return dateFormatted
}