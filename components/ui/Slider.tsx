
import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({ label, min, max, value, onChange, step = 1 }) => {
  return (
    <div className="w-full">
      <label className="flex justify-between items-center text-sm font-medium text-slate-300 mb-1">
        <span>{label}</span>
        <span className="font-bold text-red-400">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
      />
    </div>
  );
};