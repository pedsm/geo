"use client";

import { Slider } from "@/components/ui/slider";

interface YearSliderProps {
  onYearChange: (year: number) => void;
  selectedYear: number;
}

export default function YearSlider({ onYearChange, selectedYear }: YearSliderProps) {
  return (
    <div className="w-full bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex justify-between mb-4 items-center">
        <span className="text-sm font-bold text-gray-600">2000</span>
        <span className="text-3xl font-bold text-blue-600">{selectedYear}</span>
        <span className="text-sm font-bold text-gray-600">2025</span>
      </div>
      <Slider
        defaultValue={[selectedYear]}
        min={2000}
        max={2025}
        step={1}
        value={[selectedYear]}
        onValueChange={(vals) => onYearChange(vals[0])}
        className="w-full cursor-pointer"
      />
    </div>
  );
}
