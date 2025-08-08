export function createStrictMatchRegex(typeName: string): RegExp {
  return new RegExp(`(?<![a-zA-Z0-9_])${typeName}(?![a-zA-Z0-9_])`);
}

export function stripSchemaSuffix(input: string): string {
  return input.replace(/Schema$/, "");
}