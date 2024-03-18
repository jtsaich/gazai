'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash, Trash2 } from 'lucide-react';
import { FormField, FormItem, FormLabel } from './ui/form';

interface Point {
  x: number;
  y: number;
  color: string;
  weight: number;
}

interface p5Exposed extends p5 {
  canvas: HTMLCanvasElement;
}

function DrawingCanvas({
  guidedImage,
  setCanvasOutput
}: {
  guidedImage: string;
  setCanvasOutput: (dataUrl: string) => void;
}) {
  const clear = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const myp5 = useRef<p5 | null>(null);
  const paths = useRef<Point[][]>([]);
  const currentPath = useRef<Point[]>([]);

  const colorRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (myp5.current) return;

    const s = (p: p5Exposed) => {
      const baseWidth = 600;
      const baseHeight = 600;
      const aspectRatio = baseWidth / baseHeight;
      let scaleFactor = 1;

      const updateCanvasDimensions = () => {
        const containerWidth = container.current!.clientWidth - 1;
        // const containerHeight = container.current!.clientHeight;
        // if (containerWidth / containerHeight > aspectRatio) {
        //   return {
        //     canvasWidth: containerHeight * aspectRatio,
        //     canvasHeight: containerHeight
        //   };
        // }

        return {
          canvasWidth: containerWidth,
          canvasHeight: containerWidth / aspectRatio
        };
      };

      p.draw = function () {
        p.noFill();

        if (p.mouseIsPressed) {
          const point = {
            x: p.mouseX,
            y: p.mouseY,
            color: colorRef.current?.value || '#000000',
            weight: Number(weightRef.current?.value) || 1
          };
          currentPath.current.push(point);

          setCanvasOutput(
            p.canvas.toDataURL().replace('data:image/png;base64,', '')
          );
        }

        paths.current.forEach((path) => {
          p.beginShape();
          path.forEach((point) => {
            p.stroke(point.color!);
            p.strokeWeight(Number(point.weight));
            p.vertex(point.x, point.y);
          });
          p.endShape();
        });
      };

      p.mousePressed = function () {
        currentPath.current = [];
        paths.current.push(currentPath.current);
      };

      p.windowResized = () => {
        p.setup();
      };

      p.setup = function () {
        const { canvasWidth, canvasHeight } = updateCanvasDimensions();
        p.createCanvas(canvasWidth, canvasHeight);
        scaleFactor = baseWidth / canvasWidth;

        // const x = (p.windowWidth - canvasWidth) / 2;
        // const y = (p.windowHeight - canvasHeight) / 2;
        // myCanvas.position(x, y);

        p.pixelDensity(window.devicePixelRatio);
        p.strokeWeight(2 * scaleFactor);
        p.background(255);
      };
    };
    myp5.current = new p5(s, container.current!);
  });

  useEffect(() => {
    if (!myp5?.current) {
      return;
    }
    if (!guidedImage) {
      return;
    }
    myp5.current.loadImage(
      guidedImage,
      (img) => {
        console.debug('success');
        myp5.current && myp5.current.image(img, 0, 0);
      },
      () => {
        console.error('failed');
      }
    );
  }, [guidedImage]);

  return (
    <div className="min-w-0 flex flex-row">
      <div>
        <ul className="grid gap-y-4">
          <li className="flex flex-col pr-2">
            <FormItem>
              <FormLabel>Color:</FormLabel>
              <input
                type="color"
                ref={colorRef}
                defaultValue="#000000"
                className="w-full"
              />
            </FormItem>
          </li>
          <li className="flex flex-col pr-2">
            <FormItem>
              <FormLabel>Stroke:</FormLabel>
              <Input
                type="number"
                ref={weightRef}
                min="2"
                max="200"
                className="input"
                defaultValue="3"
              />
            </FormItem>
          </li>
          <li className="pr-2">
            <Button
              type="button"
              ref={clear}
              className="w-full"
              onClick={() => {
                paths.current?.splice(0);
                myp5.current?.background(255);
              }}
            >
              <Trash2 />
            </Button>
          </li>
        </ul>
      </div>
      <div
        ref={container}
        className="flex-1 min-w-0 border border-black border-solid"
      ></div>
    </div>
  );
}

export default DrawingCanvas;
