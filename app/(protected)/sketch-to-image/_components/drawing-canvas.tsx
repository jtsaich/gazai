'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';
import { create } from 'zustand';

import { Tool } from './drawing-toolbox';

interface DrawingCanvasState {
  tool: Tool;
  color: string;
  strokeWidth: number;
  inputImage: string;
  loadInputImage: boolean;
  history: CanvasState[][];
  historyStep: number;
  currentState: CanvasState[];
}

interface DrawingCanvasAction {
  setTool: (newTool: Tool) => void;
  setColor: (newColor: string) => void;
  setStrokeWidth: (newStrokeWidth: number) => void;
  updateInputImage: (newInputImage: string) => void;
  toggleLoadInputImage: () => void;
  setHistory: (newHistory: CanvasState[][]) => void;
  setHistoryStep: (newHistoryStep: number) => void;
  setCurrentState: (newCurrentState: CanvasState[]) => void;

  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  incrementHistoryWithCurrentState: () => void;
}

export const useDrawingCanvasStore = create<
  DrawingCanvasState & DrawingCanvasAction
>()((set) => ({
  tool: Tool.Pen,
  color: '#df4b26',
  strokeWidth: 5,
  inputImage: '',
  loadInputImage: false,
  history: [[]],
  historyStep: 0,
  currentState: [],
  setTool: (newTool) => set({ tool: newTool }),
  setColor: (newColor) => set({ color: newColor }),
  setStrokeWidth: (newStrokeWidth) => set({ strokeWidth: newStrokeWidth }),
  updateInputImage: (newInputImage) => set({ inputImage: newInputImage }),
  toggleLoadInputImage: () =>
    set((state) => ({ loadInputImage: !state.loadInputImage })),
  setHistory: (newHistory) => set({ history: newHistory }),
  setHistoryStep: (newHistoryStep) => set({ historyStep: newHistoryStep }),
  setCurrentState: (newCurrentState) => set({ currentState: newCurrentState }),

  handleUndo: () =>
    set((state) => {
      if (state.historyStep === 0) {
        return {};
      }
      const newHistoryStep = state.historyStep - 1;
      return {
        historyStep: newHistoryStep,
        currentState: state.history[newHistoryStep]
      };
    }), // Define the type of handleUndo as a function that takes no arguments and returns void

  handleRedo: () =>
    set((state) => {
      if (state.historyStep === state.history.length - 1) {
        return {};
      }
      const newHistoryStep = state.historyStep + 1;
      return {
        historyStep: newHistoryStep,
        currentState: state.history[newHistoryStep]
      };
    }),

  handleClear: () =>
    set((state) => {
      if (state.currentState.length === 0) return {};
      const newHistoryStep = state.historyStep + 1;
      return {
        history: [...state.history.slice(0, newHistoryStep), []],
        historyStep: newHistoryStep,
        currentState: []
      };
    }),

  incrementHistoryWithCurrentState: () =>
    set((state) => ({
      history: [
        ...state.history.slice(0, state.historyStep + 1),
        [...state.currentState]
      ],
      historyStep: state.historyStep + 1
    }))
}));

interface CanvasLine {
  tool: Tool.Pen | Tool.Eraser;
  points: number[];
  color: string;
  strokeWidth: number;
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
  const tool = useDrawingCanvasStore((state) => state.tool);
  const color = useDrawingCanvasStore((state) => state.color);
  const strokeWidth = useDrawingCanvasStore((state) => state.strokeWidth);
  const inputImage = useDrawingCanvasStore((state) => state.inputImage);
  const loadInputImage = useDrawingCanvasStore((state) => state.loadInputImage);
  const historyStep = useDrawingCanvasStore((state) => state.historyStep);
  const currentState = useDrawingCanvasStore((state) => state.currentState);

  const setCurrentState = useDrawingCanvasStore(
    (state) => state.setCurrentState
  );
  const incrementHistoryWithCurrentState = useDrawingCanvasStore(
    (state) => state.incrementHistoryWithCurrentState
  );

  const toggleLoadInputImage = useDrawingCanvasStore(
    (state) => state.toggleLoadInputImage
  );

  const containerDivRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Node>(null);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });

  const isDrawing = useRef(false);

  // handle window resize
  useEffect(() => {
    if (!containerDivRef.current) return;
    // console.debug('useEffect window size change');
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
    // console.debug('useEffect output to input');

    incrementHistoryWithCurrentState();
    toggleLoadInputImage();
  }, [historyStep, inputImage, loadInputImage, toggleLoadInputImage]);

  // get current state via history
  // useEffect(() => {
  //   if (!history[historyStep]) return;
  //   // console.debug('useEffect current state');

  //   setCurrentState(history[historyStep]);

  //   if (!stageRef.current) return;

  //   const uri = stageRef.current?.toDataURL();
  //   onChange?.(uri);
  // }, [history, historyStep]);

  // useEffect(() => {
  //   if (!stageRef.current) return;
  //   // console.debug('useEffect set data url');

  // }, [stageRef, history]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setCurrentState([
      ...currentState,
      {
        tool,
        points: [pos.x, pos.y],
        color: color,
        strokeWidth: strokeWidth
      } as CanvasLine
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
    incrementHistoryWithCurrentState();
  };

  return (
    <div ref={containerDivRef} className="relative aspect-square border">
      <Stage
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
                    stroke={node.color}
                    strokeWidth={node.strokeWidth}
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
    </div>
  );
}

export default DrawingCanvas;
