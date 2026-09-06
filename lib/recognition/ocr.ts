import type { OcrResult } from "./types";

function cropInk(source: HTMLCanvasElement) {
  const ctx = source.getContext("2d");
  if (!ctx) return null;

  const { width, height } = source;
  const { data } = ctx.getImageData(0, 0, width, height);
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX <= minX || maxY <= minY) return null;

  const pad = 28;
  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(width - sx, maxX - minX + pad * 2);
  const sh = Math.min(height - sy, maxY - minY + pad * 2);
  const scale = 2;

  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(sw * scale));
  out.height = Math.max(1, Math.round(sh * scale));
  const outCtx = out.getContext("2d");
  if (!outCtx) return null;
  outCtx.fillStyle = "#ffffff";
  outCtx.fillRect(0, 0, out.width, out.height);
  outCtx.imageSmoothingEnabled = true;
  outCtx.drawImage(source, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out;
}

export function canvasHasInk(source: HTMLCanvasElement) {
  return cropInk(source) !== null;
}

export async function recognizeHandwriting(
  source: HTMLCanvasElement,
): Promise<OcrResult> {
  const cropped = cropInk(source);
  if (!cropped) {
    throw new Error("먼저 캔버스에 글씨를 작성해 주세요.");
  }

  const image = cropped.toDataURL("image/png").split(",")[1];
  const started = performance.now();
  const response = await fetch("/api/recognize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });
  const data = (await response.json()) as { text?: string; error?: string };

  if (!response.ok || !data.text) {
    throw new Error(data.error ?? "변환에 실패했습니다.");
  }

  return {
    text: data.text,
    confidence: 0,
    latencyMs: Math.round(performance.now() - started),
  };
}
