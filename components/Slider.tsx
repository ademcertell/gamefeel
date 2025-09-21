import { clsx } from "clsx";

type Props = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  note?: string;
};

export default function Slider({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  note,
}: Props) {
  return (
    <label className="grid gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-gray-400">{value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500 cursor-pointer"
      />
      {note && <p className="text-xs text-gray-500">{note}</p>}
    </label>
  );
}