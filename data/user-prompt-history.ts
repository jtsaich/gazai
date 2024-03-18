import prisma from '@/lib/prisma';

export const getUserPromptResultByUserId = async (
  userId: string,
  from: number = 0,
  limit: number = 3
) => {
  try {
    const userPromptResult = await prisma.userPromptResult.findMany({
      where: {
        userPromptHistory: {
          userId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: from,
      take: limit
    });

    return userPromptResult;
  } catch (e) {
    console.error(e);
    return [];
  }
};
