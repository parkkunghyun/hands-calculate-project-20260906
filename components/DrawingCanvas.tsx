"use client";

import { useEffect, useRef, useState } from "react";
import { canvasHasInk, recognizeHandwriting } from "@/lib/recognition/ocr";
import type { OcrResult } from "@/lib/recognition/types";

const PAPER = "#ffffff";
const INK = "#262624";
const STROKE_WIDTHS = { thin: 3, mid: 5.5, thick: 8.5 } as const;

type Tool = "pen" | "eraser";
type StrokeSize = keyof typeof STROKE_WIDTHS;

type DrawingCanvasProps = {
  converting: boolean;
  actionLabel?: string;
  busyLabel?: string;
  readyHint?: string;
  actionIcon?: string;
  onConverted: (result: OcrResult) => void;
  onConvertError: (message: string) => void;
  onConvertStart: () => void;
};

export function DrawingCanvas({
  converting,
  actionLabel = "텍스트로 변환",
  busyLabel = "변환 중...",
  readyHint = "작성됨 · 변환 대기",
  actionIcon = "text_fields",
  onConverted,
  onConvertError,
  onConvertStart,
}: DrawingCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const undoRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const toolRef = useRef<Tool>("pen");
  const sizeRef = useRef<StrokeSize>("mid");

  const [tool, setTool] = useState<Tool>("pen");
  const [size, setSize] = useState<StrokeSize>("mid");
  const [hasInk, setHasInk] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.max(1, Math.round(wrap.clientWidth * dpr));
      const nextH = Math.max(1, Math.round(wrap.clientHeight * dpr));
      if (canvas.width === nextW && canvas.height === nextH) return;

      const prev = document.createElement("canvas");
      prev.width = canvas.width;
      prev.height = canvas.height;
      const prevCtx = prev.getContext("2d");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (prevCtx && canvas.width && canvas.height) {
        prevCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = nextW;
      canvas.height = nextH;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, nextW, nextH);
      if (prev.width && prev.height) {
        ctx.drawImage(prev, 0, 0, nextW, nextH);
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      undoRef.current = [];
      redoRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const snapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    undoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  const restore = (image: ImageData) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(image, 0, 0);
    const canvas = canvasRef.current;
    if (canvas) setHasInk(canvasHasInk(canvas));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    snapshot();
    drawingRef.current = true;
    lastRef.current = pointFromEvent(event);
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const last = lastRef.current;
    if (!canvas || !ctx || !last) return;

    const next = pointFromEvent(event);
    ctx.strokeStyle = toolRef.current === "eraser" ? PAPER : INK;
    ctx.lineWidth =
      STROKE_WIDTHS[sizeRef.current] *
      (toolRef.current === "eraser" ? 2.2 : 1) *
      (window.devicePixelRatio || 1);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    lastRef.current = next;
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) setHasInk(canvasHasInk(canvas));
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const prev = undoRef.current.pop();
    if (!canvas || !ctx || !prev) return;
    redoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    restore(prev);
    setCanUndo(undoRef.current.length > 0);
    setCanRedo(true);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const next = redoRef.current.pop();
    if (!canvas || !ctx || !next) return;
    undoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    restore(next);
    setCanUndo(true);
    setCanRedo(redoRef.current.length > 0);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    snapshot();
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const convert = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onConvertStart();
    try {
      onConverted(await recognizeHandwriting(canvas));
    } catch (error) {
      onConvertError(
        error instanceof Error ? error.message : "변환에 실패했습니다.",
      );
    }
  };

  return (
    <section
      id="workbench"
      className="max-w-7xl mx-auto w-full px-gutter-mobile md:px-gutter-desktop pb-pad-xl"
    >
      <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col">
        <div className="bg-surface-container-low px-pad-base md:px-pad-lg py-pad-sm flex flex-wrap items-center justify-between gap-pad-base shadow-sm">
          <div className="flex items-center gap-pad-sm flex-wrap">
            <div className="flex items-center bg-surface-container p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setTool("pen")}
                className={`flex items-center gap-1.5 px-pad-md py-1.5 rounded-lg font-label-ui text-label-ui ${
                  tool === "pen"
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-secondary"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-primary-container">
                  edit
                </span>
                <span>흑연 펜 (2B Lead)</span>
              </button>
              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={`flex items-center gap-1.5 px-pad-md py-1.5 rounded-lg font-label-ui text-label-ui ${
                  tool === "eraser"
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-secondary"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  ink_eraser
                </span>
                <span>지우개</span>
              </button>
            </div>
            <div className="w-px h-5 bg-surface-dim mx-1 hidden sm:block" />
            <div className="flex items-center gap-1.5 bg-surface-container/60 p-1 rounded-lg">
              {(
                [
                  ["thin", "가는 심 (0.3mm)", "w-1.5 h-1.5"],
                  ["mid", "중간 심 (0.5mm)", "w-2.5 h-2.5"],
                  ["thick", "굵은 심 (0.8mm)", "w-3.5 h-3.5"],
                ] as const
              ).map(([key, title, dot]) => (
                <button
                  key={key}
                  type="button"
                  title={title}
                  onClick={() => setSize(key)}
                  className={`w-7 h-7 rounded flex items-center justify-center ${
                    size === key
                      ? "bg-surface-container-lowest shadow-sm text-on-surface"
                      : "text-secondary"
                  }`}
                >
                  <span className={`${dot} rounded-full bg-current`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-pad-base">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {hasInk ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-surface-dim" />
                )}
              </span>
              <span className="font-label-mono text-label-mono text-on-surface font-medium">
                {converting
                  ? busyLabel
                  : hasInk
                    ? readyHint
                    : "캔버스 비어 있음"}
              </span>
            </div>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] bg-surface-container-lowest overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full touch-none ${
              tool === "eraser" ? "cursor-cell" : "cursor-crosshair"
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
          />
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#baa998_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-tertiary-fixed-dim/40 pointer-events-none" />
          {!hasInk && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-secondary/50 font-label-ui text-label-ui">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  draw
                </span>
                마우스나 펜으로 글씨를 작성한 뒤 변환을 눌러 보세요
              </span>
            </div>
          )}
        </div>

        <div className="bg-surface-container-low px-pad-base md:px-pad-lg py-pad-md flex flex-wrap items-center justify-between gap-pad-base shadow-inner">
          <div className="flex items-center gap-pad-sm flex-wrap">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="inline-flex items-center gap-1.5 px-pad-md py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-ui text-label-ui shadow-sm disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[16px]">undo</span>
              <span>실행 취소</span>
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="inline-flex items-center gap-1.5 px-pad-md py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-ui text-label-ui shadow-sm disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[16px]">redo</span>
              <span>다시 실행</span>
            </button>
            <div className="w-px h-5 bg-surface-dim mx-1" />
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 px-pad-md py-1.5 rounded-lg text-secondary font-label-ui text-label-ui"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>전체 지우기</span>
            </button>
          </div>
          <button
            type="button"
            onClick={convert}
            disabled={converting || !hasInk}
            className="inline-flex items-center gap-2 px-pad-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-headline-sm text-[15px] font-medium shadow disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {converting ? "progress_activity" : actionIcon}
            </span>
            <span>{converting ? busyLabel : actionLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
