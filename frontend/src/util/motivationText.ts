import { StoreI18n } from '@/store/StoreI18n'

/**
 * Returns a random motivation text. The texts are stored in the i18n dictionary
 * under the keys "motivation_1" to "motivation_12".
 * @returns a random motivation text
 */
export function getMotivationText(): string {
  const storeI18n = StoreI18n()
  const translate = (key: string) => storeI18n.dictionary[key] || key
  return translate(`motivation_${Math.floor(Math.random() * 12) + 1}`)
}
