"use client"

import type React from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Type, Minus, Plus, Sun, Moon, BookOpen } from "lucide-react"

interface ReaderControlsProps {
  onFontSizeChange: (size: number) => void
  onLineHeightChange: (height: number) => void
  onThemeChange: (theme: "light" | "dark" | "sepia") => void
  fontSize: number
  lineHeight: number
  theme: "light" | "dark" | "sepia"
}

export function ReaderControls({
  onFontSizeChange,
  onLineHeightChange,
  onThemeChange,
  fontSize,
  lineHeight,
  theme,
}: ReaderControlsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background">
          <Type className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6" align="end">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Reading Settings</h3>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Font Size</label>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 bg-transparent"
                onClick={() => onFontSizeChange(Math.max(14, fontSize - 2))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => onFontSizeChange(value)}
                min={14}
                max={24}
                step={2}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 bg-transparent"
                onClick={() => onFontSizeChange(Math.min(24, fontSize + 2))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Line Spacing</label>
              <span className="text-sm text-muted-foreground">{lineHeight.toFixed(1)}</span>
            </div>
            <Slider
              value={[lineHeight]}
              onValueChange={([value]) => onLineHeightChange(value)}
              min={1.4}
              max={2.2}
              step={0.2}
            />
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Reading Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => onThemeChange("light")}
                className="gap-2"
              >
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => onThemeChange("dark")}
                className="gap-2"
              >
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </Button>
              <Button
                variant={theme === "sepia" ? "default" : "outline"}
                size="sm"
                onClick={() => onThemeChange("sepia")}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Sepia</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
