import { Project } from "ts-morph";
import { stripSchemaSuffix } from "./utils.js";

export async function addInferredTypeExports(fileName: string) {
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
  await project.save();
}