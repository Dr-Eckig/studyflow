/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

import addFormats from "ajv-formats";
import { Validator } from "express-json-validator-middleware";

const validator = new Validator({ allErrors: true });

// https://ajv.js.org/packages/ajv-formats.html
(addFormats as any)(validator.ajv);

export default validator.validate;
