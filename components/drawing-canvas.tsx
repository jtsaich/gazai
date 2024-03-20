'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Eraser, Pen, Redo, Trash2, Undo } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';

interface CanvasState {
  tool: string;
  points: number[];
}

function DrawingCanvas({ onChange }: { onChange: (dataUrl: string) => void }) {
  const containerDivRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Node>(null);

  const [tool, setTool] = useState('pen');
  const isDrawing = useRef(false);

  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });

  const [history, setHistory] = useState<CanvasState[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [currentState, setCurrentState] = useState<CanvasState[]>(
    history[historyStep]
  );

  useEffect(() => {
    if (!containerDivRef.current) return;
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

  useEffect(() => {
    setCurrentState(history[historyStep]);
  }, [history, historyStep]);

  useEffect(() => {
    if (!stageRef.current) return;

    const uri = stageRef.current?.toDataURL();
    onChange(uri);
  }, [stageRef, onChange, currentState]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setCurrentState([...currentState, { tool, points: [pos.x, pos.y] }]);
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
    lastLine.points = lastLine.points.concat([point.x, point.y]);

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
          {currentState.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
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
            setTool(value);
          }}
        >
          <ToggleGroupItem value="pen" aria-label="Toggle pen">
            <Pen className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="Toggle eraser">
            <Eraser className="h-4 w-4" />
          </ToggleGroupItem>
          <Button variant="outline" size="icon" onClick={handleUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRedo}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </ToggleGroup>
      </div>
    </div>
  );
}

export default DrawingCanvas;
