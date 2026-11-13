/**
 * Date utility to check whether a given date lies before a reference date (default: today).
 * @module DateUtils
 */

/**
 * Checks whether `dateToCheck` is before `dateReference` (defaults to today).
 *
 * @function
 * @param {Date} dateToCheck - The date to compare.
 * @param {Date} [dateReference] - Optional reference date (default is today).
 * @returns {boolean} `true` if `dateToCheck` is before the reference date, otherwise `false`.
 */
export function isBefore(dateToCheck: Date, dateReference?: Date): boolean {
  const reference = new Date(dateReference || new Date());
  reference.setHours(0, 0, 0, 0);

  const checkDate = new Date(dateToCheck);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate < reference;
}
