import * as z from 'zod';
import humps from 'humps';

// testing
import SDResponse from '@/mocks/SDResponse.json';
import { get_random_seed } from '@/app/helpers';
import { createUserPromptResultWithHistory } from '@/actions/user-prompt-result';
import { UserPromptHistorySchema } from '@/prisma/generated/zod';

export async function POST(request: Request) {
  const requestBody: z.infer<typeof UserPromptHistorySchema> =
    await request.json();
  const { prompt, negativePrompt, height, width, cfgScale, batchSize, seed } =
    requestBody;

  const payload = {
    prompt,
    negativePrompt,
    height,
    width,
    batchSize,
    cfgScale,
    seed: seed || get_random_seed(),
    samplerName: 'DPM++ SDE Karras',
    nIter: 1,
    steps: 20
  };

  if (process.env.ENABLE_MOCK_SD_RESPONSE) {
    const result = SDResponse;
    // @ts-ignore
    createUserPromptResultWithHistory(result, {
      type: 'txt2img',
      ...payload
    });
    return Response.json(SDResponse);
  }

  const res = await fetch(`${process.env.SD_API_HOST}/sdapi/v1/txt2img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(humps.decamelizeKeys(payload))
  });
  const result = await res.json();

  createUserPromptResultWithHistory(result, {
    type: 'txt2img',
    ...payload
  });

  return Response.json(result);
}
