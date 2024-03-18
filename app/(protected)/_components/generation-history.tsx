import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ImageResult } from './image-result';
import { BetterUserPromptResult } from '../_types';

export default function GenerationHistory({
  history,
  imageAsGuide
}: {
  history: BetterUserPromptResult;
  imageAsGuide?: (image: string) => void;
}) {
  const { parameters, images } = history;

  return (
    <div className="relative">
      <ScrollArea>
        <p className="text-sm text-muted-foreground pb-2">
          {parameters.prompt}
        </p>
        <div className="flex space-x-4 pb-4">
          {images.map((objectKey, i) => (
            <ImageResult
              key={`generated-${objectKey}`}
              image={`/api/image/${objectKey}`}
              width={parameters.width}
              height={parameters.height}
              imageAsGuide={imageAsGuide}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
