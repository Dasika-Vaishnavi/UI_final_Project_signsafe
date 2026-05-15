import { useEffect, useRef, useState } from "react";
import { parseGIF, decompressFrames, type ParsedFrame } from "gifuct-js";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  playing: boolean;
  speed: number;
  replayKey: number;
  className?: string;
  pausedClassName?: string;
  onError?: () => void;
};

type Decoded = {
  width: number;
  height: number;
  frames: ParsedFrame[];
};

const cache = new Map<string, Promise<Decoded>>();

function loadGif(src: string): Promise<Decoded> {
  let p = cache.get(src);
  if (p) return p;
  p = (async () => {
    const buf = await fetch(src).then((r) => {
      if (!r.ok) throw new Error(`GIF fetch ${r.status}`);
      return r.arrayBuffer();
    });
    const gif = parseGIF(buf);
    const lsd = (gif as unknown as { lsd: { width: number; height: number } | null }).lsd;
    if (!lsd) throw new Error("GIF missing logical screen descriptor");
    const frames = decompressFrames(gif, true);
    if (!frames || frames.length === 0) throw new Error("GIF has no frames");
    return { width: lsd.width, height: lsd.height, frames };
  })();
  cache.set(src, p);
  p.catch(() => cache.delete(src));
  return p;
}

export function GifPlayer({
  src,
  alt,
  playing,
  speed,
  replayKey,
  className,
  pausedClassName,
  onError,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const prevImageRef = useRef<ImageData | null>(null);
  const decodedRef = useRef<Decoded | null>(null);
  const frameIdxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const [ready, setReady] = useState(false);

  playingRef.current = playing;
  speedRef.current = speed;

  // Load + decode whenever src changes
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    decodedRef.current = null;
    frameIdxRef.current = 0;
    prevImageRef.current = null;

    loadGif(src)
      .then((d) => {
        if (cancelled) return;
        decodedRef.current = d;
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = d.width;
          canvas.height = d.height;
          canvas.getContext("2d")?.clearRect(0, 0, d.width, d.height);
        }
        offscreenRef.current = document.createElement("canvas");
        offscreenRef.current.width = d.width;
        offscreenRef.current.height = d.height;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) onError?.();
      });

    return () => {
      cancelled = true;
    };
  }, [src, onError]);

  // Draw a single frame, respecting disposal
  const drawFrame = (idx: number) => {
    const dec = decodedRef.current;
    const canvas = canvasRef.current;
    const off = offscreenRef.current;
    if (!dec || !canvas || !off) return;
    const ctx = canvas.getContext("2d");
    const offCtx = off.getContext("2d");
    if (!ctx || !offCtx) return;

    const frame = dec.frames[idx];
    const prevDisposal = idx > 0 ? dec.frames[idx - 1].disposalType : 0;

    if (idx === 0) {
      offCtx.clearRect(0, 0, dec.width, dec.height);
    } else if (prevDisposal === 2) {
      const prev = dec.frames[idx - 1];
      offCtx.clearRect(prev.dims.left, prev.dims.top, prev.dims.width, prev.dims.height);
    } else if (prevDisposal === 3 && prevImageRef.current) {
      offCtx.putImageData(prevImageRef.current, 0, 0);
    }

    if (frame.disposalType === 3) {
      prevImageRef.current = offCtx.getImageData(0, 0, dec.width, dec.height);
    }

    // Patch frame onto offscreen
    const patchCanvas = document.createElement("canvas");
    patchCanvas.width = frame.dims.width;
    patchCanvas.height = frame.dims.height;
    const patchCtx = patchCanvas.getContext("2d")!;
    const imageData = patchCtx.createImageData(frame.dims.width, frame.dims.height);
    imageData.data.set(frame.patch);
    patchCtx.putImageData(imageData, 0, 0);
    offCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

    ctx.clearRect(0, 0, dec.width, dec.height);
    ctx.drawImage(off, 0, 0);
  };

  // Animation loop
  useEffect(() => {
    if (!ready) return;

    const clear = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const tick = () => {
      const dec = decodedRef.current;
      if (!dec) return;
      drawFrame(frameIdxRef.current);
      const frame = dec.frames[frameIdxRef.current];
      const baseDelay = Math.max(frame.delay || 100, 20);
      const delay = Math.max(20, baseDelay / Math.max(speedRef.current, 0.1));
      frameIdxRef.current = (frameIdxRef.current + 1) % dec.frames.length;
      if (frameIdxRef.current === 0) {
        prevImageRef.current = null;
      }
      if (playingRef.current) {
        timerRef.current = setTimeout(tick, delay);
      }
    };

    // Always render at least the current frame
    drawFrame(frameIdxRef.current);

    if (playing) {
      // advance immediately
      const dec = decodedRef.current;
      if (dec && dec.frames.length > 0) {
        const frame = dec.frames[frameIdxRef.current];
        const baseDelay = Math.max(frame.delay || 100, 20);
        const delay = Math.max(20, baseDelay / Math.max(speed, 0.1));
        frameIdxRef.current = (frameIdxRef.current + 1) % dec.frames.length;
        if (frameIdxRef.current === 0) prevImageRef.current = null;
        timerRef.current = setTimeout(tick, delay);
      }
    }

    return clear;
  }, [ready, playing, speed]);

  // Replay: jump to frame 0
  useEffect(() => {
    frameIdxRef.current = 0;
    prevImageRef.current = null;
    if (ready) drawFrame(0);
  }, [replayKey, ready]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={cn(className, !playing && pausedClassName)}
    />
  );
}
