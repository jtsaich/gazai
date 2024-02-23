'use client';

import { Listbox } from '@headlessui/react';
import axios from 'axios';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { LoRAs } from '../constants';
import Select from './select';
import Input from './input';
import Range from './range';
import DrawingCanvas from './drawingCanvas';

interface FormValues {
  prompt: string;
  negativePrompt: string;
  outputImageSize: string;
  inference: string;
  cfgScale: number;
  denoisingStrength: number;
  loraSelections: { name: string; id: string }[];
  inputImage: string;
}
function ImageToImageForm() {
  const [images, setImages] = useState([]);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<FormValues>({
    defaultValues: {
      prompt: 'A female elf with golden crown',
      negativePrompt:
        '(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))',
      outputImageSize: '1024',
      inference: 'i2i',
      cfgScale: 7,
      denoisingStrength: 0.75,
      loraSelections: [LoRAs[0], LoRAs[1]]
    }
  });

  const onSubmit = async (data: FormValues) => {
    let prompt = '';
    // try {
    //   const response = await axios.post('/api/translate', {
    //     text: data.prompt
    //   });
    //   const { text } = response.data;
    //   prompt += text;
    // } catch (error) {
    //   console.error(error);
    // }

    const promptPrefix = data.loraSelections.map((lora) => lora.id).join('');
    prompt = promptPrefix + data.prompt;
    // prompt = promptPrefix + prompt;

    const payload = {
      prompt,
      negativePrompt: data.negativePrompt,
      height: data.outputImageSize,
      width: data.outputImageSize,
      cfgScale: data.cfgScale,
      denoisingStrength: data.denoisingStrength,
      inputImage: data.inputImage
    };

    let url = '';
    switch (data.inference) {
      case 'i2i':
        url = '/api/gen/img2img';
        break;
      case 't2i-scribble':
        url = '/api/gen/tex2img_ctrlnet';
        break;
      case 'coloring':
        url = '/api/gen/coloring_ctrlnet';
    }

    console.debug(url, payload);
    try {
      const response = await axios.post('/api/gen/txt2img', payload);
      const { images } = response.data;
      setImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  console.debug(getValues('inputImage'));

  return (
    <div>
      <div>
        <Controller
          render={({ field }) => (
            <DrawingCanvas
              setCanvasOutput={(dataUrl) => field.onChange(dataUrl)}
            />
          )}
          control={control}
          name="inputImage"
        />
        <a
          href={
            getValues('inputImage')
              ? `data:image/png;base64,${getValues('inputImage')}`
              : ''
          }
          download="generated_image.png"
        >
          Download Image
        </a>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {images.map((base64, i) => (
            <div key={`generated-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${base64}`}
                alt={`generated image ${i}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col gap-4"
        >
          <Input label="Prompt" {...register('prompt')} />
          <Input label="Negative prompt" {...register('negativePrompt')} />

          <Controller
            render={({ field }) => (
              <label className="form-control w-full max-w-xs">
                <Listbox
                  defaultValue={field.value}
                  by={(a, b) => a.id === b.id}
                  onChange={field.onChange}
                  multiple
                >
                  <div className="label">
                    <Listbox.Label className="label-text">
                      Characters / Clothes
                    </Listbox.Label>
                  </div>
                  <Listbox.Button className="input input-bordered w-full max-w-xs h-auto min-h-[3rem] text-left py-2">
                    {({ open }) => (
                      <>
                        {field.value.map((lora) => (
                          <span
                            key={lora.id}
                            className="badge badge-primary m-1"
                            onClick={() => {}}
                          >
                            {lora.name}
                          </span>
                        ))}
                      </>
                    )}
                  </Listbox.Button>
                  <Listbox.Options className="menu" as="ul">
                    {LoRAs.map((lora) => (
                      <li key={lora.id}>
                        <Listbox.Option value={lora} as="a">
                          {lora.name}
                        </Listbox.Option>
                      </li>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </label>
            )}
            control={control}
            name="loraSelections"
          />

          <Select
            label="Output image size"
            options={[
              { label: '1024', value: '1024' },
              { label: '768', value: '768' },
              { label: '512', value: '512' }
            ]}
            {...register('outputImageSize')}
          />
          <Select
            label="推論モード"
            options={[
              { label: 'i2i', value: 'i2i' },
              { label: 't2i-scribble', value: 't2i-scribble' },
              { label: 'coloring', value: 'coloring' }
            ]}
            {...register('inference')}
          />
          <Range
            label="cfg"
            min={0}
            max={20}
            className="range range-xs"
            {...register('cfgScale')}
          />
          <Range
            label="ノイズ除去の強さ"
            min={0.1}
            max={1.0}
            step={0.05}
            className="range range-xs"
            {...register('denoisingStrength')}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx('btn btn-primary w-full max-w-xs', {
              'btn-disabled': isSubmitting
            })}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                loading
              </>
            ) : (
              'Generate'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ImageToImageForm;
