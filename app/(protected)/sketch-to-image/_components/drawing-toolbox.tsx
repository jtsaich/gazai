import { useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  Pen,
  Eraser,
  Menu,
  Undo,
  Redo,
  Trash2,
  ImageUp,
  Move
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useDrawingCanvasStore } from '@/app/(protected)/sketch-to-image/_components/drawing-canvas';

export enum Tool {
  Move = 'move',
  Pen = 'pen',
  Eraser = 'eraser',
  Image = 'image'
}

export default function DrawingToolbox() {
  const tool = useDrawingCanvasStore((state) => state.tool);
  const color = useDrawingCanvasStore((state) => state.color);
  const strokeWidth = useDrawingCanvasStore((state) => state.strokeWidth);

  const setTool = useDrawingCanvasStore((state) => state.setTool);
  const setColor = useDrawingCanvasStore((state) => state.setColor);
  const setStrokeWidth = useDrawingCanvasStore((state) => state.setStrokeWidth);

  const handleUploadImage = useDrawingCanvasStore(
    (state) => state.handleUploadImage
  );
  const handleUndo = useDrawingCanvasStore((state) => state.handleUndo);
  const handleRedo = useDrawingCanvasStore((state) => state.handleRedo);
  const handleClear = useDrawingCanvasStore((state) => state.handleClear);

  const uploadImageRef = useRef<HTMLInputElement>(null);

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      orientation="vertical"
      className="flex-col"
      value={tool}
      onValueChange={(value) => {
        if (!value) return;
        setTool(value as Tool);
      }}
    >
      <ToggleGroupItem value={Tool.Move} aria-label="Toggle move">
        <Move className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={Tool.Pen} aria-label="Toggle pen">
        <Pen className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value={Tool.Eraser} aria-label="Toggle eraser">
        <Eraser className="h-4 w-4" />
      </ToggleGroupItem>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" type="button">
            <div
              className="h-5 w-5 rounded-sm"
              style={{ backgroundColor: color }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start">
          <HexColorPicker color={color} onChange={setColor} />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" type="button">
            <Menu className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start">
          <Slider
            min={1}
            max={72}
            value={[strokeWidth]}
            onValueChange={(value) => {
              setStrokeWidth(value[0]);
            }}
          />
        </PopoverContent>
      </Popover>
      <input
        ref={uploadImageRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target!.result as string;
            handleUploadImage(dataUrl);
          };
          reader.readAsDataURL(e.target.files[0]);
        }}
        hidden
      />
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => {
          uploadImageRef.current?.click();
        }}
      >
        <ImageUp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => handleUndo()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" type="button" onClick={handleRedo}>
        <Redo className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" type="button" onClick={handleClear}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </ToggleGroup>
  );
}
