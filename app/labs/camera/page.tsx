"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "@/components/Slider";
import {
  useCameraStore,
  defaultParams,
  type CameraParams,
} from "@/lib/cameraStore";
import { encodeParams, toEnum, toNumber } from "@/lib/url";
import { useSearchParams, useRouter } from "next/navigation";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function quadOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

export default function CameraLab() {
  const { params, setParam, hydrateFrom } = useCameraStore();
  const search = useSearchParams();
  const router = useRouter();

  // hydrate from URL
  useEffect(() => {
    const p: Partial<CameraParams> = {
      followSpeed: toNumber(
        search.get("followSpeed") ?? undefined,
        defaultParams.followSpeed
      ),
      lag: toNumber(search.get("lag") ?? undefined, defaultParams.lag),
      shake: toNumber(search.get("shake") ?? undefined, defaultParams.shake),
      easing: toEnum(
        search.get("easing") ?? undefined,
        ["linear", "easeInOut", "quadOut"] as const,
        defaultParams.easing
      ),
    };
    hydrateFrom(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // canvas sim
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    const size = { w: canvas.width, h: canvas.height };

    const target = { x: size.w / 2, y: size.h / 2, vx: 0, vy: 0 };
    const cam = { x: size.w / 2, y: size.h / 2, shake: 0 };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      target.vx = (mx - target.x) * 0.12;
      target.vy = (my - target.y) * 0.12;
    };
    canvas.addEventListener("mousemove", onMove);

    const onClick = () => {
      cam.shake = Math.min(cam.shake + params.shake, 20);
    };
    canvas.addEventListener("click", onClick);

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      // move target
      target.x += target.vx;
      target.y += target.vy;
      target.vx *= 1 - 0.12;
      target.vy *= 1 - 0.12;

      // desired camera position with lag
      const desiredX = target.x - params.lag * 80 * target.vx;
      const desiredY = target.y - params.lag * 80 * target.vy;

      // easing selection
      const t = params.followSpeed;
      let alpha = t;
      if (params.easing === "easeInOut") alpha = easeInOut(t);
      else if (params.easing === "quadOut") alpha = quadOut(t);

      cam.x = lerp(cam.x, desiredX, alpha);
      cam.y = lerp(cam.y, desiredY, alpha);

      // shake decay
      if (cam.shake > 0) cam.shake = Math.max(0, cam.shake - 60 * dt);

      // render
      ctx.clearRect(0, 0, size.w, size.h);

      const sx = (Math.random() - 0.5) * cam.shake;
      const sy = (Math.random() - 0.5) * cam.shake;

      ctx.save();
      ctx.translate(-cam.x + size.w / 2 + sx, -cam.y + size.h / 2 + sy);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      for (let x = -1000; x <= 1000; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, -1000);
        ctx.lineTo(x, 1000);
        ctx.stroke();
      }
      for (let y = -1000; y <= 1000; y += 40) {
        ctx.beginPath();
        ctx.moveTo(-1000, y);
        ctx.lineTo(1000, y);
        ctx.stroke();
      }

      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(target.x, target.y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      if (running) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [running, params.followSpeed, params.lag, params.easing, params.shake]);

  // 🔧 Hydration fix: always relative path
  const sharePath = useMemo(() => {
    const query = encodeParams(params as any);
    return `/labs/camera?${query}`;
  }, [params]);

  const syncUrl = () => {
    const query = encodeParams(params as any);
    router.replace(`/labs/camera?${query}`);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,320px] gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Camera Follow Lab</h1>
          <button
            className="text-sm underline"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? "Pause" : "Resume"}
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full rounded-xl border bg-white"
          aria-label="Move your mouse. Click to add shake."
          title="Move your mouse. Click to add shake."
        />
        <p className="text-sm text-slate-600 mt-2">
          Move your mouse to create velocity. Click canvas to add screen shake.
        </p>
      </div>

      <aside className="card">
        <h2 className="font-medium mb-3">Parameters</h2>
        <div className="grid gap-3">
          <Slider
            label="Follow Speed"
            min={0}
            max={1}
            step={0.005}
            value={params.followSpeed}
            onChange={(v) => setParam("followSpeed", v)}
            note="How quickly camera closes distance to target each frame."
          />
          <Slider
            label="Lag"
            min={0}
            max={1}
            step={0.005}
            value={params.lag}
            onChange={(v) => setParam("lag", v)}
            note="Offsets based on velocity to simulate trailing camera."
          />
          <label className="grid gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Easing</span>
              <span className="text-xs text-slate-600">{params.easing}</span>
            </div>
            <select
              className="border rounded-lg p-2"
              value={params.easing}
              onChange={(e) => setParam("easing", e.target.value as any)}
            >
              <option value="linear">linear</option>
              <option value="easeInOut">easeInOut</option>
              <option value="quadOut">quadOut</option>
            </select>
            <p className="text-xs text-slate-500">
              Transforms follow speed non-linearly.
            </p>
          </label>
          <Slider
            label="Shake"
            min={0}
            max={10}
            step={0.1}
            value={params.shake}
            onChange={(v) => setParam("shake", v)}
            note="Click canvas to add instantaneous shake (decays over time)."
          />
        </div>

        <div className="mt-4 grid gap-2">
          <button
            onClick={() => {
              hydrateFrom({ ...defaultParams });
              syncUrl();
            }}
            className="px-3 py-2 rounded-xl border hover:bg-slate-50"
          >
            Reset to defaults
          </button>

          <button
            onClick={() => {
              syncUrl();
              const full =
                (typeof window !== "undefined" ? window.location.origin : "") +
                sharePath;
              navigator.clipboard?.writeText(full);
              alert("Share URL copied to clipboard!\n" + full);
            }}
            className="px-3 py-2 rounded-xl bg-brand text-white"
          >
            Copy Share URL
          </button>

          <p className="text-xs text-slate-500 break-all">{sharePath}</p>
        </div>
      </aside>
    </div>
  );
}