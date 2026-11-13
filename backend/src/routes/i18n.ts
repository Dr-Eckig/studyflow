import { Router, Request, Response } from "express";
import { getLanguages, getTranslations } from "../db/i18n.js";
/**
 * Express router to provide internationalization (i18n) support.
 * Supports fetching available languages and specific translations.
 * @module Languages
 */

const Languages = Router();

Languages.route("/")
  /**
   * GET /i18n
   * Returns a list of supported languages.
   *
   * @returns {I18nBaseResponse[]} Array of language metadata (e.g., code, name)
   */
  .get(async (req: Request, res: Response) => {
    try {
      const { status, data } = await getLanguages();
      return res.status(status).json(data);
    } catch (err) {
      res.status(500).json({ error: "Could not fetch languages." });
    }
  });

Languages.route("/:lang")
  /**
   * GET /i18n/:lang
   * Returns translations for a specific language code.
   *
   * @param {string} lang - Language code (e.g., "en", "de")
   * @returns {I18nLangResponse} Key-value pairs of translated strings
   */
  .get(async (req: Request, res: Response) => {
    const lang = req.params.lang;
    try {
      if (!lang) return res.status(400).json({ message: "language missing" });
      const { status, data } = await getTranslations(lang);
      return res.status(status).json(data);
    } catch (err) {
      res.status(500).json({ error: "Could not fetch translations." });
    }
  });

export { Languages };
