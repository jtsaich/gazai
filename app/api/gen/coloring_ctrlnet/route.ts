import humps from 'humps';

import { getRandomSeed } from '@/lib/utils';
import { createUserPromptResultWithHistory } from '@/actions/user-prompt-result';
import { UserPromptHistory } from '@/prisma/generated/zod';

// testing
import { MockSDResponse } from '@/mocks/SDResponse';
import { isTrue } from '@/lib/utils';

const useMockResponse = isTrue(process.env.USE_MOCK_SD_RESPONSE);

export async function POST(request: Request) {
  const requestBody: Omit<UserPromptHistory, 'type'> = await request.json();
  const payload = {
    ...requestBody,
    seed: Number(requestBody.seed || getRandomSeed()),
    samplerName: 'DPM++ SDE Karras',
    nIter: 1,
    steps: 20,
    alwaysonScripts: {
      controlnet: {
        args: [
          {
            input_image: requestBody.initImages,
            module: 'invert (from white bg & black line)',
            model: 'kohya_controllllite_xl_canny_anime [7158f7e0]',
            pixel_perfect: true,
            control_mode: 2,
            resize_mode: 2
          }
        ]
      },
      ADetailer: {
        args: [
          {
            ad_model: 'face_yolov8n.pt',
            ad_prompt: requestBody.prompt
          },
          {
            ad_model: 'hand_yolov8n.pt'
          }
        ]
      }
    }
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

  const historyResult = await createUserPromptResultWithHistory(result, {
    type: 'coloring_ctrlnet',
    ...payload
  });

  return Response.json(historyResult);
}
