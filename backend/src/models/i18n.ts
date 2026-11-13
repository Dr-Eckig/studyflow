export interface I18nLanguage {
  code: string;
  name: string;
}

export interface I18nTranslation {
  key: string;
  value: string;
}

export interface I18nBaseResponse {
  languages: string[];
  nextLanguage: Record<string, string>;
}

export interface I18nLangResponse {
  dictionary: Record<string, string>;
  errorMessages: Record<string, { message: string }>;
}
