import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','password','role','isTwoFactorEnabled']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['id','email','token','expires']);

export const PasswordResetTokenScalarFieldEnumSchema = z.enum(['id','email','token','expires']);

export const TwoFactorTokenScalarFieldEnumSchema = z.enum(['id','email','token','expires']);

export const TwoFactorConfirmationScalarFieldEnumSchema = z.enum(['id','userId']);

export const UserPromptHistoryScalarFieldEnumSchema = z.enum(['id','userId','type','batchSize','prompt','negativePrompt','width','height','nIter','steps','seed','samplerName','cfgScale','denoisingStrength','initImages','controlMode','resizeMode','alwaysonScripts','createdAt']);

export const UserPromptResultScalarFieldEnumSchema = z.enum(['id','userPromptHistoryId','images','parameters','info','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const UserRoleSchema = z.enum(['ADMIN','USER']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  password: z.string().nullable(),
  isTwoFactorEnabled: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// PASSWORD RESET TOKEN SCHEMA
/////////////////////////////////////////

export const PasswordResetTokenSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type PasswordResetToken = z.infer<typeof PasswordResetTokenSchema>

/////////////////////////////////////////
// TWO FACTOR TOKEN SCHEMA
/////////////////////////////////////////

export const TwoFactorTokenSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type TwoFactorToken = z.infer<typeof TwoFactorTokenSchema>

/////////////////////////////////////////
// TWO FACTOR CONFIRMATION SCHEMA
/////////////////////////////////////////

export const TwoFactorConfirmationSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
})

export type TwoFactorConfirmation = z.infer<typeof TwoFactorConfirmationSchema>

/////////////////////////////////////////
// USER PROMPT HISTORY SCHEMA
/////////////////////////////////////////

export const UserPromptHistorySchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().nullable(),
  initImages: z.string().array(),
  controlMode: z.number().int().nullable(),
  resizeMode: z.number().int().nullable(),
  alwaysonScripts: JsonValueSchema,
  createdAt: z.coerce.date(),
})

export type UserPromptHistory = z.infer<typeof UserPromptHistorySchema>

/////////////////////////////////////////
// USER PROMPT RESULT SCHEMA
/////////////////////////////////////////

export const UserPromptResultSchema = z.object({
  id: z.string().cuid(),
  userPromptHistoryId: z.string(),
  images: z.string().array(),
  parameters: JsonValueSchema.nullable(),
  info: z.string(),
  createdAt: z.coerce.date(),
})

