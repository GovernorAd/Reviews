const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate)

  return Number.isNaN(date.getTime()) ? '—' : formatter.format(date)
}
