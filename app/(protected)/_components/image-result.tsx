import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import Image from 'next/image';

interface ImageResultProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  width?: number;
  height?: number;
}
export function ImageResult({
  image,
  className,
  width,
  height,
  ...props
}: ImageResultProps) {
  return (
    <div className={className} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={image}
              alt={''}
              width={width}
              height={height}
              className="h-80 w-auto object-cover transition-all hover:scale-105 aspect-square"
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Use this as guide</ContextMenuItem>
          <ContextMenuItem>Download</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
