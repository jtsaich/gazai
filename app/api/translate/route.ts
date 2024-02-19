import * as deepl from 'deepl-node';

const translator = new deepl.Translator(process.env.DEEPL_AUTH_KEY!);

export async function POST(request: Request) {
  const { text } = await request.json();
  const result = await translator.translateText(text, 'ja', 'en-US');

  // {text: xxx}
  return Response.json(result);
}
