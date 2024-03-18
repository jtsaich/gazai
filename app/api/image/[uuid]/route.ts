import { getObject } from '@/lib/s3';
export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const body = await getObject(params.uuid);
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png'
    }
  });
}
