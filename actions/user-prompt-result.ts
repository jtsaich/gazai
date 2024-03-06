'use server';

import * as z from 'zod';
import prisma from '@/lib/prisma';
import {
  UserPromptHistoryCreateInputSchema,
  UserPromptResultCreateInputSchema
} from '@/prisma/generated/zod';
import { auth } from '@/auth';
import { userPromptHistoryData } from './user-prompt-history';

export const createUserPromptResultWithHistory = async (
  result: Omit<
    z.infer<typeof UserPromptResultCreateInputSchema>,
    'userPromptHistory'
  >,
  history: Omit<z.infer<typeof UserPromptHistoryCreateInputSchema>, 'user'>
) => {
  const session = await auth();
  const user = session?.user;

  const values = {
    ...result,
    userPromptHistory: {
      create: userPromptHistoryData(history, user)
    }
  };

  const validatedFields = UserPromptResultCreateInputSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields.error.toString());
    return { error: 'Invalid fields.' };
  }

  const data = validatedFields.data;

  const userPromptResult = await prisma.userPromptResult.create({
    data: data
  });

  return userPromptResult;
};
