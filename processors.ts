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
} from "graphql";
import { createStrictMatchRegex } from "./utils.js";

type OutputFieldType =
  | GraphQLScalarType
  | GraphQLEnumType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLList<OutputFieldType>
  | GraphQLNonNull<OutputFieldType>;

type InputFieldType =
  | GraphQLScalarType
  | GraphQLEnumType
  | GraphQLInputObjectType
  | GraphQLList<InputFieldType>
  | GraphQLNonNull<InputFieldType>;

export function handleOutputObject(type: GraphQLObjectType): string {
  return `z.object({ 
    ${handleOutputObjectFields(type)}
 })`;
}
export function handleInputObject(type: GraphQLInputObjectType): string {
  return `z.object({ 
  ${handleInputObjectFields(type)}
  })`;
}

function handleOutputObjectFields(objectType: GraphQLObjectType): string {
  const fields = Object.values(objectType.getFields());
  const objectTypeName = objectType.name;
  return fields
    .map((f) => handleOutputObjectField(f, objectTypeName))
    .join(",\n");
}
function handleInputObjectFields(objectType: GraphQLInputObjectType): string {
  const fields = Object.values(objectType.getFields());
  const objectTypeName = objectType.name;
  return fields
    .map((f) => handleInputObjectField(f, objectTypeName))
    .join(",\n");
}

function handleOutputObjectField(
  field: GraphQLField<OutputFieldType, any>,
  objectTypeName: string
): string {
  const fieldName = field.name;
  const fieldType = handleOutputObjectFieldType(field.type);
  const strictMatchRegex = createStrictMatchRegex(`${objectTypeName}Schema`);
  if (strictMatchRegex.test(fieldType)) {
    return `get ${fieldName}() { return ${fieldType} }`;
  }
  return `${fieldName}: ${fieldType}`;
}
function handleInputObjectField(
  field: GraphQLInputField,
  objectTypeName: string
): string {
  const fieldName = field.name;
  const fieldType = handleInputObjectFieldType(field.type);
  const strictMatchRegex = createStrictMatchRegex(`${objectTypeName}Schema`);
  if (strictMatchRegex.test(fieldType)) {
    return `get ${fieldName}() { return ${fieldType} }`;
  }
  return `${fieldName}: ${fieldType}`;
}
function handleOutputObjectFieldType(type: OutputFieldType): string {
  if (isNonNullType(type)) return handleOutputNonNullTypeField(type);
  if (isListType(type)) return handleOutputListTypeField(type, true);
  if (isScalarType(type)) return handleScalarTypeField(type, true);
  if (isEnumType(type)) return handleEnumTypeField(type, true);
  if (isUnionType(type)) return handleUnionTypeField(type, true);
  if (isObjectType(type)) return handleOutputObjectTypeField(type, true);
  return "z.unknown()";
}
function handleInputObjectFieldType(type: InputFieldType): string {
  if (isNonNullType(type)) return handleInputNonNullTypeField(type);
  if (isListType(type)) return handleInputListTypeField(type, true);
  if (isScalarType(type)) return handleScalarTypeField(type, true);
  if (isEnumType(type)) return handleEnumTypeField(type, true);
  if (isUnionType(type)) return handleUnionTypeField(type, true);
  if (isInputObjectType(type)) return handleInputObjectTypeField(type, true);
  return "z.unknown()";
}
function handleInputObjectTypeField(
  type: GraphQLInputObjectType,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `${type.name}Schema${suffix}`;
}
function handleOutputObjectTypeField(
  type: GraphQLObjectType,
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
function handleOutputListTypeField(
  type: GraphQLList<OutputFieldType>,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `z.array(${handleOutputObjectFieldType(type.ofType)})${suffix}`;
}
function handleInputListTypeField(
  type: GraphQLList<InputFieldType>,
  isOptional: boolean
): string {
  const suffix = isOptional ? ".optional()" : "";
  return `z.array(${handleInputObjectFieldType(type.ofType)})${suffix}`;
}
function handleInterfaceTypeField(type: GraphQLInterfaceType): string {
  return "z.unknown()";
}
function handleOutputNonNullTypeField(
  type: GraphQLNonNull<OutputFieldType>
): string {
  const nullableType = getNullableType(type);
  if (isNonNullType(nullableType))
    return handleOutputNonNullTypeField(nullableType);
  if (isListType(nullableType))
    return handleOutputListTypeField(nullableType, false);
  if (isScalarType(nullableType))
    return handleScalarTypeField(nullableType, false);
  if (isEnumType(nullableType)) return handleEnumTypeField(nullableType, false);
  if (isUnionType(nullableType))
    return handleUnionTypeField(nullableType, false);
  if (isObjectType(nullableType))
    return handleOutputObjectTypeField(nullableType, false);
  return "z.unknown()";
}
function handleInputNonNullTypeField(
  type: GraphQLNonNull<InputFieldType>
): string {
  const nullableType = getNullableType(type);
  if (isNonNullType(nullableType))
    return handleInputNonNullTypeField(nullableType);
  if (isListType(nullableType))
    return handleInputListTypeField(nullableType, false);
  if (isScalarType(nullableType))
    return handleScalarTypeField(nullableType, false);
  if (isEnumType(nullableType)) return handleEnumTypeField(nullableType, false);
  if (isUnionType(nullableType))
    return handleUnionTypeField(nullableType, false);
  if (isInputObjectType(nullableType))
    return handleInputObjectTypeField(nullableType, false);
  return "z.unknown()";
}
