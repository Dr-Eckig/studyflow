/**
 * Selects a language from the list of available languages that is most
 * suitable for the user, based on the user's browser language preferences.
 *
 * @param availableLanguages The list of languages that are available.
 * @param requestedLanguages The list of languages that the user prefers, in
 * order of preference. Defaults to the user's browser languages.
 * @returns The selected language. If no suitable language is found, returns
 * the first language in the list of available languages.
 */
export function chooseLanguage(
  availableLanguages: string[],
  requestedLanguages: string[] = [...navigator.languages],
): string {
  let selected = availableLanguages[0]

  // Exact match
  for (const req of requestedLanguages) {
    for (const avail of availableLanguages) {
      if (req === avail) {
        return avail
      }
    }
  }

  // Match by language prefix
  for (const req of requestedLanguages) {
    const reqPrefix = req.slice(0, 2)
    for (const avail of availableLanguages) {
      if (avail.slice(0, 2) === reqPrefix) {
        return avail
      }
    }
  }

  return selected
}
