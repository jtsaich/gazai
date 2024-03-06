import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ImageResult } from './image-result';
import { BetterUserPromptResult } from '../_types';

export default function GenerationHistory({
  history
}: {
  history: BetterUserPromptResult;
}) {
  return (
    <div className="relative">
      <ScrollArea>
        <p className="text-sm text-muted-foreground pb-2">
          {history.parameters.prompt}
        </p>
        <div className="flex space-x-4 pb-4">
          {history.images.map((base64, i) => (
            <ImageResult
              key={`generated-${i}`}
              image={`data:image/jpeg;base64,${base64}`}
              width={history.parameters.width}
              height={history.parameters.height}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
