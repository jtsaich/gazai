function get_random_seed() {
  return Math.floor(Math.random() * 9007199254740991);
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { prompt, negativePrompt, height, width, cfgScale } = requestBody;
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
    batch_size: 2,
    steps: 20,
    seed: seed,
    cfg_scale: cfgScale
  };

  const res = await fetch(`${process.env.SD_API_HOST}/sdapi/v1/txt2img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  // {text: xxx}
  return Response.json(await res.json());
}
