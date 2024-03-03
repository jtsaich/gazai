'use client';

import { useState } from 'react';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { LoRAs } from '@/app/constants';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import Range from '@/components/form/range';
import Select from '@/components/form/select';
import Input from '@/components/form/input';
import NumberOfImages from '../_components/number-of-images';
import ModelSelect from '../_components/model-select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextToImageSchema } from '@/schemas';
import * as z from 'zod';

type TextToImageFormValues = z.infer<typeof TextToImageSchema>;

export default function TextToImage() {
  const [images, setImages] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<TextToImageFormValues>({
    defaultValues: {
      batchSize: 1,
      prompt: 'A female elf with golden crown',
      negativePrompt:
        '(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))',
      width: 1024,
      height: 1024,
      cfgScale: 7,
      loraSelections: [LoRAs[0], LoRAs[1]]
    },
    resolver: zodResolver(TextToImageSchema)
  });

  const onSubmit = async (data: TextToImageFormValues) => {
    let prompt = data.prompt;
    if (Boolean(process.env.NEXT_PUBLIC_ENABLE_TRANSLATION)) {
      try {
        const response = await axios.post('/api/translate', {
          text: data.prompt
        });
        const { text } = response.data;
        prompt = text;
      } catch (error) {
        console.error(error);
      }
    }

    const promptPrefix = data.loraSelections.map((lora) => lora.id).join('');
    prompt = promptPrefix + prompt;

    const { loraSelections, ...payload } = {
      ...data,
      prompt
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <ResizablePanelGroup direction="horizontal" className="w-full h-screen">
        <ResizablePanel defaultSize={20} className="h-screen">
          <div className="flex flex-col h-full w-full p-10">
            <Controller
              render={({ field }) => (
                <NumberOfImages
                  value={String(field.value)}
                  onChange={field.onChange}
                />
              )}
              control={control}
              name="batchSize"
            />

            <Controller
              render={({ field }) => (
                <ModelSelect value={field.value} onChange={field.onChange} />
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
              {...register('width', { valueAsNumber: true })}
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
              className={clsx('btn btn-primary w-full mt-4', {
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
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80} className="h-screen">
          <main className="flex flex-col h-full w-full">
            <ScrollArea>
              <div className="p-10">
                <div className="flex flex-col gap-4 pb-4">
                  <Input label="Prompt" {...register('prompt')} />
                  <button className="btn btn-primary max-w-xs">
                    Generate random prompt
                  </button>
                  <Input
                    label="Negative prompt"
                    {...register('negativePrompt')}
                  />
                </div>

                <span>Generation history</span>
                <div className="grid grid-cols-4 gap-4">
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
                <div className=""></div>
              </div>
            </ScrollArea>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </form>
  );
}