export type UserPromptResult = z.infer<typeof UserPromptResultSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  twoFactorConfirmation: z.union([z.boolean(),z.lazy(() => TwoFactorConfirmationArgsSchema)]).optional(),
  userPromptHistory: z.union([z.boolean(),z.lazy(() => UserPromptHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  userPromptHistory: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  password: z.boolean().optional(),
  role: z.boolean().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  twoFactorConfirmation: z.union([z.boolean(),z.lazy(() => TwoFactorConfirmationArgsSchema)]).optional(),
  userPromptHistory: z.union([z.boolean(),z.lazy(() => UserPromptHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// PASSWORD RESET TOKEN
//------------------------------------------------------

export const PasswordResetTokenSelectSchema: z.ZodType<Prisma.PasswordResetTokenSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// TWO FACTOR TOKEN
//------------------------------------------------------

export const TwoFactorTokenSelectSchema: z.ZodType<Prisma.TwoFactorTokenSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// TWO FACTOR CONFIRMATION
//------------------------------------------------------

export const TwoFactorConfirmationIncludeSchema: z.ZodType<Prisma.TwoFactorConfirmationInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const TwoFactorConfirmationArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationDefaultArgs> = z.object({
  select: z.lazy(() => TwoFactorConfirmationSelectSchema).optional(),
  include: z.lazy(() => TwoFactorConfirmationIncludeSchema).optional(),
}).strict();

export const TwoFactorConfirmationSelectSchema: z.ZodType<Prisma.TwoFactorConfirmationSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER PROMPT HISTORY
//------------------------------------------------------

export const UserPromptHistoryIncludeSchema: z.ZodType<Prisma.UserPromptHistoryInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  userPromptResult: z.union([z.boolean(),z.lazy(() => UserPromptResultArgsSchema)]).optional(),
}).strict()

export const UserPromptHistoryArgsSchema: z.ZodType<Prisma.UserPromptHistoryDefaultArgs> = z.object({
  select: z.lazy(() => UserPromptHistorySelectSchema).optional(),
  include: z.lazy(() => UserPromptHistoryIncludeSchema).optional(),
}).strict();

export const UserPromptHistorySelectSchema: z.ZodType<Prisma.UserPromptHistorySelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  batchSize: z.boolean().optional(),
  prompt: z.boolean().optional(),
  negativePrompt: z.boolean().optional(),
  width: z.boolean().optional(),
  height: z.boolean().optional(),
  nIter: z.boolean().optional(),
  steps: z.boolean().optional(),
  seed: z.boolean().optional(),
  samplerName: z.boolean().optional(),
  cfgScale: z.boolean().optional(),
  denoisingStrength: z.boolean().optional(),
  initImages: z.boolean().optional(),
  controlMode: z.boolean().optional(),
  resizeMode: z.boolean().optional(),
  alwaysonScripts: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  userPromptResult: z.union([z.boolean(),z.lazy(() => UserPromptResultArgsSchema)]).optional(),
}).strict()

// USER PROMPT RESULT
//------------------------------------------------------

export const UserPromptResultIncludeSchema: z.ZodType<Prisma.UserPromptResultInclude> = z.object({
  userPromptHistory: z.union([z.boolean(),z.lazy(() => UserPromptHistoryArgsSchema)]).optional(),
}).strict()

export const UserPromptResultArgsSchema: z.ZodType<Prisma.UserPromptResultDefaultArgs> = z.object({
  select: z.lazy(() => UserPromptResultSelectSchema).optional(),
  include: z.lazy(() => UserPromptResultIncludeSchema).optional(),
}).strict();

export const UserPromptResultSelectSchema: z.ZodType<Prisma.UserPromptResultSelect> = z.object({
  id: z.boolean().optional(),
  userPromptHistoryId: z.boolean().optional(),
  images: z.boolean().optional(),
  parameters: z.boolean().optional(),
  info: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userPromptHistory: z.union([z.boolean(),z.lazy(() => UserPromptHistoryArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    sessionToken: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    sessionToken: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  twoFactorConfirmation: z.union([ z.lazy(() => TwoFactorConfirmationNullableRelationFilterSchema),z.lazy(() => TwoFactorConfirmationWhereInputSchema) ]).optional().nullable(),
  userPromptHistory: z.lazy(() => UserPromptHistoryListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  isTwoFactorEnabled: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationOrderByWithRelationInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  twoFactorConfirmation: z.union([ z.lazy(() => TwoFactorConfirmationNullableRelationFilterSchema),z.lazy(() => TwoFactorConfirmationWhereInputSchema) ]).optional().nullable(),
  userPromptHistory: z.lazy(() => UserPromptHistoryListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  isTwoFactorEnabled: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string(),
    email_token: z.lazy(() => VerificationTokenEmailTokenCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
    token: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email_token: z.lazy(() => VerificationTokenEmailTokenCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
    email_token: z.lazy(() => VerificationTokenEmailTokenCompoundUniqueInputSchema),
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    email_token: z.lazy(() => VerificationTokenEmailTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  email_token: z.lazy(() => VerificationTokenEmailTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PasswordResetTokenWhereInputSchema: z.ZodType<Prisma.PasswordResetTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PasswordResetTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenWhereUniqueInputSchema: z.ZodType<Prisma.PasswordResetTokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string(),
    email_token: z.lazy(() => PasswordResetTokenEmailTokenCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
    token: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email_token: z.lazy(() => PasswordResetTokenEmailTokenCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
    email_token: z.lazy(() => PasswordResetTokenEmailTokenCompoundUniqueInputSchema),
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    email_token: z.lazy(() => PasswordResetTokenEmailTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  email_token: z.lazy(() => PasswordResetTokenEmailTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const PasswordResetTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PasswordResetTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PasswordResetTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PasswordResetTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const PasswordResetTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PasswordResetTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TwoFactorTokenWhereInputSchema: z.ZodType<Prisma.TwoFactorTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TwoFactorTokenWhereInputSchema),z.lazy(() => TwoFactorTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TwoFactorTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TwoFactorTokenWhereInputSchema),z.lazy(() => TwoFactorTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TwoFactorTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.TwoFactorTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorTokenWhereUniqueInputSchema: z.ZodType<Prisma.TwoFactorTokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    token: z.string(),
    email_token: z.lazy(() => TwoFactorTokenEmailTokenCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
    token: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email_token: z.lazy(() => TwoFactorTokenEmailTokenCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    token: z.string(),
    email_token: z.lazy(() => TwoFactorTokenEmailTokenCompoundUniqueInputSchema),
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    email_token: z.lazy(() => TwoFactorTokenEmailTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  token: z.string().optional(),
  email_token: z.lazy(() => TwoFactorTokenEmailTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => TwoFactorTokenWhereInputSchema),z.lazy(() => TwoFactorTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TwoFactorTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TwoFactorTokenWhereInputSchema),z.lazy(() => TwoFactorTokenWhereInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const TwoFactorTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.TwoFactorTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TwoFactorTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TwoFactorTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TwoFactorTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const TwoFactorTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TwoFactorTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TwoFactorTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => TwoFactorTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TwoFactorTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TwoFactorTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => TwoFactorTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TwoFactorConfirmationWhereInputSchema: z.ZodType<Prisma.TwoFactorConfirmationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TwoFactorConfirmationWhereInputSchema),z.lazy(() => TwoFactorConfirmationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TwoFactorConfirmationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TwoFactorConfirmationWhereInputSchema),z.lazy(() => TwoFactorConfirmationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const TwoFactorConfirmationOrderByWithRelationInputSchema: z.ZodType<Prisma.TwoFactorConfirmationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const TwoFactorConfirmationWhereUniqueInputSchema: z.ZodType<Prisma.TwoFactorConfirmationWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    userId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => TwoFactorConfirmationWhereInputSchema),z.lazy(() => TwoFactorConfirmationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TwoFactorConfirmationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TwoFactorConfirmationWhereInputSchema),z.lazy(() => TwoFactorConfirmationWhereInputSchema).array() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const TwoFactorConfirmationOrderByWithAggregationInputSchema: z.ZodType<Prisma.TwoFactorConfirmationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TwoFactorConfirmationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TwoFactorConfirmationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TwoFactorConfirmationMinOrderByAggregateInputSchema).optional()
}).strict();

export const TwoFactorConfirmationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TwoFactorConfirmationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TwoFactorConfirmationScalarWhereWithAggregatesInputSchema),z.lazy(() => TwoFactorConfirmationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TwoFactorConfirmationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TwoFactorConfirmationScalarWhereWithAggregatesInputSchema),z.lazy(() => TwoFactorConfirmationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserPromptHistoryWhereInputSchema: z.ZodType<Prisma.UserPromptHistoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserPromptHistoryWhereInputSchema),z.lazy(() => UserPromptHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptHistoryWhereInputSchema),z.lazy(() => UserPromptHistoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  batchSize: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  negativePrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  width: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  nIter: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  steps: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  seed: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  samplerName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cfgScale: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  denoisingStrength: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  initImages: z.lazy(() => StringNullableListFilterSchema).optional(),
  controlMode: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  resizeMode: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  alwaysonScripts: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  userPromptResult: z.union([ z.lazy(() => UserPromptResultNullableRelationFilterSchema),z.lazy(() => UserPromptResultWhereInputSchema) ]).optional().nullable(),
}).strict();

export const UserPromptHistoryOrderByWithRelationInputSchema: z.ZodType<Prisma.UserPromptHistoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  negativePrompt: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  samplerName: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  initImages: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  resizeMode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  alwaysonScripts: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  userPromptResult: z.lazy(() => UserPromptResultOrderByWithRelationInputSchema).optional()
}).strict();

export const UserPromptHistoryWhereUniqueInputSchema: z.ZodType<Prisma.UserPromptHistoryWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => UserPromptHistoryWhereInputSchema),z.lazy(() => UserPromptHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptHistoryWhereInputSchema),z.lazy(() => UserPromptHistoryWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  batchSize: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  negativePrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  width: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  height: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  nIter: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  steps: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  seed: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  samplerName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cfgScale: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  denoisingStrength: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  initImages: z.lazy(() => StringNullableListFilterSchema).optional(),
  controlMode: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  resizeMode: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  alwaysonScripts: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  userPromptResult: z.union([ z.lazy(() => UserPromptResultNullableRelationFilterSchema),z.lazy(() => UserPromptResultWhereInputSchema) ]).optional().nullable(),
}).strict());

export const UserPromptHistoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserPromptHistoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  negativePrompt: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  samplerName: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  initImages: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  resizeMode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  alwaysonScripts: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserPromptHistoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserPromptHistoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserPromptHistoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserPromptHistoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserPromptHistorySumOrderByAggregateInputSchema).optional()
}).strict();

export const UserPromptHistoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserPromptHistoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserPromptHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => UserPromptHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptHistoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => UserPromptHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  batchSize: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  prompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  negativePrompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  width: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  nIter: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  steps: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  seed: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  samplerName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  cfgScale: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  denoisingStrength: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  initImages: z.lazy(() => StringNullableListFilterSchema).optional(),
  controlMode: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  resizeMode: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  alwaysonScripts: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserPromptResultWhereInputSchema: z.ZodType<Prisma.UserPromptResultWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserPromptResultWhereInputSchema),z.lazy(() => UserPromptResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptResultWhereInputSchema),z.lazy(() => UserPromptResultWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPromptHistoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  parameters: z.lazy(() => JsonFilterSchema).optional(),
  info: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userPromptHistory: z.union([ z.lazy(() => UserPromptHistoryRelationFilterSchema),z.lazy(() => UserPromptHistoryWhereInputSchema) ]).optional(),
}).strict();

export const UserPromptResultOrderByWithRelationInputSchema: z.ZodType<Prisma.UserPromptResultOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userPromptHistoryId: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  parameters: z.lazy(() => SortOrderSchema).optional(),
  info: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryOrderByWithRelationInputSchema).optional()
}).strict();

export const UserPromptResultWhereUniqueInputSchema: z.ZodType<Prisma.UserPromptResultWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    userPromptHistoryId: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    userPromptHistoryId: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  userPromptHistoryId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserPromptResultWhereInputSchema),z.lazy(() => UserPromptResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptResultWhereInputSchema),z.lazy(() => UserPromptResultWhereInputSchema).array() ]).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  parameters: z.lazy(() => JsonFilterSchema).optional(),
  info: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userPromptHistory: z.union([ z.lazy(() => UserPromptHistoryRelationFilterSchema),z.lazy(() => UserPromptHistoryWhereInputSchema) ]).optional(),
}).strict());

