import { StoreI18n } from '@/store/StoreI18n'
import { computed } from 'vue'

/**
 * Returns a string representing an icon based on the provided color name.
 * If no color is provided or the color is not recognized, a default icon is returned.
 *
 * @param {string} [color] - The name of the color for which to get the icon.
 * @returns {string} The icon corresponding to the specified color.
 */
export function getIcon(color?: string): string {
  if (!color) {
    return '❔'
  }
  switch (color.toLowerCase()) {
    case 'red':
      return '🔴'
    case 'blue':
      return '🔵'
    case 'green':
      return '🟢'
    case 'yellow':
      return '🟡'
    case 'violet':
      return '🟣'
    case 'orange':
      return '🟠'
    case 'brown':
      return '🟤'
    case 'white':
      return '⚪️'
    case 'black':
      return '⚫️'
    default:
      return '❔'
  }
}

/**
 * Returns an array of objects representing all possible colors.
 * Each object contains the key of the color and a translated label.
 *
 * @returns {Array<{ key: string; label: string }>}
 */
export function getAllPossibleColors(): { key: string; label: string }[] {
  const storeI18n = StoreI18n()
  const translate = (key: string) => storeI18n.dictionary[key] || key

  const colorKeys = [
    'red',
    'blue',
    'green',
    'yellow',
    'violet',
    'orange',
    'brown',
    'white',
    'black',
  ]

  return colorKeys.map((color) => ({
    key: color,
    label: translate(`color_${color}`),
  }))
}

/**
 * Removes a color icon from a string.
 *
 * @param {string} color
 * @returns {string} The color without an icon.
 */
export function removeIcon(color: string): string {
  const colorWithoutIcon = color.replace(/🔴|🔵|🟢|🟡|🟣|🟠|🟤|⚪️|⚫️/g, '')
  return colorWithoutIcon.trim()
}

export function getWeekdayArray(): string[] {
  const storeI18n = StoreI18n()
  const translate = (key: string) => storeI18n.dictionary[key] || key

  const days = computed(() => [
    translate('calendar_day_mo'),
    translate('calendar_day_tu'),
    translate('calendar_day_we'),
    translate('calendar_day_th'),
    translate('calendar_day_fr'),
    translate('calendar_day_sa'),
    translate('calendar_day_su'),
  ])
  return days.value
}

/**
 * Returns an array of long weekday names, translated according to the current
 * language settings.
 *
 * @returns {string[]} An array of long weekday names, e.g. ['Montag', ...].
 */
export function getWeekdayLongArray(): string[] {
  const storeI18n = StoreI18n()
  const translate = (key: string) => storeI18n.dictionary[key] || key

  const days = computed(() => [
    translate('calendar_day_mo_long'),
    translate('calendar_day_tu_long'),
    translate('calendar_day_we_long'),
    translate('calendar_day_th_long'),
    translate('calendar_day_fr_long'),
    translate('calendar_day_sa_long'),
    translate('calendar_day_su_long'),
  ])
  return days.value
}

/**
 * Returns the short weekday name for a given date, translated according
 * to the current language settings. The week starts on Monday.
 *
 * @param {Date} date - The date for which to get the weekday name.
 * @returns {string} The localized short name of the weekday, e.g. 'Mon'.
 */
export function getWeekdayName(date: Date) {
  const jsIndex = date.getDay()
  const mondayFirstIndex = jsIndex === 0 ? 6 : jsIndex - 1

  return getWeekdayArray()[mondayFirstIndex]
}

/**
 * Returns the long weekday name for a given date, translated according
 * to the current language settings. The week starts on Monday.
 *
 * @param {Date} date - The date for which to get the weekday name.
 * @returns {string} The localized long name of the weekday, e.g. 'Montag'.
 */
export function getWeekdayLongName(date: Date) {
  const jsIndex = date.getDay()
  const mondayFirstIndex = jsIndex === 0 ? 6 : jsIndex - 1

  return getWeekdayLongArray()[mondayFirstIndex]
}
