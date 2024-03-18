import { UserPromptResult } from '@/prisma/generated/zod';
import { TextToImageSchema } from '@/schemas';
import * as z from 'zod';

export type TextToImageFormValues = z.infer<typeof TextToImageSchema>;
export type BetterUserPromptResult = UserPromptResult & {
  parameters: { prompt: string; width: number; height: number };
};

export function isBetterUserPromptResult(
  obj: unknown
): obj is BetterUserPromptResult {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'parameters' in obj &&
    typeof obj.parameters === 'object' &&
    obj.parameters !== null &&
    'prompt' in obj.parameters &&
    typeof obj.parameters.prompt === 'string' &&
    'width' in obj.parameters &&
    typeof obj.parameters.width === 'number' &&
    'height' in obj.parameters &&
    typeof obj.parameters.height === 'number'
  );
}

export function isBetterUserPromptResultArray(
  obj: unknown
): obj is BetterUserPromptResult[] {
  return Array.isArray(obj) && obj.every(isBetterUserPromptResult);
}