export const UserPromptResultOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserPromptResultOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userPromptHistoryId: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  parameters: z.lazy(() => SortOrderSchema).optional(),
  info: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserPromptResultCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserPromptResultMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserPromptResultMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserPromptResultScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserPromptResultScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserPromptResultScalarWhereWithAggregatesInputSchema),z.lazy(() => UserPromptResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptResultScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptResultScalarWhereWithAggregatesInputSchema),z.lazy(() => UserPromptResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userPromptHistoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  images: z.lazy(() => StringNullableListFilterSchema).optional(),
  parameters: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  info: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationCreateNestedOneWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUpdateOneWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenCreateInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const PasswordResetTokenUncheckedCreateInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const PasswordResetTokenUpdateInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenCreateManyInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const PasswordResetTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorTokenCreateInputSchema: z.ZodType<Prisma.TwoFactorTokenCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const TwoFactorTokenUncheckedCreateInputSchema: z.ZodType<Prisma.TwoFactorTokenUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const TwoFactorTokenUpdateInputSchema: z.ZodType<Prisma.TwoFactorTokenUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.TwoFactorTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorTokenCreateManyInputSchema: z.ZodType<Prisma.TwoFactorTokenCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const TwoFactorTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.TwoFactorTokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TwoFactorTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorConfirmationCreateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTwoFactorConfirmationInputSchema)
}).strict();

export const TwoFactorConfirmationUncheckedCreateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string()
}).strict();

export const TwoFactorConfirmationUpdateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutTwoFactorConfirmationNestedInputSchema).optional()
}).strict();

export const TwoFactorConfirmationUncheckedUpdateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorConfirmationCreateManyInputSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string()
}).strict();

export const TwoFactorConfirmationUpdateManyMutationInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorConfirmationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryCreateInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserPromptHistoryInputSchema),
  userPromptResult: z.lazy(() => UserPromptResultCreateNestedOneWithoutUserPromptHistoryInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedCreateInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  userPromptResult: z.lazy(() => UserPromptResultUncheckedCreateNestedOneWithoutUserPromptHistoryInputSchema).optional()
}).strict();

export const UserPromptHistoryUpdateInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserPromptHistoryNestedInputSchema).optional(),
  userPromptResult: z.lazy(() => UserPromptResultUpdateOneWithoutUserPromptHistoryNestedInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedUpdateInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userPromptResult: z.lazy(() => UserPromptResultUncheckedUpdateOneWithoutUserPromptHistoryNestedInputSchema).optional()
}).strict();

export const UserPromptHistoryCreateManyInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserPromptHistoryUpdateManyMutationInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptResultCreateInputSchema: z.ZodType<Prisma.UserPromptResultCreateInput> = z.object({
  id: z.string().cuid().optional(),
  images: z.union([ z.lazy(() => UserPromptResultCreateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  info: z.string(),
  createdAt: z.coerce.date().optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryCreateNestedOneWithoutUserPromptResultInputSchema)
}).strict();

export const UserPromptResultUncheckedCreateInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userPromptHistoryId: z.string(),
  images: z.union([ z.lazy(() => UserPromptResultCreateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  info: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserPromptResultUpdateInputSchema: z.ZodType<Prisma.UserPromptResultUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  images: z.union([ z.lazy(() => UserPromptResultUpdateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  info: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUpdateOneRequiredWithoutUserPromptResultNestedInputSchema).optional()
}).strict();

export const UserPromptResultUncheckedUpdateInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPromptHistoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  images: z.union([ z.lazy(() => UserPromptResultUpdateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  info: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptResultCreateManyInputSchema: z.ZodType<Prisma.UserPromptResultCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userPromptHistoryId: z.string(),
  images: z.union([ z.lazy(() => UserPromptResultCreateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  info: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserPromptResultUpdateManyMutationInputSchema: z.ZodType<Prisma.UserPromptResultUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  images: z.union([ z.lazy(() => UserPromptResultUpdateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  info: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptResultUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPromptHistoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  images: z.union([ z.lazy(() => UserPromptResultUpdateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  info: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const TwoFactorConfirmationNullableRelationFilterSchema: z.ZodType<Prisma.TwoFactorConfirmationNullableRelationFilter> = z.object({
  is: z.lazy(() => TwoFactorConfirmationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TwoFactorConfirmationWhereInputSchema).optional().nullable()
}).strict();

export const UserPromptHistoryListRelationFilterSchema: z.ZodType<Prisma.UserPromptHistoryListRelationFilter> = z.object({
  every: z.lazy(() => UserPromptHistoryWhereInputSchema).optional(),
  some: z.lazy(() => UserPromptHistoryWhereInputSchema).optional(),
  none: z.lazy(() => UserPromptHistoryWhereInputSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptHistoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserPromptHistoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  isTwoFactorEnabled: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  isTwoFactorEnabled: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  isTwoFactorEnabled: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const VerificationTokenEmailTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenEmailTokenCompoundUniqueInput> = z.object({
  email: z.string(),
  token: z.string()
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenEmailTokenCompoundUniqueInputSchema: z.ZodType<Prisma.PasswordResetTokenEmailTokenCompoundUniqueInput> = z.object({
  email: z.string(),
  token: z.string()
}).strict();

export const PasswordResetTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorTokenEmailTokenCompoundUniqueInputSchema: z.ZodType<Prisma.TwoFactorTokenEmailTokenCompoundUniqueInput> = z.object({
  email: z.string(),
  token: z.string()
}).strict();

export const TwoFactorTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.TwoFactorTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TwoFactorTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.TwoFactorTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorConfirmationCountOrderByAggregateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorConfirmationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TwoFactorConfirmationMinOrderByAggregateInputSchema: z.ZodType<Prisma.TwoFactorConfirmationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const BigIntFilterSchema: z.ZodType<Prisma.BigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const UserPromptResultNullableRelationFilterSchema: z.ZodType<Prisma.UserPromptResultNullableRelationFilter> = z.object({
  is: z.lazy(() => UserPromptResultWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserPromptResultWhereInputSchema).optional().nullable()
}).strict();

export const UserPromptHistoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptHistoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  negativePrompt: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  samplerName: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.lazy(() => SortOrderSchema).optional(),
  initImages: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.lazy(() => SortOrderSchema).optional(),
  resizeMode: z.lazy(() => SortOrderSchema).optional(),
  alwaysonScripts: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptHistoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptHistoryAvgOrderByAggregateInput> = z.object({
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.lazy(() => SortOrderSchema).optional(),
  resizeMode: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptHistoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptHistoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  negativePrompt: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  samplerName: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.lazy(() => SortOrderSchema).optional(),
  resizeMode: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptHistoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptHistoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  negativePrompt: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  samplerName: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.lazy(() => SortOrderSchema).optional(),
  resizeMode: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptHistorySumOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptHistorySumOrderByAggregateInput> = z.object({
  batchSize: z.lazy(() => SortOrderSchema).optional(),
  width: z.lazy(() => SortOrderSchema).optional(),
  height: z.lazy(() => SortOrderSchema).optional(),
  nIter: z.lazy(() => SortOrderSchema).optional(),
  steps: z.lazy(() => SortOrderSchema).optional(),
  seed: z.lazy(() => SortOrderSchema).optional(),
  cfgScale: z.lazy(() => SortOrderSchema).optional(),
  denoisingStrength: z.lazy(() => SortOrderSchema).optional(),
  controlMode: z.lazy(() => SortOrderSchema).optional(),
  resizeMode: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const BigIntWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const UserPromptHistoryRelationFilterSchema: z.ZodType<Prisma.UserPromptHistoryRelationFilter> = z.object({
  is: z.lazy(() => UserPromptHistoryWhereInputSchema).optional(),
  isNot: z.lazy(() => UserPromptHistoryWhereInputSchema).optional()
}).strict();

export const UserPromptResultCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptResultCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userPromptHistoryId: z.lazy(() => SortOrderSchema).optional(),
  images: z.lazy(() => SortOrderSchema).optional(),
  parameters: z.lazy(() => SortOrderSchema).optional(),
  info: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptResultMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptResultMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userPromptHistoryId: z.lazy(() => SortOrderSchema).optional(),
  info: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserPromptResultMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserPromptResultMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userPromptHistoryId: z.lazy(() => SortOrderSchema).optional(),
  info: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TwoFactorConfirmationCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TwoFactorConfirmationCreateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TwoFactorConfirmationCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => TwoFactorConfirmationWhereUniqueInputSchema).optional()
}).strict();

export const UserPromptHistoryCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserPromptHistoryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TwoFactorConfirmationUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TwoFactorConfirmationCreateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TwoFactorConfirmationCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => TwoFactorConfirmationWhereUniqueInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserPromptHistoryCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TwoFactorConfirmationUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TwoFactorConfirmationCreateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TwoFactorConfirmationCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => TwoFactorConfirmationUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TwoFactorConfirmationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TwoFactorConfirmationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TwoFactorConfirmationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TwoFactorConfirmationUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUpdateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserPromptHistoryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserPromptHistoryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserPromptHistoryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserPromptHistoryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserPromptHistoryScalarWhereInputSchema),z.lazy(() => UserPromptHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TwoFactorConfirmationUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TwoFactorConfirmationCreateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TwoFactorConfirmationCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => TwoFactorConfirmationUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TwoFactorConfirmationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TwoFactorConfirmationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TwoFactorConfirmationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TwoFactorConfirmationUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUpdateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema).array(),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserPromptHistoryUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserPromptHistoryCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserPromptHistoryUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserPromptHistoryUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserPromptHistoryScalarWhereInputSchema),z.lazy(() => UserPromptHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTwoFactorConfirmationInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedCreateWithoutTwoFactorConfirmationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTwoFactorConfirmationInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutTwoFactorConfirmationNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTwoFactorConfirmationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedCreateWithoutTwoFactorConfirmationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTwoFactorConfirmationInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTwoFactorConfirmationInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUpdateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTwoFactorConfirmationInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryCreateinitImagesInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateinitImagesInput> = z.object({
  set: z.string().array()
}).strict();

export const UserCreateNestedOneWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserPromptHistoryInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserPromptHistoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserPromptHistoryInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserPromptResultCreateNestedOneWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultCreateNestedOneWithoutUserPromptHistoryInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptResultCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserPromptResultCreateOrConnectWithoutUserPromptHistoryInputSchema).optional(),
  connect: z.lazy(() => UserPromptResultWhereUniqueInputSchema).optional()
}).strict();

export const UserPromptResultUncheckedCreateNestedOneWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedCreateNestedOneWithoutUserPromptHistoryInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptResultCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserPromptResultCreateOrConnectWithoutUserPromptHistoryInputSchema).optional(),
  connect: z.lazy(() => UserPromptResultWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const BigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BigIntFieldUpdateOperationsInput> = z.object({
  set: z.bigint().optional(),
  increment: z.bigint().optional(),
  decrement: z.bigint().optional(),
  multiply: z.bigint().optional(),
  divide: z.bigint().optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserPromptHistoryUpdateinitImagesInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateinitImagesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutUserPromptHistoryNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserPromptHistoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserPromptHistoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserPromptHistoryInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserPromptHistoryInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]).optional(),
}).strict();

export const UserPromptResultUpdateOneWithoutUserPromptHistoryNestedInputSchema: z.ZodType<Prisma.UserPromptResultUpdateOneWithoutUserPromptHistoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptResultCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserPromptResultCreateOrConnectWithoutUserPromptHistoryInputSchema).optional(),
  upsert: z.lazy(() => UserPromptResultUpsertWithoutUserPromptHistoryInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserPromptResultWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserPromptResultWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserPromptResultWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserPromptResultUpdateToOneWithWhereWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]).optional(),
}).strict();

export const UserPromptResultUncheckedUpdateOneWithoutUserPromptHistoryNestedInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedUpdateOneWithoutUserPromptHistoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptResultCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserPromptResultCreateOrConnectWithoutUserPromptHistoryInputSchema).optional(),
  upsert: z.lazy(() => UserPromptResultUpsertWithoutUserPromptHistoryInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserPromptResultWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserPromptResultWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserPromptResultWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserPromptResultUpdateToOneWithWhereWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]).optional(),
}).strict();

export const UserPromptResultCreateimagesInputSchema: z.ZodType<Prisma.UserPromptResultCreateimagesInput> = z.object({
  set: z.string().array()
}).strict();

export const UserPromptHistoryCreateNestedOneWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateNestedOneWithoutUserPromptResultInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserPromptResultInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserPromptResultInputSchema).optional(),
  connect: z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).optional()
}).strict();

export const UserPromptResultUpdateimagesInputSchema: z.ZodType<Prisma.UserPromptResultUpdateimagesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const UserPromptHistoryUpdateOneRequiredWithoutUserPromptResultNestedInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateOneRequiredWithoutUserPromptResultNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserPromptResultInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserPromptHistoryCreateOrConnectWithoutUserPromptResultInputSchema).optional(),
  upsert: z.lazy(() => UserPromptHistoryUpsertWithoutUserPromptResultInputSchema).optional(),
  connect: z.lazy(() => UserPromptHistoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserPromptHistoryUpdateToOneWithWhereWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUpdateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedUpdateWithoutUserPromptResultInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedBigIntFilterSchema: z.ZodType<Prisma.NestedBigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedBigIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationCreateNestedOneWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUpdateOneWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationCreateNestedOneWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUpdateOneWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TwoFactorConfirmationCreateWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional()
}).strict();

export const TwoFactorConfirmationCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => TwoFactorConfirmationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TwoFactorConfirmationCreateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserPromptHistoryCreateWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  userPromptResult: z.lazy(() => UserPromptResultCreateNestedOneWithoutUserPromptHistoryInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  userPromptResult: z.lazy(() => UserPromptResultUncheckedCreateNestedOneWithoutUserPromptHistoryInputSchema).optional()
}).strict();

export const UserPromptHistoryCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserPromptHistoryCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserPromptHistoryCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserPromptHistoryCreateManyUserInputSchema),z.lazy(() => UserPromptHistoryCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TwoFactorConfirmationUpsertWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => TwoFactorConfirmationUpdateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => TwoFactorConfirmationCreateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => TwoFactorConfirmationWhereInputSchema).optional()
}).strict();

