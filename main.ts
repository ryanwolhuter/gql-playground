import { addInferredTypeExports } from "./ts-morph.js";
import { addActionSchemasToZodMap, addEnumZodSchemasToZodMap, addObjectZodSchemasToZodMap, addUnionZodSchemasToZodMap, getZodSchemasFileName, makeGraphQLTypeMap, makeZodMap, makeZodSchemaStringsFromZodMap, readGraphQLSchemaFile, writeZodSchemasToFile, type Action } from "./utils.js";

async function main() {
  const pathToGraphqlSchema = process.argv[2];
  if (!pathToGraphqlSchema) {
    console.error("No path to graphql schema provided");
    process.exit(1);
  }

  const schema = await readGraphQLSchemaFile(pathToGraphqlSchema);
  const graphqlTypeMap = makeGraphQLTypeMap(schema);
  
  const zodMap = makeZodMap();
  addEnumZodSchemasToZodMap(zodMap, graphqlTypeMap);
  addUnionZodSchemasToZodMap(zodMap, graphqlTypeMap);
  addObjectZodSchemasToZodMap(zodMap, graphqlTypeMap);
  const actions: Action[] = [
    {
      type: "test create",
      scope: "test1",
      inputNameOrDefinition: "TestInputObject1"
    },
    {
      type: "test update",
      scope: "test2",
      inputNameOrDefinition: "TestInputObject2"
    }
  ]
  addActionSchemasToZodMap(zodMap, graphqlTypeMap, actions);
  const fileName = getZodSchemasFileName(pathToGraphqlSchema);
  const schemas = makeZodSchemaStringsFromZodMap(zodMap);
  await writeZodSchemasToFile(fileName, schemas);
  await addInferredTypeExports(fileName);
}
await main();
