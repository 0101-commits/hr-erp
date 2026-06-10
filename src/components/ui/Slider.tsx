import type { ChangeEvent } from "react";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  ariaLabel,
}: SliderProps) {
  const ratio = max > min ? ((value - min) / (max - min)) * 100 : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <input
      type="range"
      className="nx-slider w-full"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      aria-label={ariaLabel}
      style={{
        background: `linear-gradient(to right, #000000 0%, #000000 ${ratio}%, #ECECEE ${ratio}%, #ECECEE 100%)`,
      }}
    />
  );
}
