import { z } from "zod";

export const StringSchema = z.string();

export const IntSchema = z.number();

export const FloatSchema = z.number();

export const BooleanSchema = z.boolean();

export const IDSchema = z.string();

export const UnknownSchema = z.unknown();

export const TestEnumSchema = z.enum([
  "TEST_ENUM_VALUE_1",
  "TEST_ENUM_VALUE_2",
]);

export const TestUnionSchema = z.union([
  z.lazy(() => TestOutputObject1Schema),
  z.lazy(() => TestOutputObject2Schema),
]);

export const TestOutputObject1Schema = z.object({
  nullable: StringSchema.optional(),
  nonNullable: StringSchema,
  list: z.array(StringSchema.optional()).optional(),
  listNonNullable: z.array(StringSchema).optional(),
  listNonNullableNonNullable: z.array(StringSchema),
});

export const TestOutputObject2Schema = z.object({
  nullable: StringSchema.optional(),
  nonNullable: StringSchema,
  list: z.array(StringSchema.optional()).optional(),
  listNonNullable: z.array(StringSchema).optional(),
  listNonNullableNonNullable: z.array(StringSchema),
});

export const TestOutputObjectSchema = z.object({
  nullableScalar: StringSchema.optional(),
  nonNullableScalar: StringSchema,
  listScalar: z.array(StringSchema.optional()).optional(),
  listNonNullableScalar: z.array(StringSchema).optional(),
  listNonNullableNonNullableScalar: z.array(StringSchema),
  enum: TestEnumSchema.optional(),
  enumNonNullable: TestEnumSchema,
  enumList: z.array(TestEnumSchema.optional()).optional(),
  enumListNonNullable: z.array(TestEnumSchema).optional(),
  enumListNonNullableNonNullable: z.array(TestEnumSchema),
  union: z.lazy(() => TestUnionSchema).optional(),
  unionNonNullable: z.lazy(() => TestUnionSchema),
  unionList: z.array(z.lazy(() => TestUnionSchema).optional()).optional(),
  unionListNonNullable: z.array(z.lazy(() => TestUnionSchema)).optional(),
  unionListNonNullableNonNullable: z.array(z.lazy(() => TestUnionSchema)),
  object: TestOutputObject1Schema.optional(),
  objectNonNullable: TestOutputObject1Schema,
  objectList: z.array(TestOutputObject1Schema.optional()).optional(),
  objectListNonNullable: z.array(TestOutputObject1Schema).optional(),
  objectListNonNullableNonNullable: z.array(TestOutputObject1Schema),
  get recursive() {
    return TestOutputObjectSchema.optional();
  },
});

export const TestInputObject1Schema = z.object({
  nullable: StringSchema.optional(),
  nonNullable: StringSchema,
  list: z.array(StringSchema.optional()).optional(),
  listNonNullable: z.array(StringSchema).optional(),
  listNonNullableNonNullable: z.array(StringSchema),
});

export const TestInputObject2Schema = z.object({
  nullable: StringSchema.optional(),
  nonNullable: StringSchema,
  list: z.array(StringSchema.optional()).optional(),
  listNonNullable: z.array(StringSchema).optional(),
  listNonNullableNonNullable: z.array(StringSchema),
});

export const TestInputObjectSchema = z.object({
  nullableScalar: StringSchema.optional(),
  nonNullableScalar: StringSchema,
  listScalar: z.array(StringSchema.optional()).optional(),
  listNonNullableScalar: z.array(StringSchema).optional(),
  listNonNullableNonNullableScalar: z.array(StringSchema),
  enum: TestEnumSchema.optional(),
  enumNonNullable: TestEnumSchema,
  enumList: z.array(TestEnumSchema.optional()).optional(),
  enumListNonNullable: z.array(TestEnumSchema).optional(),
  enumListNonNullableNonNullable: z.array(TestEnumSchema),
  object: TestInputObject1Schema.optional(),
  objectNonNullable: TestInputObject1Schema,
  objectList: z.array(TestInputObject1Schema.optional()).optional(),
  objectListNonNullable: z.array(TestInputObject1Schema).optional(),
  objectListNonNullableNonNullable: z.array(TestInputObject1Schema),
  get recursive() {
    return TestInputObjectSchema.optional();
  },
});
export type String = z.infer<typeof StringSchema>;
export type Int = z.infer<typeof IntSchema>;
export type Float = z.infer<typeof FloatSchema>;
export type Boolean = z.infer<typeof BooleanSchema>;
export type ID = z.infer<typeof IDSchema>;
export type Unknown = z.infer<typeof UnknownSchema>;
export type TestEnum = z.infer<typeof TestEnumSchema>;
export type TestUnion = z.infer<typeof TestUnionSchema>;
export type TestOutputObject1 = z.infer<typeof TestOutputObject1Schema>;
export type TestOutputObject2 = z.infer<typeof TestOutputObject2Schema>;
export type TestOutputObject = z.infer<typeof TestOutputObjectSchema>;
export type TestInputObject1 = z.infer<typeof TestInputObject1Schema>;
export type TestInputObject2 = z.infer<typeof TestInputObject2Schema>;
export type TestInputObject = z.infer<typeof TestInputObjectSchema>;

