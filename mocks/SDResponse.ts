import { MockImage, MockObjectKey } from './Image';

export const MockSDResponse = ({
  prompt,
  negativePrompt,
  height,
  width,
  batchSize,
  cfgScale,
  seed,
  samplerName,
  nIter,
  steps,
  alwaysOnScripts
}: {
  prompt: string;
  negativePrompt: string;
  height: number;
  width: number;
  batchSize: number;
  cfgScale: number;
  seed: number;
  samplerName: string;
  nIter: number;
  steps: number;
  alwaysOnScripts?: any;
}) => ({
  images: Array(batchSize).fill(MockObjectKey),
  parameters: {
    prompt: prompt,
    negative_prompt: negativePrompt,
    styles: null,
    seed,
    subseed: -1,
    subseed_strength: 0,
    seed_resize_from_h: -1,
    seed_resize_from_w: -1,
    sampler_name: samplerName,
    batch_size: batchSize,
    n_iter: nIter,
    steps: steps,
    cfg_scale: cfgScale,
    width: width,
    height: height,
    restore_faces: null,
    tiling: null,
    do_not_save_samples: false,
    do_not_save_grid: false,
    eta: null,
    denoising_strength: null,
    s_min_uncond: null,
    s_churn: null,
    s_tmax: null,
    s_tmin: null,
    s_noise: null,
    override_settings: null,
    override_settings_restore_afterwards: true,
    refiner_checkpoint: null,
    refiner_switch_at: null,
    disable_extra_networks: false,
    firstpass_image: null,
    comments: null,
    enable_hr: false,
    firstphase_width: 0,
    firstphase_height: 0,
    hr_scale: 2,
    hr_upscaler: null,
    hr_second_pass_steps: 0,
    hr_resize_x: 0,
    hr_resize_y: 0,
    hr_checkpoint_name: null,
    hr_sampler_name: null,
    hr_prompt: '',
    hr_negative_prompt: '',
    force_task_id: null,
    sampler_index: 'Euler',
    script_name: null,
    script_args: [],
    send_images: true,
    save_images: false,
    alwayson_scripts: {},
    infotext: null
  },
  info: '{"prompt": "A female elf with golden crown", "all_prompts": ["A female elf with golden crown"], "negative_prompt": "(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))", "all_negative_prompts": ["(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))"], "seed": 3017949020, "all_seeds": [3017949020], "subseed": 2406203818, "all_subseeds": [2406203818], "subseed_strength": 0, "width": 512, "height": 512, "sampler_name": "DPM++ SDE Karras", "cfg_scale": 7.0, "steps": 20, "batch_size": 1, "restore_faces": false, "face_restoration_model": null, "sd_model_name": "v1-5-pruned-emaonly", "sd_model_hash": "cc6cb27103", "sd_vae_name": null, "sd_vae_hash": null, "seed_resize_from_w": -1, "seed_resize_from_h": -1, "denoising_strength": null, "extra_generation_params": {}, "index_of_first_image": 0, "infotexts": ["A female elf with golden crown\\nNegative prompt: (((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))\\nSteps: 20, Sampler: DPM++ SDE Karras, CFG scale: 7.0, Seed: 3017949020, Size: 512x512, Model hash: cc6cb27103, Model: v1-5-pruned-emaonly, Version: v1.8.0"], "styles": [], "job_timestamp": "20240302230001", "clip_skip": 1, "is_using_inpainting_conditioning": false, "version": "v1.8.0"}'
});
