'use client';

import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoRAs } from '@/app/constants';
import { useStore } from '@/app/store/input-image';
import Range from '@/components/form/range';
import DrawingCanvas from '@/components/drawing-canvas';
import { SketchToImageSchema, SketchToImageFormValues } from '@/schemas';
import { isTrue } from '@/lib/utils';
import { Form, FormField } from '@/components/ui/form';
import FormItemSelect from '@/components/form/form-item-select';
import FormItemTextarea from '@/components/form/form-item-textarea';
import { Button } from '@/components/ui/button';
import { MockSDResponse } from '@/mocks/SDResponse';

import ModelSelect from '../_components/model-select';

const enableTranslation = isTrue(process.env.NEXT_PUBLIC_ENABLE_TRANSLATION);

export default function SketchToImage() {
  const updateInputImage = useStore((state) => state.updateInputImage);
  const toggleLoadInputImage = useStore((state) => state.toggleLoadInputImage);
  const [outputImage, setOutputImage] = useState<string>();
  console.debug(outputImage);

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<SketchToImageFormValues>({
    defaultValues: {
      batchSize: 1,
      prompt: 'A female elf with golden crown',
      negativePrompt:
        '(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))',
      width: 1024,
      height: 1024,
      inference: 'i2i',
      cfgScale: 7,
      denoisingStrength: 0.75,
      loraSelections: [LoRAs[0], LoRAs[1]]
    },
    resolver: zodResolver(SketchToImageSchema)
  });

  const onSubmit = async (data: SketchToImageFormValues) => {
    let prompt = data.prompt;
    if (enableTranslation) {
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
    prompt = promptPrefix + data.prompt;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loraSelections, inference, inputImage, ...payload } = {
      ...data,
      prompt,
      initImages: [data.inputImage]
    };

    let url = '';
    switch (inference) {
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
      // const response = await axios.post(url, payload);
      // const data: BetterUserPromptResult = response.data;
      const responseData = MockSDResponse({
        ...payload,
        seed: Number(1),
        samplerName: 'DPM++ SDE Karras',
        nIter: 1,
        steps: 20
      });
      console.debug(responseData);
      setOutputImage(`/api/image/${responseData.images[0]}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full"
      >
        <main className="flex flex-col h-full w-full p-10">
          <div className="grid grid-cols-2 text-center pb-4">
            <div></div>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  if (!outputImage) return;
                  updateInputImage(outputImage);
                  toggleLoadInputImage();
                }}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Output to input
              </Button>
            </div>
            <FormField
              control={form.control}
              name="inputImage"
              render={({ field }) => (
                <DrawingCanvas
                  onChange={(dataUrl) => {
                    field.onChange(dataUrl);
                    form.handleSubmit(onSubmit)();
                  }}
                />
              )}
            />
            <div className="w-full h-full">
              <img src={outputImage} className="w-full h-full" />
            </div>
          </div>

          <div className="flex flex-row gap-4 pb-4">
            <FormField
              control={form.control}
              name="inference"
              render={({ field }) => (
                <FormItemSelect
                  label="推論モード"
                  options={[
                    { label: 'i2i', value: 'i2i' },
                    { label: 't2i-scribble', value: 't2i-scribble' },
                    { label: 'coloring', value: 'coloring' }
                  ]}
                  value={String(field.value)}
                  onChange={field.onChange}
                  className="max-w-xs"
                />
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItemTextarea
                  label="Prompt"
                  className="w-full max-w-sm"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="cfgScale"
              render={({ field }) => (
                <Range
                  label="cfg"
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={20}
                  className="w-full max-w-36"
                />
              )}
            />

            <FormField
              control={form.control}
              name="denoisingStrength"
              render={({ field }) => (
                <Range
                  label="ノイズ除去の強さ"
                  value={field.value}
                  onChange={field.onChange}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  className="w-full max-w-36"
                />
              )}
            />

            <FormField
              control={form.control}
              name="loraSelections"
              render={({ field }) => (
                <ModelSelect value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="negativePrompt"
            render={({ field }) => (
              <FormItemTextarea label="Negative prompt" {...field} />
            )}
          />
        </main>
      </form>
    </Form>
  );
}
