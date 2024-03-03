import * as z from 'zod';
import { UserRole } from '@prisma/client';

interface UserData {
  password?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

const passwordRequired = (
  data: UserData,
  passwordField: keyof UserData,
  newPasswordField: keyof UserData,
  newPasswordConfirmationField: keyof UserData = 'newPasswordConfirmation'
) => {
  const newPasswordEntered = data[newPasswordField] !== undefined;
  const confirmationEntered = data[newPasswordConfirmationField] !== undefined;

  if (newPasswordEntered && !confirmationEntered) {
    return false;
  }

  return !(
    (data[passwordField] && !data[newPasswordField]) ||
    (data[newPasswordField] && !data[passwordField])
  );
};

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(1)),
    newPassword: z.optional(
      z.string().min(6, {
        message:
          'Please enter a new password with at least 6 characters, required'
      })
    ),
    newPasswordConfirmation: z.optional(
      z.string().min(6, {
        message:
          'Please confirm your password with at least 6 characters, required'
      })
    )
  })
  .refine((data) => passwordRequired(data, 'password', 'newPassword'), {
    message:
      'Please enter a new password with at least 6 characters, required!',
    path: ['newPassword']
  })
  .refine((data) => passwordRequired(data, 'newPassword', 'password'), {
    message: 'Please enter your valid password, required!',
    path: ['password']
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'Passwords do not match.',
    path: ['newPasswordConfirmation']
  });

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: 'Please enter your password, required'
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'Please confirm your password, required.'
    })
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match.',
    path: ['passwordConfirmation']
  });

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address, required.'
  })
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address. Email is required.'
  }),
  password: z.string().min(1, {
    message: 'Please enter your password. Password is required.'
  }),
  code: z.optional(z.string())
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Please enter your name, required.'
    }),
    email: z.string().email({
      message: 'Please enter a valid email address, required.'
    }),
    password: z.string().min(6, {
      message: 'Please enter a password with at least 6 characters, required'
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'Please confirm your password, required.'
    })
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match.',
    path: ['passwordConfirmation']
  });

export const UserPromptHistorySchema = z.object({
  type: z.enum(['txt2img', 'img2img', 'txt2img-scribble', 'coloring']),
  batchSize: z.number(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number(),
  height: z.number(),
  nIter: z.number(),
  steps: z.number(),
  seed: z.number(),
  samplerName: z.string(),
  cfgScale: z.number(),
  denoisingStrength: z.optional(z.number()),
  iniImages: z.optional(z.array(z.string())),
  controlMode: z.optional(z.number()),
  resizeMode: z.optional(z.number()),
  created: z.optional(z.date())
});

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const UserPromptResultSchema = z.object({
  images: z.array(z.string()),
  parameters: jsonSchema,
  info: z.string()
});

export const TextToImageSchema = z.object({
  batchSize: z.number(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number(),
  height: z.number(),
  cfgScale: z.number(),
  loraSelections: z.array(z.object({ id: z.string(), name: z.string() }))
});

export const SketchToImageSchema = z.object({
  batchSize: z.number(),
  prompt: z.string(),
  negativePrompt: z.string(),
  width: z.number(),
  height: z.number(),
  cfgScale: z.number(),
  denoisingStrength: z.optional(z.number()),
  inference: z.enum(['i2i', 't2i-scribble', 'coloring']),
  inputImage: z.optional(z.array(z.string())),
  loraSelections: z.array(z.object({ id: z.string(), name: z.string() }))
});
