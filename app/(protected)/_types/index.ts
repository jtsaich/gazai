import { UserPromptResult } from '@/prisma/generated/zod';
import { TextToImageSchema } from '@/schemas';
import * as z from 'zod';

export type TextToImageFormValues = z.infer<typeof TextToImageSchema>;
export type BetterUserPromptResult = UserPromptResult & {
  parameters: { prompt: string; width: number; height: number };
};
