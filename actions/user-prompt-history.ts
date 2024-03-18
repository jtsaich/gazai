'use server';

import * as z from 'zod';
import type { User } from 'next-auth';

import prisma from '@/lib/prisma';
import { UserPromptHistoryCreateInputSchema } from '@/prisma/generated/zod';
import { auth } from '@/auth';

export const userPromptHistoryData = (
  data: Omit<z.infer<typeof UserPromptHistoryCreateInputSchema>, 'user'>,
  user: User
) => ({
  ...data,
  seed: BigInt(data.seed),
  user: {
    connect: {
      id: user.id
    }
  }
});

export const createUserPromptHistory = async (
  values: z.infer<typeof UserPromptHistoryCreateInputSchema>
) => {
  const session = await auth();
  const user = session?.user;
  const validatedFields = UserPromptHistoryCreateInputSchema.safeParse(
    userPromptHistoryData(values, user)
  );

  if (!validatedFields.success) {
    console.error(validatedFields.error.toString());
    return { error: 'Invalid fields.' };
  }

  const data = validatedFields.data;

  const userPromptHistory = await prisma.userPromptHistory.create({
    data: data
  });

  return userPromptHistory;
};
