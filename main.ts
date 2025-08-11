import { readFileSync, writeFileSync } from "node:fs";
import {
  buildSchema,
  isEnumType,
  isInputObjectType,
  isObjectType,
  isUnionType,
} from "graphql";
import { format } from "prettier";
import { Project } from "ts-morph";
import { stripSchemaSuffix } from "./utils.js";
import { handleObject } from "./processors.js";
import { primitives } from "./primitives.js";
const SHOULD_FORMAT = true;

async function main() {
  const pathToGraphqlSchema = process.argv[2];
  if (!pathToGraphqlSchema) {
    console.error("No path to graphql schema provided");
    process.exit(1);
  }
  const schemaString = readFileSync(pathToGraphqlSchema, "utf8");
  const schema = buildSchema(schemaString);

  const typeMap = Object.values(schema.getTypeMap()).filter(
    (type) => !type.name.startsWith("__")
  );

  const zodMap = new Map<string, string>(Object.entries(primitives.shape));

  const enums = typeMap.filter((type) => isEnumType(type));

  for (const e of enums) {
    const name = e.name;
    const values = e.getValues().map((value) => value.name);
    const schema = `z.enum([${values.map((value) => `"${value}"`).join(", ")}])`;
    zodMap.set(name, schema);
  }

  const unions = typeMap.filter((type) => isUnionType(type));
  for (const u of unions) {
    const name = u.name;
    const types = u
      .getTypes()
      .map((type) => type.name)
      .map((t) => `z.lazy(() => ${t}Schema)`);
    const schema = `z.union([${types.join(", ")}])`;
    zodMap.set(name, schema);
  }

  const objects = typeMap.filter((type) => isObjectType(type) || isInputObjectType(type));

  for (const o of objects) {
    zodMap.set(o.name, handleObject(o));
  }

  const schemas = Array.from(zodMap.entries()).map(([name, schema]) => {
    return `export const ${name}Schema = ${schema};`;
  });

  let result = schemas.join("\n\n");
  result = SHOULD_FORMAT
    ? await format(result, { parser: "typescript" })
    : result;
  const fileName = pathToGraphqlSchema.replace(".graphql", "-zod-schemas.ts");
  writeFileSync(
    fileName,
    `import { z } from "zod";\n\n${result}`
  );
  const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
  });
  const sourceFile = project.addSourceFileAtPath(fileName);
  const inferredTypeExports: string[] = [];
  for (const [name] of sourceFile.getExportedDeclarations()) {
    inferredTypeExports.push(
      `export type ${stripSchemaSuffix(name)} = z.infer<typeof ${name}>;\n`
    );
  }
  sourceFile.addStatements(inferredTypeExports);
  project.save();
}
await main();
