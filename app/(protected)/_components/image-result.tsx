import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';

interface ImageResultProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  width?: number;
  height?: number;
  imageAsGuide?: (image: string) => void;
}
export function ImageResult({
  image,
  className,
  imageAsGuide,
  ...props
}: ImageResultProps) {
  return (
    <div className={className} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <img
              src={image}
              alt={''}
              className="h-80 w-auto object-cover transition-all hover:scale-105 aspect-square"
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={() => imageAsGuide?.(image)}>
            Use this as guide
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <a href={image} download="image.png">
              Download
            </a>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
