'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import clsx from 'clsx';
import { Listbox } from '@headlessui/react';
import Input from './input';
import Select from './select';
import Range from './range';
import { LoRAs } from '../constants';

interface FormValues {
  prompt: string;
  negativePrompt: string;
  outputImageSize: string;
  cfgScale: number;
  loraSelections: { name: string; id: string }[];
}
function TextToImageForm() {
  const [images, setImages] = useState([]);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      prompt: 'A female elf with golden crown',
      negativePrompt:
        '(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))',
      outputImageSize: '1024',
      cfgScale: 7,
      loraSelections: [LoRAs[0], LoRAs[1]]
    }
  });

  const onSubmit = async (data: FormValues) => {
    let prompt = '';
    try {
      const response = await axios.post('/api/translate', {
        text: data.prompt
      });
      const { text } = response.data;
      prompt += text;
    } catch (error) {
      console.error(error);
    }

    const promptPrefix = data.loraSelections.map((lora) => lora.id).join('');
    prompt = promptPrefix + prompt;

    const payload = {
      prompt,
      negativePrompt: data.negativePrompt,
      height: data.outputImageSize,
      width: data.outputImageSize,
      cfgScale: data.cfgScale
    };

    console.debug('/api/gen/txt2img', payload);
    try {
      const response = await axios.post('/api/gen/txt2img', payload);
      const { images } = response.data;
      setImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
                onChange={(e) => {
                  console.log(e);
                  field.onChange(e);
                }}
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
        <Range
          label="cfg"
          min={0}
          max={20}
          className="range range-xs"
          {...register('cfgScale')}
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
  );
}

export default TextToImageForm;
