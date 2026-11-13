import { JSONSchema7 } from "json-schema";

const examSchema: JSONSchema7 = {
  type: "object",
  properties: {
    id: { type: ["null", "string"], format: "uuid" },
    userId: { type: ["null", "string"], format: "uuid" },
    title: { type: ["null", "string"] },
    deadline: { type: ["null", "string"], format: "date" },
    tagColor: { type: ["null", "string"] },
    note: { type: ["null", "string"] },
  },
  additionalProperties: false,
};

export { examSchema };
