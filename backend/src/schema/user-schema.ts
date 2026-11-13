import { JSONSchema7 } from "json-schema";
const userSchema: JSONSchema7 = {
  type: "object",
  properties: {
    id: { type: ["null", "string"], format: "uuid" },
    password: { type: ["null", "string"] },
    email: { type: ["null", "string"] },
    language: { type: ["null", "string"] },
    darkMode: { type: ["null", "boolean"] },
  },
  additionalProperties: false,
};

export { userSchema };
