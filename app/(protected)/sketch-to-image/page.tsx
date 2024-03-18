'use client';

import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { LoRAs } from '@/app/constants';
import Select from '@/components/form/form-item-select';
import FormItemInput from '@/components/form/form-item-input';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { SketchToImageSchema, SketchToImageFormValues } from '@/schemas';
import {
  BetterUserPromptResult,
  isBetterUserPromptResult,
  isBetterUserPromptResultArray
} from '../_types';
import { Separator } from '@/components/ui/separator';
import GenerationHistory from '../_components/generation-history';
import { isTrue } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormField } from '@/components/ui/form';
import FormItemSelect from '@/components/form/form-item-select';
import FormItemTextarea from '@/components/form/form-item-textarea';

const enableTranslation = isTrue(process.env.NEXT_PUBLIC_ENABLE_TRANSLATION);

export default function SketchToImage() {
  const [generationHistory, setGenerationHistory] = useState<
    BetterUserPromptResult[]
  >([]);
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

  useEffect(() => {
    const fetchGenerationHistory = async () => {
      try {
        const response = await axios.get('/api/user-prompt-result');
        const data = response.data;

        if (data && isBetterUserPromptResultArray(data)) {
          setGenerationHistory(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGenerationHistory();
  }, []);

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
      const response = await axios.post(url, payload);
      const data: BetterUserPromptResult = response.data;

      if (data && isBetterUserPromptResult(data)) {
        setGenerationHistory((prev) => [data, ...prev]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ResizablePanelGroup direction="horizontal" className="w-full h-screen">
        <ResizablePanel defaultSize={20} className="h-screen">
          <div className="flex flex-col h-full w-full min-w-[300px] p-10">
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
                />
              )}
            />

            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <NumberOfImages
                  value={Number(field.value)}
                  onChange={field.onChange}
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

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItemSelect
                  label="Output image size"
                  options={[
                    { label: '1024', value: '1024' },
                    { label: '768', value: '768' },
                    { label: '512', value: '512' }
                  ]}
                  value={String(field.value)}
                  onChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="cfgScale"
              render={({ field }) => (
                <Range label="cfg" value={field.value} min={0} max={20} />
              )}
            />

            <FormField
              control={form.control}
              name="denoisingStrength"
              render={({ field }) => (
                <Range
                  label="ノイズ除去の強さ"
                  value={field.value}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                />
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className={'mt-4'}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80} className="h-screen">
          <main className="flex flex-col h-full w-full">
            <ScrollArea>
              <div className="p-10">
                <div className="flex flex-col gap-4 pb-4">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItemTextarea label="Prompt" {...field} />
                    )}
                  />

                  <Button>Generate random prompt</Button>

                  <FormField
                    control={form.control}
                    name="negativePrompt"
                    render={({ field }) => (
                      <FormItemTextarea label="Negative prompt" {...field} />
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 pb-4">
                  <FormField
                    control={form.control}
                    name="inputImage"
                    render={({ field }) => (
                      <DrawingCanvas
                        setCanvasOutput={(dataUrl) => field.onChange(dataUrl)}
                        guidedImage={field.value}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Generation history
                    </h2>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-y-4">
                  {generationHistory.map((history, i) => (
                    <div key={i}>
                      <GenerationHistory
                        history={history}
                        imageAsGuide={(image) => {
                          form.setValue('inputImage', image);
                        }}
                      />
                      <Separator className="my-4" />
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
