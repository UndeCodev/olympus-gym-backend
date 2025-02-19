import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config/config'

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (
  password: string
): Promise<string> => {
  return await bcrypt.hash(password, Number(SALT_ROUNDS))
}

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password entered by the user
 * @param hashedPassword - The stored hashed password
 * @returns {Promise<boolean>} - `true` if the passwords match, `false` otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
