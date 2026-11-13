import { StoreI18n } from '@/store/StoreI18n'

/**
 * Returns the appropriate plural form of 'day' in the current language.
 * If the count is 1, it will return the singular form 'day', otherwise
 * the plural form 'days'.
 * @param {number} count
 * @returns {string}
 */
export function pluralizeDay(count: number): string {
  const storeI18n = StoreI18n()
  const translate = (key: string) => storeI18n.dictionary[key] || key

  return count === 1 ? translate('day') : translate('days')
}
