import {
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
  type GraphQLField,
  type GraphQLInputField,
  isNonNullType,
  isListType,
  isScalarType,
  isEnumType,
  isUnionType,
  isObjectType,
  isInputObjectType,
  getNullableType,
  type GraphQLType,
} from "graphql";
import { createStrictMatchRegex } from "./utils.js";

export function handleObject(type: GraphQLObjectType | GraphQLInputObjectType): string {
  return `z.object({ 
  ${handleObjectFields(type)}
  })`;
}

function handleObjectFields(
  objectType: GraphQLObjectType | GraphQLInputObjectType
): string {
  const fields = Object.values(objectType.getFields());
  const objectTypeName = objectType.name;
  return fields
    .map((f) => handleObjectField(f, objectTypeName))
    .join(",\n");
}
function handleObjectField(
  field: GraphQLField<GraphQLType, any>,
  objectTypeName: string
): string {
  const fieldName = field.name;
  const fieldType = handleObjectFieldType(field.type);
  const strictMatchRegex = createStrictMatchRegex(`${objectTypeName}Schema`);
  if (strictMatchRegex.test(fieldType)) {
    return `get ${fieldName}() { return ${fieldType} }`;
  }
  return `${fieldName}: ${fieldType}`;
}
function handleObjectFieldType(type: GraphQLType): string {
  if (isNonNullType(type)) return handleNonNullTypeField(type);
  if (isListType(type)) return handleListTypeField(type, true);
  if (isScalarType(type)) return handleScalarTypeField(type, true);
  if (isEnumType(type)) return handleEnumTypeField(type, true);
  if (isUnionType(type)) return handleUnionTypeField(type, true);
  if (isObjectType(type)) return handleObjectTypeField(type, true);
  if (isInputObjectType(type)) return handleObjectTypeField(type, true);
  return "z.unknown()";
}
function handleObjectTypeField(
  type: GraphQLObjectType | GraphQLInputObjectType,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `${type.name}Schema${suffix}`;
}

function handleScalarTypeField(
  type: GraphQLScalarType,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `${type.name}Schema${suffix}`;
}
function handleEnumTypeField(
  type: GraphQLEnumType,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `${type.name}Schema${suffix}`;
}

function handleUnionTypeField(
  type: GraphQLUnionType,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `z.lazy(() => ${type.name}Schema)${suffix}`;
}
function handleListTypeField(
  type: GraphQLList<GraphQLType>,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `z.array(${handleObjectFieldType(type.ofType)})${suffix}`;
}
function handleInterfaceTypeField(type: GraphQLInterfaceType): string {
  return "z.unknown()";
}
function handleNonNullTypeField(
  type: GraphQLNonNull<GraphQLType>
): string {
  const nullableType = getNullableType(type);
  if (isNonNullType(nullableType))
    return handleNonNullTypeField(nullableType);
  if (isEnumType(nullableType)) return handleEnumTypeField(nullableType, false);
  if (isScalarType(nullableType))
    return handleScalarTypeField(nullableType, false);
  if (isListType(nullableType))
    return handleListTypeField(nullableType, false);
  if (isUnionType(nullableType))
    return handleUnionTypeField(nullableType, false);
  if (isObjectType(nullableType) || isInputObjectType(nullableType))
    return handleObjectTypeField(nullableType, false);
  return "z.unknown()";
}
