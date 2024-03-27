'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftRight, SlidersVertical } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToggle } from '@uidotdev/usehooks';
import debounce from 'debounce';

import { LoRAs } from '@/app/constants';
import Range from '@/components/form/range';
import { SketchToImageSchema, SketchToImageFormValues } from '@/schemas';
import { isTrue } from '@/lib/utils';
import { Form, FormField } from '@/components/ui/form';
import FormItemSelect from '@/components/form/form-item-select';
import { Button } from '@/components/ui/button';
import FormItemInput from '@/components/form/form-item-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import FormItemTextarea from '@/components/form/form-item-textarea';
import Spinner from '@/components/spinner';
// import { MockImage } from '@/mocks/Image';
// import { MockSDResponse } from '@/mocks/SDResponse';

import ModelSelect from '../_components/model-select';

import DrawingCanvas, {
  useDrawingCanvasStore
} from './_components/drawing-canvas';
import DrawingToolbox from './_components/drawing-toolbox';
const enableTranslation = isTrue(process.env.NEXT_PUBLIC_ENABLE_TRANSLATION);

export default function SketchToImage() {
  const setInputImage = useDrawingCanvasStore((state) => state.setInputImage);
  const [outputImage, setOutputImage] = useState<string>();
  const [isGenerating, toggleGenerating] = useToggle(false);
  const [pendingChange, setPendingChange] = useState(false);

  useEffect(() => {
    if (isGenerating) {
      return;
    }

    if (pendingChange) {
      form.handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, pendingChange]);

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
      loraSelections: []
    },
    resolver: zodResolver(SketchToImageSchema)
  });

  const onSubmit = async (data: SketchToImageFormValues) => {
    if (isGenerating) {
      setPendingChange(true);
      return;
    }

    setPendingChange(false);
    toggleGenerating();

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
    const { loraSelections, inference, ...payload } = {
      ...data,
      prompt,
      inputImage: data.inputImage.replace('data:image/png;base64,', '')
    };

    let url = '';
    switch (inference) {
      case 'i2i':
        url = 'gen/img2img';
        break;
      case 't2i-scribble':
        url = 'gen/tex2img_ctrlnet';
        break;
      case 'coloring':
        url = 'gen/coloring_ctrlnet';
    }

    console.debug(url, payload);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_GAZAI_API}/${url}`,
        payload
      );
      const responseData = response.data;

      // const response = await axios.post(url, payload);
      // const data: BetterUserPromptResult = response.data;
      // const responseData = MockSDResponse({
      //   ...payload,
      //   seed: Number(1),
      //   samplerName: 'DPM++ SDE Karras',
      //   nIter: 1,
      //   steps: 20
      // });
      // console.debug(responseData);
      setOutputImage(`data:image/png;base64,${responseData.images[0]}`);
    } catch (error) {
      console.error(error);
    }

    toggleGenerating();
  };

  return (
    <div className="relative">
      <div className="absolute left-1 top-20 flex flex-col">
        <DrawingToolbox />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <main className="flex flex-col h-full w-full px-12 py-10">
            <div className="flex flex-col lg:flex-row gap-4 pb-4">
              <div className="flex flex-row gap-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" size="icon" variant="secondary">
                      <SlidersVertical />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="start"
                    className="w-96 space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="negativePrompt"
                      render={({ field }) => (
                        <FormItemTextarea label="Negative prompt" {...field} />
                      )}
                    />
                  </PopoverContent>
                </Popover>
                <FormField
                  control={form.control}
                  name="inference"
                  render={({ field }) => (
                    <FormItemSelect
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
                    <FormItemInput
                      className="flex-1 lg:min-w-96"
                      placeholder="Enter a prompt"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex flex-row flex-wrap gap-x-4">
                <FormField
                  control={form.control}
                  name="loraSelections"
                  render={({ field }) => (
                    <ModelSelect
                      value={field.value}
                      onChange={field.onChange}
                      className="min-w-36"
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
                      className="w-40"
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
                      className="w-40"
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 text-center pb-4">
              <div></div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!outputImage) return;
                    setInputImage(outputImage);
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
                    onChange={debounce((dataUrl) => {
                      field.onChange(dataUrl);
                      form.handleSubmit(onSubmit)();
                    }, 1000)}
                  />
                )}
              />
              <div className="relative w-full h-full">
                {isGenerating ? (
                  <div className="absolute w-full h-full flex items-end justify-end p-4">
                    <Spinner />
                  </div>
                ) : null}
                <img
                  src={outputImage}
                  className="w-full h-full aspect-square"
                />
              </div>
            </div>
          </main>
        </form>
      </Form>
    </div>
  );
}
