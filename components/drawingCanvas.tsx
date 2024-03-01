'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

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
  setCanvasOutput
}: {
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
        const containerWidth = container.current!.clientWidth;
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
        const myCanvas = p.createCanvas(canvasWidth, canvasHeight);
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

  return (
    <div className="min-w-0 flex flex-row">
      <div>
        <ul>
          <li className="flex flex-col">
            <label>Color:</label>
            <input type="color" ref={colorRef} defaultValue="#000000" />
          </li>
          <li className="flex flex-col">
            <label>Stroke:</label>
            <input
              type="number"
              ref={weightRef}
              min="2"
              max="200"
              className="input"
              defaultValue="3"
            />
          </li>
          <li>
            <button
              ref={clear}
              onClick={() => {
                paths.current?.splice(0);
                myp5.current?.background(255);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
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
