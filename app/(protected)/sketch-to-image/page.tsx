'use client';

import axios from 'axios';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { LoRAs } from '@/app/constants';
import Select from '@/components/form/select';
import Input from '@/components/form/input';
import Range from '@/components/form/range';
import DrawingCanvas from '@/components/drawingCanvas';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import NumberOfImages from '../_components/number-of-images';
import ModelSelect from '../_components/model-select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SketchToImageFormValues {
  batchSize: number;
  prompt: string;
  negativePrompt: string;
  outputImageSize: string;
  inference: string;
  cfgScale: number;
  denoisingStrength: number;
  loraSelections: { name: string; id: string }[];
  inputImage: string;
}
export default function SketchToImage() {
  const [images, setImages] = useState([]);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<SketchToImageFormValues>({
    defaultValues: {
      batchSize: 1,
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

  const onSubmit = async (data: SketchToImageFormValues) => {
    // console.debug(data);
    // return;

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
    prompt = promptPrefix + data.prompt;

    const payload = {
      prompt,
      negativePrompt: data.negativePrompt,
      height: data.outputImageSize,
      width: data.outputImageSize,
      cfgScale: data.cfgScale,
      batchSize: data.batchSize,
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
      const response = await axios.post(url, payload);
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
            <Select
              label="推論モード"
              options={[
                { label: 'i2i', value: 'i2i' },
                { label: 't2i-scribble', value: 't2i-scribble' },
                { label: 'coloring', value: 'coloring' }
              ]}
              {...register('inference')}
            />
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
              {...register('outputImageSize')}
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
            <ScrollArea className="p-10">
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

              <div className="grid grid-cols-2">
                <Controller
                  render={({ field }) => (
                    <DrawingCanvas
                      setCanvasOutput={(dataUrl) => field.onChange(dataUrl)}
                    />
                  )}
                  control={control}
                  name="inputImage"
                />
                <div className="grid grid-cols-2 gap-4">
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
            </ScrollArea>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </form>
  );
}
