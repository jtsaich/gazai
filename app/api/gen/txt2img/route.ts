import humps from 'humps';

import { getRandomSeed, isTrue } from '@/lib/utils';
import { createUserPromptResultWithHistory } from '@/actions/user-prompt-result';
import { UserPromptHistory } from '@/prisma/generated/zod';

import { v4 as uuidv4 } from 'uuid';
import { uploadObject } from '@/lib/s3';

// testing
import { MockSDResponse } from '@/mocks/SDResponse';

const useMockResponse = isTrue(process.env.USE_MOCK_SD_RESPONSE);

export async function POST(request: Request) {
  const requestBody: Omit<UserPromptHistory, 'type' | 'alwaysonScripts'> =
    await request.json();

  const payload = {
    ...requestBody,
    seed: Number(requestBody.seed || getRandomSeed()),
    samplerName: 'DPM++ SDE Karras',
    nIter: 1,
    steps: 20
  };

  let result;
  if (useMockResponse) {
    result = MockSDResponse(payload);
  } else {
    const res = await fetch(`${process.env.SD_API_HOST}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(humps.decamelizeKeys(payload))
    });
    result = await res.json();
  }

  const images = result.images.map((i: string) => {
    const objectKey = uuidv4();
    uploadObject(i, objectKey);
    return objectKey;
  });
  result.images = images;

  const historyResult = await createUserPromptResultWithHistory(result, {
    type: 'txt2img',
    ...payload
  });

  return Response.json(historyResult);
}
