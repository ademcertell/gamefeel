"use client";

import { create } from "zustand";

export type CameraParams = {
  followSpeed: number; // how fast camera closes distance to target (0..1)
  lag: number; // additional delay (0..1)
  easing: "linear" | "easeInOut" | "quadOut";
  shake: number; // screen shake intensity on click
};

export const defaultParams: CameraParams = {
  followSpeed: 0.12,
  lag: 0.1,
  easing: "easeInOut",
  shake: 0.0,
};

type State = {
  params: CameraParams;
  setParam: <K extends keyof CameraParams>(k: K, v: CameraParams[K]) => void;
  hydrateFrom: (p: Partial<CameraParams>) => void;
};

export const useCameraStore = create<State>((set) => ({
  params: { ...defaultParams },
  setParam: (k, v) => set((s) => ({ params: { ...s.params, [k]: v } })),
  hydrateFrom: (p) => set(() => ({ params: { ...defaultParams, ...p } })),
}));