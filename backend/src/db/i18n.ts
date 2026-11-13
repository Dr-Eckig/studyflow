/**
 * @module I18nService
 * @description Handles i18n-related database operations.
 */
import { GenericResponse } from "../types/restTypes.js";
import {
  I18nBaseResponse,
  I18nLangResponse,
  I18nLanguage,
  I18nTranslation,
} from "../models/i18n.js";
import { safeQuery } from "../util/safeQuery.js";

/**
 * Gathers all languages from the database
 *
 * @returns all languages from the database
 */
const getLanguages = async (): Promise<GenericResponse<I18nBaseResponse>> => {
  const res = await safeQuery<I18nLanguage>("SELECT * FROM i18n_languages", []);
  if (res.status !== 200 || !res.data?.length)
    return { status: 500, data: { languages: [], nextLanguage: {} } };

  const languages = res.data.map((lang) => lang.code);
  const nextLanguage: Record<string, string> = {};

  for (let i = 0; i < languages.length; i++) {
    nextLanguage[languages[i]] = languages[(i + 1) % languages.length];
  }

  return {
    status: 200,
    data: {
      languages,
      nextLanguage,
    },
  };
};

/**
 * Gathers all translations of a given language
 * @param lang The selected language
 *
 * @returns all translations of a given language
 */
const getTranslations = async (
  lang: string
): Promise<GenericResponse<I18nLangResponse>> => {
  const dictRes = await safeQuery<I18nTranslation>(
    "SELECT key, value FROM i18n_translations WHERE lang_code = $1 AND is_error IS FALSE",
    [lang]
  );

  const errorRes = await safeQuery<I18nTranslation>(
    "SELECT key, value FROM i18n_translations WHERE lang_code = $1 AND is_error IS TRUE",
    [lang]
  );

  if (dictRes.status !== 200 || errorRes.status !== 200) {
    return { status: 500, data: { dictionary: {}, errorMessages: {} } };
  }

  const dictionary: Record<string, string> = {};
  dictRes.data?.forEach((entry) => {
    dictionary[entry.key] = entry.value;
  });

  const errorMessages: Record<string, { message: string }> = {};
  errorRes.data?.forEach((entry) => {
    errorMessages[entry.key] = { message: entry.value };
  });

  return {
    status: 200,
    data: {
      dictionary,
      errorMessages,
    },
  };
};
export { getLanguages, getTranslations };
