'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Eraser, Pen, Redo, Trash2, Undo } from 'lucide-react';
import useImage from 'use-image';

import { useStore } from '@/app/store/input-image';

import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';

enum Tool {
  Pen = 'pen',
  Eraser = 'eraser',
  Image = 'image'
}

interface CanvasLine {
  tool: Tool.Pen | Tool.Eraser;
  points: number[];
}

interface CanvasImage {
  tool: Tool.Image;
  image: string;
}

type CanvasState = CanvasLine | CanvasImage;

function isCanvasLine(obj: CanvasState): obj is CanvasLine {
  return obj.tool === Tool.Pen || obj.tool === Tool.Eraser;
}

const URLImage = ({
  image,
  width,
  height
}: {
  image: string;
  width: number;
  height: number;
}) => {
  const [img] = useImage(image);
  return <Image image={img} width={width} height={height} />;
};

function DrawingCanvas({ onChange }: { onChange?: (dataUrl: string) => void }) {
  const inputImage = useStore((state) => state.inputImage);
  const loadInputImage = useStore((state) => state.loadInputImage);
  const toggleLoadInputImage = useStore((state) => state.toggleLoadInputImage);

  const containerDivRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Node>(null);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });

  const [tool, setTool] = useState(Tool.Pen);
  const isDrawing = useRef(false);

  const [history, setHistory] = useState<CanvasState[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [currentState, setCurrentState] = useState<CanvasState[]>(
    history[historyStep]
  );

  // handle window resize
  useEffect(() => {
    if (!containerDivRef.current) return;
    console.debug('useEffect window size change');
    setStageSize({
      width: containerDivRef.current.clientWidth,
      height: containerDivRef.current.clientWidth
    });

    const handleResize = () => {
      if (!containerDivRef.current) return;
      setStageSize({
        width: containerDivRef.current.clientWidth,
        height: containerDivRef.current.clientWidth
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerDivRef]);

  // handle output to input
  useEffect(() => {
    if (!inputImage) return;
    if (!loadInputImage) return;
    console.debug('useEffect output to input');

    setHistory((prev) => [
      ...prev.slice(0, historyStep + 1),
      [{ tool: Tool.Image, image: inputImage }]
    ]);
    setHistoryStep((prev) => prev + 1);
    toggleLoadInputImage();
  }, [historyStep, inputImage, loadInputImage, toggleLoadInputImage]);

  // get current state via history
  useEffect(() => {
    if (!history[historyStep]) return;
    console.debug('useEffect current state');

    setCurrentState(history[historyStep]);
  }, [history, historyStep]);

  useEffect(() => {
    if (!stageRef.current) return;
    console.debug('useEffect set data url');

    const uri = stageRef.current?.toDataURL();
    onChange?.(uri);
  }, [stageRef, currentState]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setCurrentState([
      ...currentState,
      { tool, points: [pos.x, pos.y] } as CanvasLine
    ]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const lastLine = currentState[currentState.length - 1];
    // add point
    if (isCanvasLine(lastLine)) {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
    }

    // replace last
    currentState.splice(currentState.length - 1, 1, lastLine);
    setCurrentState(currentState.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setHistory((prev) => [
      ...prev.slice(0, historyStep + 1),
      [...currentState]
    ]);
    setHistoryStep((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyStep === 0) {
      return;
    }
    setHistoryStep((prev) => prev - 1);
  };

  const handleRedo = () => {
    if (historyStep === history.length - 1) {
      return;
    }
    setHistoryStep((prev) => prev + 1);
  };

  const handleClear = () => {
    if (currentState.length === 0) return;

    setHistory((prev) => [...prev.slice(0, historyStep + 1), []]);
    setHistoryStep((prev) => prev + 1);
  };

  return (
    <div ref={containerDivRef} className="relative aspect-square border">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {currentState.map((node, i) => {
            switch (node.tool) {
              case 'pen':
              case 'eraser':
                return (
                  <Line
                    key={i}
                    points={node.points}
                    stroke="#df4b26"
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      node.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                );
              case 'image':
                return (
                  <URLImage
                    key={i}
                    image={node.image}
                    width={stageSize.width}
                    height={stageSize.height}
                  />
                );
              default:
                return;
            }
          })}
        </Layer>
      </Stage>

      <div className="absolute left-1 top-1 flex flex-col">
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
          <ToggleGroupItem value={Tool.Pen} aria-label="Toggle pen">
            <Pen className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value={Tool.Eraser} aria-label="Toggle eraser">
            <Eraser className="h-4 w-4" />
          </ToggleGroupItem>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={handleUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={handleRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ToggleGroup>
      </div>
    </div>
  );
}

export default DrawingCanvas;
