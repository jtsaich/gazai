import humps from 'humps';

import { get_random_seed } from '@/app/helpers';
import { createUserPromptResultWithHistory } from '@/actions/user-prompt-result';
import { UserPromptHistory } from '@/prisma/generated/zod';

// testing
import { MockSDResponse } from '@/mocks/SDResponse';

export async function POST(request: Request) {
  const requestBody: Omit<UserPromptHistory, 'type'> = await request.json();
  const payload = {
    ...requestBody,
    seed: requestBody.seed || get_random_seed(),
    samplerName: 'DPM++ SDE Karras',
    nIter: 1,
    steps: 20
  };

  let result;
  if (process.env.USE_MOCK_SD_RESPONSE) {
    result = MockSDResponse(payload);
  } else {
    const res = await fetch(`${process.env.SD_API_HOST}/sdapi/v1/img2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(humps.decamelizeKeys(payload))
    });
    result = await res.json();
  }

  const historyResult = await createUserPromptResultWithHistory(result, {
    type: 'img2img',
    ...payload
  });

  return Response.json(historyResult);
}
