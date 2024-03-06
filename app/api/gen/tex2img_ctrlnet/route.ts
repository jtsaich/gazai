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
    steps: 20,
    alwaysonScripts: {
      controlnet: {
        args: [
          {
            input_image: requestBody.initImages,
            module: 'invert (from white bg & black line)',
            model: 'kohya_controllllite_xl_scribble_anime [d39b679a]',
            processor_res: 512,
            control_mode: 0,
            resize_mode: 2
          }
        ]
      },
      ADetailer: {
        args: [
          {
            ad_model: 'hand_yolov8n.pt'
          }
        ]
      }
    }
  };

  let result;
  if (process.env.USE_MOCK_SD_RESPONSE) {
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
    type: 'txt2img_ctrlnet',
    ...payload
  });

  return Response.json(historyResult);
}
