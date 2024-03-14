import prisma from '@/lib/prisma';

export const getUserPromptResultByUserId = async (userId: string) => {
  try {
    const userPromptResult = await prisma.userPromptResult.findMany({
      where: {
        userPromptHistory: {
          userId
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return userPromptResult;
  } catch {
    return null;
  }
};
