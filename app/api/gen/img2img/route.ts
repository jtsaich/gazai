import { get_random_seed } from '../../../helpers';

// testing
import SDResponse from '@/mocks/SDResponse.json';

export async function POST(request: Request) {
  const requestBody = await request.json();
  const {
    batchSize,
    prompt,
    negativePrompt,
    height,
    width,
    cfgScale,
    inputImage,
    denoisingStrength
  } = requestBody;
  let { seed } = requestBody;

  if (seed === undefined || seed === -1) {
    seed = get_random_seed();
  }

  const payload = {
    prompt: prompt,
    negative_prompt: negativePrompt,
    height: height,
    width: width,
    n_iter: 1,
    sampler_name: 'DPM++ SDE Karras',
    batch_size: batchSize,
    steps: 20,
    seed: seed,
    cfg_scale: cfgScale,
    init_images: [inputImage],
    denoising_strength: denoisingStrength
  };

  if (process.env.ENABLE_MOCK_SD_RESPONSE) {
    return Response.json(SDResponse);
  }

  const res = await fetch(`${process.env.SD_API_HOST}/sdapi/v1/img2img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return Response.json(await res.json());
}
