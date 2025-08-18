"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  className?: string;
}

const PRESET_COLORS = [
  "#DC2626", // Red
  "#EA580C", // Orange
  "#D97706", // Amber
  "#CA8A04", // Yellow
  "#65A30D", // Lime
  "#16A34A", // Green
  "#0D9488", // Teal
  "#0891B2", // Cyan
  "#0284C7", // Sky
  "#2563EB", // Blue
  "#4F46E5", // Indigo
  "#7C3AED", // Violet
  "#9333EA", // Purple
  "#C026D3", // Fuchsia
  "#E11D48", // Rose
  "#6B7280", // Gray
  "#374151", // Gray Dark
  "#1F2937", // Gray Darker
  "#111827", // Gray Darkest
];

export function ColorPicker({ value = "#000000", onValueChange, label, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setInputValue(color);
    onValueChange?.(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onValueChange?.(newValue);
    }
  };

  const handleInputBlur = () => {
    // Reset to valid value if input is invalid
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-2"
              style={{ backgroundColor: value }}
            >
              <Palette className="h-4 w-4 text-white drop-shadow-sm" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Colores predefinidos</Label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color personalizado</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 p-1 border-2"
                  />
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  );
}
