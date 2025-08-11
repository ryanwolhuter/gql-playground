import { z } from "zod";

export const primitives = z.object({
  String: `z.string()`,
  Int: `z.number()`,
  Decimal: `z.number()`,
  Float: `z.number()`,
  Boolean: `z.boolean()`,
  ID: `z.string()`,
  DateTime: `z.date()`,
  JSON: `z.json()`,
  Unknown: `z.unknown()`,
});
