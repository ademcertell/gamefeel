"use client";

import { useState } from "react";
import Slider from "@/components/Slider";
import { CameraParams, defaultParams } from "@/lib/cameraStore";
import CameraLab from "@/components/CameraLabs";

export default function ComparePage() {
  // Preset A & B state
  const [leftParams, setLeftParams] = useState<CameraParams>(defaultParams);
  const [rightParams, setRightParams] = useState<CameraParams>(defaultParams);

  const [leftUrl, setLeftUrl] = useState("");
  const loadPresetFromUrl = (url: string) => {
    try {
      const search = new URL(url).searchParams;
      const easing = search.get("easing");

      setLeftParams({
        followSpeed: parseFloat(
          search.get("followSpeed") ?? `${defaultParams.followSpeed}`
        ),
        lag: parseFloat(search.get("lag") ?? `${defaultParams.lag}`),
        easing:
          easing === "linear" || easing === "easeInOut" || easing === "quadOut"
            ? easing
            : defaultParams.easing,
        shake: parseFloat(search.get("shake") ?? `${defaultParams.shake}`),
      });
    } catch (e) {
      alert("Invalid URL!");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-400 text-center">
        Compare Presets
      </h1>
      <p className="text-center text-gray-400 max-w-xl mx-auto">
        Compare two sets of parameters side by side. Load your custom preset
        into A or adjust both manually.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-blue-600 bg-white/5 backdrop-blur p-4">
          <h2 className="text-lg font-semibold text-blue-400 mb-2">Preset A</h2>
          <CameraLab params={leftParams} onChange={setLeftParams} embed />
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Paste Camera Lab URL here..."
              className="w-full p-2 rounded bg-black border border-gray-700 text-gray-200"
              value={leftUrl}
              onChange={(e) => setLeftUrl(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white w-full"
              onClick={() => loadPresetFromUrl(leftUrl)}
            >
              Load Preset A
            </button>
          </div>
          <div className="mt-4 space-y-3">
            <Slider
              label="Follow Speed"
              min={0}
              max={1}
              step={0.01}
              value={leftParams.followSpeed}
              onChange={(v) => setLeftParams({ ...leftParams, followSpeed: v })}
            />
            <Slider
              label="Lag"
              min={0}
              max={1}
              step={0.01}
              value={leftParams.lag}
              onChange={(v) => setLeftParams({ ...leftParams, lag: v })}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-green-600 bg-white/5 backdrop-blur p-4">
          <h2 className="text-lg font-semibold text-green-400 mb-2">
            Preset B
          </h2>
          <CameraLab params={rightParams} onChange={setRightParams} embed />
          <div className="mt-4 space-y-3">
            <Slider
              label="Follow Speed"
              min={0}
              max={1}
              step={0.01}
              value={rightParams.followSpeed}
              onChange={(v) =>
                setRightParams({ ...rightParams, followSpeed: v })
              }
            />
            <Slider
              label="Lag"
              min={0}
              max={1}
              step={0.01}
              value={rightParams.lag}
              onChange={(v) => setRightParams({ ...rightParams, lag: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}