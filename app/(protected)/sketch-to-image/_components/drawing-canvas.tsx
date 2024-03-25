'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Stage, Layer, Line, Image, Transformer } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

import { Tool } from './drawing-toolbox';

interface DrawingCanvasState {
  tool: Tool;
  color: string;
  strokeWidth: number;
  inputImage: string;
  stage?: Konva.Stage;
  history: CanvasState[][];
  historyStep: number;
  currentState: CanvasState[];
  selectedId?: string;
}

interface DrawingCanvasAction {
  setTool: (newTool: Tool) => void;
  setColor: (newColor: string) => void;
  setStrokeWidth: (newStrokeWidth: number) => void;
  setInputImage: (newInputImage: string) => void;
  setStage: (newStage: Konva.Stage) => void;
  setHistory: (newHistory: CanvasState[][]) => void;
  setHistoryStep: (newHistoryStep: number) => void;
  setCurrentState: (newCurrentState: CanvasState[]) => void;
  selectShape: (id?: string) => void;

  handleUploadImage: (dataUrl: string, width: number, height: number) => void;
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
  stage: undefined,
  history: [[]],
  historyStep: 0,
  currentState: [],
  selectedId: undefined,
  setTool: (newTool) => set({ tool: newTool }),
  setColor: (newColor) => set({ color: newColor }),
  setStrokeWidth: (newStrokeWidth) => set({ strokeWidth: newStrokeWidth }),
  setInputImage: (newInputImage) =>
    set((state) => {
      const newState: CanvasImage[] = [
        {
          id: uuidv4(),
          tool: Tool.Image,
          image: newInputImage,
          x: 0,
          y: 0,
          width: state.stage?.width() || 200,
          height: state.stage?.height() || 200
        }
      ];
      const newHistoryStep = state.historyStep + 1;
      return {
        history: [...state.history.slice(0, newHistoryStep), newState],
        historyStep: newHistoryStep,
        currentState: newState
      };
    }),
  setStage: (newStage) => set({ stage: newStage }),
  setHistory: (newHistory) => set({ history: newHistory }),
  setHistoryStep: (newHistoryStep) => set({ historyStep: newHistoryStep }),
  setCurrentState: (newCurrentState) => set({ currentState: newCurrentState }),
  selectShape: (id) => set({ selectedId: id }),

  handleUploadImage: (dataUrl, width, height) =>
    set((state) => {
      const stageWidth = state.stage?.width();
      const stageHeight = state.stage?.height();

      let _width = width;
      let _height = height;

      const scale = width / height;
      if (
        stageWidth &&
        width > stageWidth &&
        stageHeight &&
        height > stageHeight
      ) {
        if (scale > 1) {
          _width = stageWidth;
          _height = _width / scale;
        } else {
          _height = stageHeight;
          _width = _height * scale;
        }
      } else if (stageWidth && width > stageWidth) {
        _width = stageWidth;
        _height = _width / scale;
      } else if (stageHeight && height > stageHeight) {
        _height = stageHeight;
        _width = _height * scale;
      }

      const newState: CanvasState[] = [
        ...state.currentState,
        {
          id: uuidv4(),
          tool: Tool.Image,
          image: dataUrl,
          x: 0,
          y: 0,
          width: _width,
          height: _height
        }
      ];
      const newHistoryStep = state.historyStep + 1;
      return {
        history: [...state.history, newState],
        historyStep: newHistoryStep,
        currentState: newState
      };
    }),

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
    }),

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
  id: string;
  tool: Tool.Pen | Tool.Eraser;
  points: number[];
  color: string;
  strokeWidth: number;
}

