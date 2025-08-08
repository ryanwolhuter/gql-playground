import { z } from "zod";

export const primitives = z.object({
  String: `z.string()`,
  Int: `z.number()`,
  Float: `z.number()`,
  Boolean: `z.boolean()`,
  ID: `z.string()`,
  Unknown: `z.unknown()`,
});