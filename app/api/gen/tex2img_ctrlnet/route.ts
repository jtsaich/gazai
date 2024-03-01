import { get_random_seed } from '../../../helpers';

export async function POST(request: Request) {
  const requestBody = await request.json();
  const {
    batchSize,
    prompt,
    negativePrompt,
    height,
    width,
    cfgScale,
    denoisingStrength,
    inputImage
  } = requestBody;
  let { seed } = requestBody;

  if (seed === undefined || seed === -1) {
    seed = get_random_seed();
  }

  const control_mode = 0;
  const resize_mode = 2;

  const payload = {
    batch_size: batchSize,
    cfg_scale: cfgScale,
    denoising_strength: denoisingStrength,
    height: height,
    n_iter: 1,
    negative_prompt: negativePrompt,
    prompt: prompt,
    sampler_name: 'DPM++ SDE Karras',
    seed: seed,
    steps: 20,
    width: width,
    alwayson_scripts: {
      controlnet: {
        args: [
          {
            input_image: inputImage,
            module: 'invert (from white bg & black line)',
            model: 'kohya_controllllite_xl_scribble_anime [d39b679a]',
            processor_res: 512,
            control_mode: control_mode,
            resize_mode: resize_mode
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

  const res = await fetch(`${process.env.SD_API_HOST}/sdapi/v1/txt2img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return Response.json(await res.json());
}
