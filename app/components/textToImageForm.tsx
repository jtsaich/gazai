'use client';

import axios from 'axios';
import { useForm } from 'react-hook-form';
import Input from './input';
import Select from './select';
import Range from './range';
import { useState } from 'react';
import clsx from 'clsx';

interface FormValues {
  prompt: string;
  negativePrompt: string;
  outputImageSize: string;
  cfgScale: number;
}

function TextToImageForm() {
  const [images, setImages] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      prompt: 'A female elf with golden crown',
      negativePrompt:
        '(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))',
      outputImageSize: '1024',
      cfgScale: 7
    }
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    // st.session_state['prompt_prefix'] + prompt,

    try {
      const response = await axios.post('/api/gen/txt2img', {
        prompt: data.prompt,
        negativePrompt: data.negativePrompt,
        height: data.outputImageSize,
        width: data.outputImageSize,
        cfgScale: data.cfgScale
      });

      const { images } = response.data;
      setImages(images);
    } catch (error) {
      console.error(error);
    }

    // try {
    //   const response = await axios.post('/api/translate', { text: '女' });
    //   console.log(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div className="flex flex-row">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-4"
      >
        <Input label="Prompt" {...register('prompt')} />
        <Input label="Negative prompt" {...register('negativePrompt')} />
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
