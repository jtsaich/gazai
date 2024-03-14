import { auth } from '@/auth';
import { getUserPromptResultByUserId } from '@/data/user-prompt-history';
import { type NextRequest } from 'next/server';
export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  const searchParams = request.nextUrl.searchParams;

  const from = searchParams.has('from')
    ? Number(searchParams.get('from'))
    : undefined;
  const limit = searchParams.has('limit')
    ? Number(searchParams.get('limit'))
    : undefined;

  const result = await getUserPromptResultByUserId(user.id, from, limit);

  return Response.json(result);
}
