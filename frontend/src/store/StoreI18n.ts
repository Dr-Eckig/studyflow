import { defineStore } from 'pinia'
import { ref, reactive, toRefs, inject, readonly } from 'vue'
import { getJson } from '@/service/getJson'
import { StoreInitialize } from './StoreInitialize'
import { chooseLanguage } from '@/util/chooseLanguage'

// Interfaces
interface I18nData {
  languages: string[]
  nextLanguage: Record<string, string>
  dictionary: Record<string, string>
  errorMessages: Record<string, { message: string }>
}

interface Config {
  restPaths: {
    i18n: string
  }
}

export const StoreI18n = defineStore('i18n', () => {
  const config = inject<Config>('config')
  if (!config) throw new Error('Config not provided')

  const restPaths = config.restPaths
  const storeInitialize = StoreInitialize()

  const lang = ref<string | null>(null)

  const data = reactive<I18nData>({
    languages: [],
    nextLanguage: {},
    dictionary: {},
    errorMessages: {},
  })

  const { languages, nextLanguage, dictionary, errorMessages } = toRefs(data)

  /**
   * Gathers all translations from the server
   * @param p_lang The selected language. If not provided, the first language in the list is used.
   */
  const getI18n = async (p_lang: string | null = null) => {
    const baseRes = await getJson(restPaths.i18n)
    const baseData = baseRes.data
    if (baseRes.status !== 200 || !baseData.languages?.length) {
      throw new Error('Could not load available languages')
    }

    const selectedLang = baseData.languages.includes(p_lang)
      ? p_lang!
      : chooseLanguage(baseData.languages)
    const langRes = await getJson(`${restPaths.i18n}/${selectedLang}`)
    const langData = langRes.data
    if (langRes.status !== 200 || !langData.dictionary || !langData.errorMessages) {
      throw new Error(`Could not load translations for ${selectedLang}`)
    }

    data.languages = baseData.languages
    data.nextLanguage = baseData.nextLanguage
    data.dictionary = langData.dictionary
    data.errorMessages = langData.errorMessages
    lang.value = selectedLang
    document.documentElement.lang = selectedLang
  }

  /**
   * Changes the application's language to the specified language or defaults.
   *
   * @param p_lang The desired language to switch to. If null or not provided,
   * attempts to use the current language or defaults to the first available language.
   *
   * This function updates the `lang` ref to reflect the selected language and
   * fetches the appropriate translations by calling `getI18n`. It also sets the
   * language attribute of the HTML document to the selected language.
   */
  const changeLang = async (p_lang: string | null = null) => {
    await getI18n(p_lang ?? (lang.value ? data.nextLanguage[lang.value] : null))
  }

  /**
   * Initializes the i18n store by setting the default language and fetching
   * the necessary translations. This function is designed to be used as an
   * initializer during the application's setup process.
   *
   * @param resolve A callback function that is invoked once the initialization
   * process is complete.
   */
  const initialize = async () => {
    await changeLang()
  }

  storeInitialize.addInitializer(initialize)

  return {
    lang: readonly(lang),
    languages: readonly(languages),
    nextLanguage: readonly(nextLanguage),
    dictionary: readonly(dictionary),
    errorMessages: readonly(errorMessages),
    changeLang,
  }
})
