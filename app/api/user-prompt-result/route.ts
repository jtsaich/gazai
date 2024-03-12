import { auth } from '@/auth';
import { getUserPromptResultByUserId } from '@/data/user-prompt-history';
import { type NextRequest } from 'next/server';
export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  const result = await getUserPromptResultByUserId(user.id);

  return Response.json(result);
}