export const TwoFactorConfirmationUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => TwoFactorConfirmationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TwoFactorConfirmationUpdateWithoutUserInputSchema),z.lazy(() => TwoFactorConfirmationUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const TwoFactorConfirmationUpdateWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TwoFactorConfirmationUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TwoFactorConfirmationUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserPromptHistoryUpdateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserPromptHistoryUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserPromptHistoryUpdateWithoutUserInputSchema),z.lazy(() => UserPromptHistoryUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserPromptHistoryUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserPromptHistoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserPromptHistoryUpdateManyMutationInputSchema),z.lazy(() => UserPromptHistoryUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UserPromptHistoryScalarWhereInputSchema: z.ZodType<Prisma.UserPromptHistoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserPromptHistoryScalarWhereInputSchema),z.lazy(() => UserPromptHistoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserPromptHistoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserPromptHistoryScalarWhereInputSchema),z.lazy(() => UserPromptHistoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  batchSize: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  negativePrompt: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  width: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  height: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  nIter: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  steps: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  seed: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  samplerName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  cfgScale: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  denoisingStrength: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  initImages: z.lazy(() => StringNullableListFilterSchema).optional(),
  controlMode: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  resizeMode: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  alwaysonScripts: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserCreateWithoutTwoFactorConfirmationInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTwoFactorConfirmationInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTwoFactorConfirmationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedCreateWithoutTwoFactorConfirmationInputSchema) ]),
}).strict();

export const UserUpsertWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserUpsertWithoutTwoFactorConfirmationInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTwoFactorConfirmationInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedCreateWithoutTwoFactorConfirmationInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTwoFactorConfirmationInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTwoFactorConfirmationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTwoFactorConfirmationInputSchema) ]),
}).strict();

export const UserUpdateWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserUpdateWithoutTwoFactorConfirmationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTwoFactorConfirmationInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTwoFactorConfirmationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  userPromptHistory: z.lazy(() => UserPromptHistoryUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserCreateWithoutUserPromptHistoryInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserPromptHistoryInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.lazy(() => UserRoleSchema).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserPromptHistoryInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserPromptHistoryInputSchema) ]),
}).strict();

