export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }

  static badRequest(message = 'Некорректный запрос'): HttpError {
    return new HttpError(400, message)
  }

  static notFound(message = 'Ресурс не найден'): HttpError {
    return new HttpError(404, message)
  }

  static unauthorized(message = 'Требуется авторизация'): HttpError {
    return new HttpError(401, message)
  }

  static forbidden(message = 'Недостаточно прав'): HttpError {
    return new HttpError(403, message)
  }

  static conflict(message = 'Конфликт данных'): HttpError {
    return new HttpError(409, message)
  }
}
