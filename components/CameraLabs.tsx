"use client";

import { useEffect, useRef, useState } from "react";
import Slider from "@/components/Slider";
import { CameraParams, defaultParams } from "@/lib/cameraStore";

type CameraLabProps = {
  params: CameraParams;
  onChange: (newParams: CameraParams) => void;
  embed?: boolean;
};

export default function CameraLab({ params, onChange, embed }: CameraLabProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();

    const size = { w: canvas.width, h: canvas.height };
    const target = { x: size.w / 2, y: size.h / 2, vx: 0, vy: 0 };
    const cam = { x: size.w / 2, y: size.h / 2 };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      target.vx = (mx - target.x) * 0.12;
      target.vy = (my - target.y) * 0.12;
    };

    canvas.addEventListener("mousemove", onMove);

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      target.x += target.vx;
      target.y += target.vy;
      target.vx *= 1 - 0.12;
      target.vy *= 1 - 0.12;

      cam.x += (target.x - cam.x) * params.followSpeed;
      cam.y += (target.y - cam.y) * params.followSpeed;

      ctx.clearRect(0, 0, size.w, size.h);

      ctx.save();
      ctx.translate(-cam.x + size.w / 2, -cam.y + size.h / 2);

      ctx.strokeStyle = "#e2e8f0";
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

      ctx.restore();

      if (running) raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [params, running]);

  return (
    <div className={`grid ${embed ? "" : "lg:grid-cols-[1fr,320px] gap-6"}`}>
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
          height={500}
          className="neon-border bg-black rounded-xl w-full h-auto"
        />
      </div>

      {!embed && (
        <aside className="card">
          <h2 className="text-xl font-semibold text-blue-400 mb-3">
            Parameters
          </h2>
          <Slider
            label="Follow Speed"
            min={0}
            max={1}
            step={0.005}
            value={params.followSpeed}
            onChange={(v) => onChange({ ...params, followSpeed: v })}
            note="How quickly camera closes distance to target each frame."
          />
          <Slider
            label="Lag"
            min={0}
            max={1}
            step={0.005}
            value={params.lag}
            onChange={(v) => onChange({ ...params, lag: v })}
            note="Offsets based on velocity to simulate trailing camera."
          />
        </aside>
      )}
    </div>
  );
}