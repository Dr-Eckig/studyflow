import { JSONSchema7 } from "json-schema";

const taskSchema: JSONSchema7 = {
  type: "object",
  properties: {
    id: { type: ["null", "string"], format: "uuid" },
    userId: { type: ["null", "string"], format: "uuid" },
    examId: { type: ["null", "string"], format: "uuid" },
    name: { type: ["null", "string"] },
    completed: { type: ["null", "boolean"] },
    date: { type: ["null", "string"], format: "date" },
    color: { type: ["null", "string"] },
    examTitle: { type: ["null", "string"] },
  },
  additionalProperties: false,
};

export { taskSchema };
