const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  return Number.isNaN(date.getTime()) ? '—' : formatter.format(date)
}