export const UserPromptResultCreateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultCreateWithoutUserPromptHistoryInput> = z.object({
  id: z.string().cuid().optional(),
  images: z.union([ z.lazy(() => UserPromptResultCreateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  info: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedCreateWithoutUserPromptHistoryInput> = z.object({
  id: z.string().cuid().optional(),
  images: z.union([ z.lazy(() => UserPromptResultCreateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  info: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserPromptResultCreateOrConnectWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultCreateOrConnectWithoutUserPromptHistoryInput> = z.object({
  where: z.lazy(() => UserPromptResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserPromptResultCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema) ]),
}).strict();

export const UserUpsertWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserPromptHistoryInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserPromptHistoryInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserPromptHistoryInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]),
}).strict();

export const UserUpdateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserPromptHistoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserPromptHistoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  isTwoFactorEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  twoFactorConfirmation: z.lazy(() => TwoFactorConfirmationUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserPromptResultUpsertWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultUpsertWithoutUserPromptHistoryInput> = z.object({
  update: z.union([ z.lazy(() => UserPromptResultUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]),
  create: z.union([ z.lazy(() => UserPromptResultCreateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedCreateWithoutUserPromptHistoryInputSchema) ]),
  where: z.lazy(() => UserPromptResultWhereInputSchema).optional()
}).strict();

export const UserPromptResultUpdateToOneWithWhereWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultUpdateToOneWithWhereWithoutUserPromptHistoryInput> = z.object({
  where: z.lazy(() => UserPromptResultWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserPromptResultUpdateWithoutUserPromptHistoryInputSchema),z.lazy(() => UserPromptResultUncheckedUpdateWithoutUserPromptHistoryInputSchema) ]),
}).strict();

export const UserPromptResultUpdateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultUpdateWithoutUserPromptHistoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  images: z.union([ z.lazy(() => UserPromptResultUpdateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  info: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptResultUncheckedUpdateWithoutUserPromptHistoryInputSchema: z.ZodType<Prisma.UserPromptResultUncheckedUpdateWithoutUserPromptHistoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  images: z.union([ z.lazy(() => UserPromptResultUpdateimagesInputSchema),z.string().array() ]).optional(),
  parameters: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  info: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryCreateWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateWithoutUserPromptResultInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserPromptHistoryInputSchema)
}).strict();

export const UserPromptHistoryUncheckedCreateWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedCreateWithoutUserPromptResultInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserPromptHistoryCreateOrConnectWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateOrConnectWithoutUserPromptResultInput> = z.object({
  where: z.lazy(() => UserPromptHistoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserPromptResultInputSchema) ]),
}).strict();

export const UserPromptHistoryUpsertWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryUpsertWithoutUserPromptResultInput> = z.object({
  update: z.union([ z.lazy(() => UserPromptHistoryUpdateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedUpdateWithoutUserPromptResultInputSchema) ]),
  create: z.union([ z.lazy(() => UserPromptHistoryCreateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedCreateWithoutUserPromptResultInputSchema) ]),
  where: z.lazy(() => UserPromptHistoryWhereInputSchema).optional()
}).strict();

export const UserPromptHistoryUpdateToOneWithWhereWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateToOneWithWhereWithoutUserPromptResultInput> = z.object({
  where: z.lazy(() => UserPromptHistoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserPromptHistoryUpdateWithoutUserPromptResultInputSchema),z.lazy(() => UserPromptHistoryUncheckedUpdateWithoutUserPromptResultInputSchema) ]),
}).strict();

export const UserPromptHistoryUpdateWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateWithoutUserPromptResultInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserPromptHistoryNestedInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedUpdateWithoutUserPromptResultInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedUpdateWithoutUserPromptResultInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const UserPromptHistoryCreateManyUserInputSchema: z.ZodType<Prisma.UserPromptHistoryCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  batchSize: z.number().int(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  nIter: z.number().int(),
  steps: z.number().int(),
  seed: z.bigint(),
  samplerName: z.string(),
  cfgScale: z.number().int(),
  denoisingStrength: z.number().optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryCreateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.number().int().optional().nullable(),
  resizeMode: z.number().int().optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserPromptHistoryUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userPromptResult: z.lazy(() => UserPromptResultUpdateOneWithoutUserPromptHistoryNestedInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userPromptResult: z.lazy(() => UserPromptResultUncheckedUpdateOneWithoutUserPromptHistoryNestedInputSchema).optional()
}).strict();

