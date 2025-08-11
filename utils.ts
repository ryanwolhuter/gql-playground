import { buildSchema, isEnumType, isInputObjectType, isObjectType, isUnionType, type GraphQLNamedType, type GraphQLSchema } from "graphql";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { primitives } from "./primitives.js";
import { handleObject } from "./processors.js";
import { constantCase, pascalCase } from "change-case";

export function createStrictMatchRegex(typeName: string): RegExp {
  return new RegExp(`(?<![a-zA-Z0-9_])${typeName}(?![a-zA-Z0-9_])`);
}

export function stripSchemaSuffix(input: string): string {
  return input.replace(/Schema$/, "");
}

export async function readGraphQLSchemaFile(pathToGraphqlSchema: string) {
  const schemaString = await readFile(pathToGraphqlSchema, "utf8");
  const schema = buildSchema(schemaString);
  return schema;
}

export function getZodSchemasFileName(pathToGraphqlSchema: string): string {
  return pathToGraphqlSchema.replace(".graphql", "-zod-schemas.ts");
}

export function makeZodSchemaStringsFromZodMap(zodMap: Map<string, string>): string[] {
  return Array.from(zodMap.entries()).map(([name, schema]) => {
    return `export const ${name}Schema = ${schema};`;
  });
}

export async function writeZodSchemasToFile(fileName: string, schemaStrings: string[]) {
  const result = schemaStrings.join("\n\n");
  const formattedResult = await format(result, { parser: "typescript" });


  await writeFile(
    fileName,
    `import { z } from "zod";\n\n${formattedResult}`
  );
}

export function makeGraphQLTypeMap(schema: GraphQLSchema) {
  return Object.values(schema.getTypeMap()).filter(
    (type) => !type.name.startsWith("__")
  );
}

export function makeZodMap() {
  return new Map<string, string>(Object.entries(primitives.shape));
}

export function addEnumZodSchemasToZodMap(zodMap: Map<string, string>, graphqlTypeMap: GraphQLNamedType[]) {
  const enums = graphqlTypeMap.filter((type) => isEnumType(type));

  for (const e of enums) {
    const name = e.name;
    const values = e.getValues().map((value) => value.name);
    const schema = `z.enum([${values.map((value) => `"${value}"`).join(", ")}])`;
    zodMap.set(name, schema);
  }
}

export function addUnionZodSchemasToZodMap(zodMap: Map<string, string>, graphqlTypeMap: GraphQLNamedType[]) {
  const unions = graphqlTypeMap.filter((type) => isUnionType(type));
  for (const u of unions) {
    const name = u.name;
    const types = u
      .getTypes()
      .map((type) => type.name)
      .map((t) => `z.lazy(() => ${t}Schema)`);
    const schema = `z.union([${types.join(", ")}])`;
    zodMap.set(name, schema);
  }
}

export function addObjectZodSchemasToZodMap(zodMap: Map<string, string>, graphqlTypeMap: GraphQLNamedType[]) {
  const objects = graphqlTypeMap.filter((type) => isObjectType(type) || isInputObjectType(type));

  for (const o of objects) {
    zodMap.set(o.name, handleObject(o));
  }
}

export type Action = {
  type: string;
  scope: string;
  inputNameOrDefinition: string | unknown;
}
export function addActionSchemasToZodMap(zodMap: Map<string, string>, graphqlTypeMap: GraphQLNamedType[], actions: Action[]) {
  for (const action of actions) {
    const { type, scope, inputNameOrDefinition } = action;
    if (typeof inputNameOrDefinition === "string") {
      const inputType = graphqlTypeMap.find(type => type.name === inputNameOrDefinition);
      if (!inputType) {
        throw new Error(`Input type ${inputNameOrDefinition} not found`);
      }
      if (!isInputObjectType(inputType)) {
        throw new Error(`Input type ${inputNameOrDefinition} is not an input object type`);
      }
      const constantCaseType = constantCase(type);
      const pascalCaseType = pascalCase(type);
      const schemaName = `${pascalCaseType}Action`;
      const actionInputZodSchemaString = handleObject(inputType);
      const actionSchemaString = `z.object({
        type: z.literal("${constantCaseType}"),
        scope: z.literal("${scope}"),
        input: ${actionInputZodSchemaString}
      })`;
      zodMap.set(schemaName, actionSchemaString);
    }
  }
}