interface CanvasImage {
  id: string;
  tool: Tool.Image;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

type CanvasState = CanvasLine | CanvasImage;

function isCanvasLine(obj: CanvasState): obj is CanvasLine {
  return obj.tool === Tool.Pen || obj.tool === Tool.Eraser;
}

const URLImage = ({
  alt = '',
  draggable = false,
  shapeProps,
  isSelected,
  onSelect,
  onChange
}: Omit<Konva.ImageConfig, 'image'> & { image: string }) => {
  const imageRef = useRef();
  const trRef = useRef<Konva.Transformer>();

  const [img] = useImage(shapeProps.image);

  useEffect(() => {
    if (trRef.current && isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([imageRef.current as unknown as Konva.Image]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {
        <Image
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={imageRef}
          alt={alt}
          {...shapeProps}
          image={img}
          onClick={onSelect}
          onTap={onSelect}
          draggable={draggable && isSelected}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y()
            });
          }}
          onTransformEnd={() => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = imageRef.current as unknown as Konva.Shape;
            if (!node) return;

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY)
            });
          }}
        />
      }
      {isSelected && (
        <Transformer
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const origStageSize = { width: 512, height: 512 };

function DrawingCanvas({ onChange }: { onChange?: (dataUrl: string) => void }) {
  const tool = useDrawingCanvasStore((state) => state.tool);
  const color = useDrawingCanvasStore((state) => state.color);
  const strokeWidth = useDrawingCanvasStore((state) => state.strokeWidth);
  const currentState = useDrawingCanvasStore((state) => state.currentState);
  const selectedId = useDrawingCanvasStore((state) => state.selectedId);

  const setStage = useDrawingCanvasStore((state) => state.setStage);
  const selectShape = useDrawingCanvasStore((state) => state.selectShape);

  const setCurrentState = useDrawingCanvasStore(
    (state) => state.setCurrentState
  );
  const incrementHistoryWithCurrentState = useDrawingCanvasStore(
    (state) => state.incrementHistoryWithCurrentState
  );

  const containerDivRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState(origStageSize);

  useHotkeys('delete', () => {
    if (selectedId) {
      const index = currentState.findIndex((node) => node.id === selectedId);
      const nodes = [...currentState];
      nodes.splice(index, 1);
      setCurrentState(nodes);
      incrementHistoryWithCurrentState();
    }
  });

  const isDrawing = useRef(false);

  // handle window resize
  useEffect(() => {
    if (!containerDivRef.current) return;
    const parentWidth = containerDivRef.current.clientWidth;
    const parentHeight = containerDivRef.current.clientHeight;
    stageRef.current?.scale({
      x: parentWidth / origStageSize.width,
      y: parentHeight / origStageSize.height
    });

    setStageSize({
      width: containerDivRef.current.clientWidth,
      height: containerDivRef.current.clientWidth
    });

    const handleResize = () => {
      if (!containerDivRef.current) return;
      const parentWidth = containerDivRef.current.clientWidth;
      const parentHeight = containerDivRef.current.clientHeight;
      stageRef.current?.scale({
        x: parentWidth / origStageSize.width,
        y: parentHeight / origStageSize.height
      });
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
    if (!stageRef?.current) return;
    setStage(stageRef?.current);
  }, [stageRef]);

  useEffect(() => {
    if (!stageRef?.current) return;

    if (currentState.length === 0) {
      return;
    }

    const uri = stageRef.current?.toDataURL();
    onChange?.(uri);
  }, [stageRef, currentState]);

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(undefined);
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === Tool.Move) {
      checkDeselect(e);
      return;
    }
    if (tool === Tool.Pen || tool === Tool.Eraser) {
      isDrawing.current = true;
      const pos = e.target.getStage()?.getRelativePointerPosition();
      if (!pos) return;

      setCurrentState([
        ...currentState,
        {
          id: String(e.target._id),
          tool,
          points: [pos.x, pos.y],
          color: color,
          strokeWidth: strokeWidth
        } as CanvasLine
      ]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getRelativePointerPosition();
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
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

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
        onTouchStart={checkDeselect}
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
                    shapeProps={node}
                    draggable={tool === Tool.Move}
                    isSelected={node.id === selectedId}
                    onSelect={() => {
                      selectShape(node.id);
                    }}
                    onChange={(newAttrs: CanvasState) => {
                      const nodes = currentState.slice();
                      nodes[i] = newAttrs;
                      setCurrentState(nodes);
                      incrementHistoryWithCurrentState();
                    }}
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