export const UserPromptHistoryUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserPromptHistoryUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  negativePrompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  width: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  height: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  nIter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  steps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  seed: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  samplerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  cfgScale: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  denoisingStrength: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  initImages: z.union([ z.lazy(() => UserPromptHistoryUpdateinitImagesInputSchema),z.string().array() ]).optional(),
  controlMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resizeMode: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  alwaysonScripts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(),VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenFindFirstArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindFirstArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindFirstOrThrowArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenFindManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindManyArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenAggregateArgsSchema: z.ZodType<Prisma.PasswordResetTokenAggregateArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PasswordResetTokenGroupByArgsSchema: z.ZodType<Prisma.PasswordResetTokenGroupByArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithAggregationInputSchema.array(),PasswordResetTokenOrderByWithAggregationInputSchema ]).optional(),
  by: PasswordResetTokenScalarFieldEnumSchema.array(),
  having: PasswordResetTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PasswordResetTokenFindUniqueArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindUniqueArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindUniqueOrThrowArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorTokenFindFirstArgsSchema: z.ZodType<Prisma.TwoFactorTokenFindFirstArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorTokenOrderByWithRelationInputSchema.array(),TwoFactorTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TwoFactorTokenScalarFieldEnumSchema,TwoFactorTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TwoFactorTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TwoFactorTokenFindFirstOrThrowArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorTokenOrderByWithRelationInputSchema.array(),TwoFactorTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TwoFactorTokenScalarFieldEnumSchema,TwoFactorTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TwoFactorTokenFindManyArgsSchema: z.ZodType<Prisma.TwoFactorTokenFindManyArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorTokenOrderByWithRelationInputSchema.array(),TwoFactorTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TwoFactorTokenScalarFieldEnumSchema,TwoFactorTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TwoFactorTokenAggregateArgsSchema: z.ZodType<Prisma.TwoFactorTokenAggregateArgs> = z.object({
  where: TwoFactorTokenWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorTokenOrderByWithRelationInputSchema.array(),TwoFactorTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TwoFactorTokenGroupByArgsSchema: z.ZodType<Prisma.TwoFactorTokenGroupByArgs> = z.object({
  where: TwoFactorTokenWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorTokenOrderByWithAggregationInputSchema.array(),TwoFactorTokenOrderByWithAggregationInputSchema ]).optional(),
  by: TwoFactorTokenScalarFieldEnumSchema.array(),
  having: TwoFactorTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TwoFactorTokenFindUniqueArgsSchema: z.ZodType<Prisma.TwoFactorTokenFindUniqueArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TwoFactorTokenFindUniqueOrThrowArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorConfirmationFindFirstArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationFindFirstArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorConfirmationOrderByWithRelationInputSchema.array(),TwoFactorConfirmationOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorConfirmationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TwoFactorConfirmationScalarFieldEnumSchema,TwoFactorConfirmationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TwoFactorConfirmationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationFindFirstOrThrowArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorConfirmationOrderByWithRelationInputSchema.array(),TwoFactorConfirmationOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorConfirmationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TwoFactorConfirmationScalarFieldEnumSchema,TwoFactorConfirmationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TwoFactorConfirmationFindManyArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationFindManyArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorConfirmationOrderByWithRelationInputSchema.array(),TwoFactorConfirmationOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorConfirmationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TwoFactorConfirmationScalarFieldEnumSchema,TwoFactorConfirmationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TwoFactorConfirmationAggregateArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationAggregateArgs> = z.object({
  where: TwoFactorConfirmationWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorConfirmationOrderByWithRelationInputSchema.array(),TwoFactorConfirmationOrderByWithRelationInputSchema ]).optional(),
  cursor: TwoFactorConfirmationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TwoFactorConfirmationGroupByArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationGroupByArgs> = z.object({
  where: TwoFactorConfirmationWhereInputSchema.optional(),
  orderBy: z.union([ TwoFactorConfirmationOrderByWithAggregationInputSchema.array(),TwoFactorConfirmationOrderByWithAggregationInputSchema ]).optional(),
  by: TwoFactorConfirmationScalarFieldEnumSchema.array(),
  having: TwoFactorConfirmationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TwoFactorConfirmationFindUniqueArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationFindUniqueArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorConfirmationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationFindUniqueOrThrowArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereUniqueInputSchema,
}).strict() ;

export const UserPromptHistoryFindFirstArgsSchema: z.ZodType<Prisma.UserPromptHistoryFindFirstArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptHistoryOrderByWithRelationInputSchema.array(),UserPromptHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserPromptHistoryScalarFieldEnumSchema,UserPromptHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserPromptHistoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserPromptHistoryFindFirstOrThrowArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptHistoryOrderByWithRelationInputSchema.array(),UserPromptHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserPromptHistoryScalarFieldEnumSchema,UserPromptHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserPromptHistoryFindManyArgsSchema: z.ZodType<Prisma.UserPromptHistoryFindManyArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptHistoryOrderByWithRelationInputSchema.array(),UserPromptHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserPromptHistoryScalarFieldEnumSchema,UserPromptHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserPromptHistoryAggregateArgsSchema: z.ZodType<Prisma.UserPromptHistoryAggregateArgs> = z.object({
  where: UserPromptHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptHistoryOrderByWithRelationInputSchema.array(),UserPromptHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserPromptHistoryGroupByArgsSchema: z.ZodType<Prisma.UserPromptHistoryGroupByArgs> = z.object({
  where: UserPromptHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptHistoryOrderByWithAggregationInputSchema.array(),UserPromptHistoryOrderByWithAggregationInputSchema ]).optional(),
  by: UserPromptHistoryScalarFieldEnumSchema.array(),
  having: UserPromptHistoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserPromptHistoryFindUniqueArgsSchema: z.ZodType<Prisma.UserPromptHistoryFindUniqueArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserPromptHistoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserPromptHistoryFindUniqueOrThrowArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserPromptResultFindFirstArgsSchema: z.ZodType<Prisma.UserPromptResultFindFirstArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptResultOrderByWithRelationInputSchema.array(),UserPromptResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserPromptResultScalarFieldEnumSchema,UserPromptResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserPromptResultFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserPromptResultFindFirstOrThrowArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptResultOrderByWithRelationInputSchema.array(),UserPromptResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserPromptResultScalarFieldEnumSchema,UserPromptResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserPromptResultFindManyArgsSchema: z.ZodType<Prisma.UserPromptResultFindManyArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptResultOrderByWithRelationInputSchema.array(),UserPromptResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserPromptResultScalarFieldEnumSchema,UserPromptResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserPromptResultAggregateArgsSchema: z.ZodType<Prisma.UserPromptResultAggregateArgs> = z.object({
  where: UserPromptResultWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptResultOrderByWithRelationInputSchema.array(),UserPromptResultOrderByWithRelationInputSchema ]).optional(),
  cursor: UserPromptResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserPromptResultGroupByArgsSchema: z.ZodType<Prisma.UserPromptResultGroupByArgs> = z.object({
  where: UserPromptResultWhereInputSchema.optional(),
  orderBy: z.union([ UserPromptResultOrderByWithAggregationInputSchema.array(),UserPromptResultOrderByWithAggregationInputSchema ]).optional(),
  by: UserPromptResultScalarFieldEnumSchema.array(),
  having: UserPromptResultScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserPromptResultFindUniqueArgsSchema: z.ZodType<Prisma.UserPromptResultFindUniqueArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereUniqueInputSchema,
}).strict() ;

export const UserPromptResultFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserPromptResultFindUniqueOrThrowArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereUniqueInputSchema,
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
}).strict() ;

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
}).strict() ;

export const PasswordResetTokenCreateArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  data: z.union([ PasswordResetTokenCreateInputSchema,PasswordResetTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const PasswordResetTokenUpsertArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpsertArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
  create: z.union([ PasswordResetTokenCreateInputSchema,PasswordResetTokenUncheckedCreateInputSchema ]),
  update: z.union([ PasswordResetTokenUpdateInputSchema,PasswordResetTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const PasswordResetTokenCreateManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyArgs> = z.object({
  data: z.union([ PasswordResetTokenCreateManyInputSchema,PasswordResetTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PasswordResetTokenDeleteArgsSchema: z.ZodType<Prisma.PasswordResetTokenDeleteArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenUpdateArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  data: z.union([ PasswordResetTokenUpdateInputSchema,PasswordResetTokenUncheckedUpdateInputSchema ]),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenUpdateManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyArgs> = z.object({
  data: z.union([ PasswordResetTokenUpdateManyMutationInputSchema,PasswordResetTokenUncheckedUpdateManyInputSchema ]),
  where: PasswordResetTokenWhereInputSchema.optional(),
}).strict() ;

export const PasswordResetTokenDeleteManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenDeleteManyArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
}).strict() ;

export const TwoFactorTokenCreateArgsSchema: z.ZodType<Prisma.TwoFactorTokenCreateArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  data: z.union([ TwoFactorTokenCreateInputSchema,TwoFactorTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const TwoFactorTokenUpsertArgsSchema: z.ZodType<Prisma.TwoFactorTokenUpsertArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereUniqueInputSchema,
  create: z.union([ TwoFactorTokenCreateInputSchema,TwoFactorTokenUncheckedCreateInputSchema ]),
  update: z.union([ TwoFactorTokenUpdateInputSchema,TwoFactorTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const TwoFactorTokenCreateManyArgsSchema: z.ZodType<Prisma.TwoFactorTokenCreateManyArgs> = z.object({
  data: z.union([ TwoFactorTokenCreateManyInputSchema,TwoFactorTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TwoFactorTokenDeleteArgsSchema: z.ZodType<Prisma.TwoFactorTokenDeleteArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  where: TwoFactorTokenWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorTokenUpdateArgsSchema: z.ZodType<Prisma.TwoFactorTokenUpdateArgs> = z.object({
  select: TwoFactorTokenSelectSchema.optional(),
  data: z.union([ TwoFactorTokenUpdateInputSchema,TwoFactorTokenUncheckedUpdateInputSchema ]),
  where: TwoFactorTokenWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorTokenUpdateManyArgsSchema: z.ZodType<Prisma.TwoFactorTokenUpdateManyArgs> = z.object({
  data: z.union([ TwoFactorTokenUpdateManyMutationInputSchema,TwoFactorTokenUncheckedUpdateManyInputSchema ]),
  where: TwoFactorTokenWhereInputSchema.optional(),
}).strict() ;

export const TwoFactorTokenDeleteManyArgsSchema: z.ZodType<Prisma.TwoFactorTokenDeleteManyArgs> = z.object({
  where: TwoFactorTokenWhereInputSchema.optional(),
}).strict() ;

export const TwoFactorConfirmationCreateArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  data: z.union([ TwoFactorConfirmationCreateInputSchema,TwoFactorConfirmationUncheckedCreateInputSchema ]),
}).strict() ;

export const TwoFactorConfirmationUpsertArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationUpsertArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereUniqueInputSchema,
  create: z.union([ TwoFactorConfirmationCreateInputSchema,TwoFactorConfirmationUncheckedCreateInputSchema ]),
  update: z.union([ TwoFactorConfirmationUpdateInputSchema,TwoFactorConfirmationUncheckedUpdateInputSchema ]),
}).strict() ;

export const TwoFactorConfirmationCreateManyArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationCreateManyArgs> = z.object({
  data: z.union([ TwoFactorConfirmationCreateManyInputSchema,TwoFactorConfirmationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TwoFactorConfirmationDeleteArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationDeleteArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  where: TwoFactorConfirmationWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorConfirmationUpdateArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateArgs> = z.object({
  select: TwoFactorConfirmationSelectSchema.optional(),
  include: TwoFactorConfirmationIncludeSchema.optional(),
  data: z.union([ TwoFactorConfirmationUpdateInputSchema,TwoFactorConfirmationUncheckedUpdateInputSchema ]),
  where: TwoFactorConfirmationWhereUniqueInputSchema,
}).strict() ;

export const TwoFactorConfirmationUpdateManyArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationUpdateManyArgs> = z.object({
  data: z.union([ TwoFactorConfirmationUpdateManyMutationInputSchema,TwoFactorConfirmationUncheckedUpdateManyInputSchema ]),
  where: TwoFactorConfirmationWhereInputSchema.optional(),
}).strict() ;

export const TwoFactorConfirmationDeleteManyArgsSchema: z.ZodType<Prisma.TwoFactorConfirmationDeleteManyArgs> = z.object({
  where: TwoFactorConfirmationWhereInputSchema.optional(),
}).strict() ;

export const UserPromptHistoryCreateArgsSchema: z.ZodType<Prisma.UserPromptHistoryCreateArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  data: z.union([ UserPromptHistoryCreateInputSchema,UserPromptHistoryUncheckedCreateInputSchema ]),
}).strict() ;

export const UserPromptHistoryUpsertArgsSchema: z.ZodType<Prisma.UserPromptHistoryUpsertArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereUniqueInputSchema,
  create: z.union([ UserPromptHistoryCreateInputSchema,UserPromptHistoryUncheckedCreateInputSchema ]),
  update: z.union([ UserPromptHistoryUpdateInputSchema,UserPromptHistoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserPromptHistoryCreateManyArgsSchema: z.ZodType<Prisma.UserPromptHistoryCreateManyArgs> = z.object({
  data: z.union([ UserPromptHistoryCreateManyInputSchema,UserPromptHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserPromptHistoryDeleteArgsSchema: z.ZodType<Prisma.UserPromptHistoryDeleteArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  where: UserPromptHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserPromptHistoryUpdateArgsSchema: z.ZodType<Prisma.UserPromptHistoryUpdateArgs> = z.object({
  select: UserPromptHistorySelectSchema.optional(),
  include: UserPromptHistoryIncludeSchema.optional(),
  data: z.union([ UserPromptHistoryUpdateInputSchema,UserPromptHistoryUncheckedUpdateInputSchema ]),
  where: UserPromptHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserPromptHistoryUpdateManyArgsSchema: z.ZodType<Prisma.UserPromptHistoryUpdateManyArgs> = z.object({
  data: z.union([ UserPromptHistoryUpdateManyMutationInputSchema,UserPromptHistoryUncheckedUpdateManyInputSchema ]),
  where: UserPromptHistoryWhereInputSchema.optional(),
}).strict() ;

export const UserPromptHistoryDeleteManyArgsSchema: z.ZodType<Prisma.UserPromptHistoryDeleteManyArgs> = z.object({
  where: UserPromptHistoryWhereInputSchema.optional(),
}).strict() ;

export const UserPromptResultCreateArgsSchema: z.ZodType<Prisma.UserPromptResultCreateArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  data: z.union([ UserPromptResultCreateInputSchema,UserPromptResultUncheckedCreateInputSchema ]),
}).strict() ;

export const UserPromptResultUpsertArgsSchema: z.ZodType<Prisma.UserPromptResultUpsertArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereUniqueInputSchema,
  create: z.union([ UserPromptResultCreateInputSchema,UserPromptResultUncheckedCreateInputSchema ]),
  update: z.union([ UserPromptResultUpdateInputSchema,UserPromptResultUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserPromptResultCreateManyArgsSchema: z.ZodType<Prisma.UserPromptResultCreateManyArgs> = z.object({
  data: z.union([ UserPromptResultCreateManyInputSchema,UserPromptResultCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserPromptResultDeleteArgsSchema: z.ZodType<Prisma.UserPromptResultDeleteArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  where: UserPromptResultWhereUniqueInputSchema,
}).strict() ;

export const UserPromptResultUpdateArgsSchema: z.ZodType<Prisma.UserPromptResultUpdateArgs> = z.object({
  select: UserPromptResultSelectSchema.optional(),
  include: UserPromptResultIncludeSchema.optional(),
  data: z.union([ UserPromptResultUpdateInputSchema,UserPromptResultUncheckedUpdateInputSchema ]),
  where: UserPromptResultWhereUniqueInputSchema,
}).strict() ;

export const UserPromptResultUpdateManyArgsSchema: z.ZodType<Prisma.UserPromptResultUpdateManyArgs> = z.object({
  data: z.union([ UserPromptResultUpdateManyMutationInputSchema,UserPromptResultUncheckedUpdateManyInputSchema ]),
  where: UserPromptResultWhereInputSchema.optional(),
}).strict() ;

export const UserPromptResultDeleteManyArgsSchema: z.ZodType<Prisma.UserPromptResultDeleteManyArgs> = z.object({
  where: UserPromptResultWhereInputSchema.optional(),
}).strict() ;