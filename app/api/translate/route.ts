import * as deepl from 'deepl-node';

const authKey = process.env.DEEPL_AUTH_KEY || 'xxx';
const translator = new deepl.Translator(authKey);

export async function POST(request: Request) {
  const { text } = await request.json();
  const result = await translator.translateText(text, null, 'en-US');

  // {text: xxx}
  return Response.json(result);
}
