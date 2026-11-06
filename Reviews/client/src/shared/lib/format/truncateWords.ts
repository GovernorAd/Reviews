export const truncateWords = (text: string, limit: number): string => {
  const words = text.trim().split(/\s+/)

  if (words.length <= limit) {
    return text.trim()
  }

  return `${words.slice(0, limit).join(' ')}…`
}
