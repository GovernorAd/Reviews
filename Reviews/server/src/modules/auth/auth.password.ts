import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

const KEY_LENGTH = 64
const SALT_LENGTH = 16
const ALGORITHM = 'scrypt'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  return `${ALGORITHM}$${salt}$${derivedKey.toString('hex')}`
}

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [algorithm, salt, hash] = storedHash.split('$')

  if (algorithm !== ALGORITHM || !salt || !hash) {
    return false
  }

  const expectedKey = Buffer.from(hash, 'hex')

  if (expectedKey.length !== KEY_LENGTH) {
    return false
  }

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  return timingSafeEqual(derivedKey, expectedKey)
}
