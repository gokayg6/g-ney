"use client";

import React from "react";
import { useTheme } from "next-themes";

export interface GlassSurfaceProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  displace?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  brightness?: number;
  opacity?: number;
  mixBlendMode?: "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  width,
  height,
  borderRadius = 16,
  displace = 0,
  distortionScale = 0,
  redOffset = 0,
  greenOffset = 0,
  blueOffset = 0,
  brightness = 100,
  opacity = 0.8,
  mixBlendMode = "normal",
  className = "",
  style,
  children,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Filter string oluştur
  const buildFilterString = (): string => {
    const filters: string[] = [];
    
    // Light modda brightness daha yüksek, dark modda normal
    const adjustedBrightness = isDark ? brightness : Math.min(120, brightness + 10);
    if (adjustedBrightness !== 100) {
      filters.push(`brightness(${adjustedBrightness}%)`);
    }
    
    if (displace !== 0 || distortionScale !== 0) {
      const blur = Math.abs(distortionScale) || 10;
      filters.push(`drop-shadow(${displace}px ${displace}px ${blur}px rgba(${Math.min(255, Math.max(0, 255 + redOffset))}, ${Math.min(255, Math.max(0, 255 + greenOffset))}, ${Math.min(255, Math.max(0, 255 + blueOffset))}, 0.4))`);
    }
    
    return filters.length > 0 ? filters.join(" ") : "";
  };

  const filterString = buildFilterString();

  // Light/Dark moda göre renkler
  const bgOpacity = isDark ? opacity * 0.1 : opacity * 0.15;
  const borderOpacity = isDark ? opacity * 0.2 : opacity * 0.3;
  const shadowColor = isDark 
    ? "rgba(31, 38, 135, 0.37)" 
    : "rgba(0, 0, 0, 0.1)";

  const baseStyle: React.CSSProperties = {
    width: width ? `${width}px` : "auto",
    height: height ? `${height}px` : "auto",
    borderRadius: `${borderRadius}px`,
    backdropFilter: `blur(20px) saturate(180%)`,
    WebkitBackdropFilter: `blur(20px) saturate(180%)`,
    backgroundColor: isDark 
      ? `rgba(255, 255, 255, ${bgOpacity})` 
      : `rgba(255, 255, 255, ${bgOpacity})`,
    border: isDark
      ? `1px solid rgba(255, 255, 255, ${borderOpacity})`
      : `1px solid rgba(0, 0, 0, ${borderOpacity * 0.3})`,
    boxShadow: `0 8px 32px 0 ${shadowColor}`,
    filter: filterString || undefined,
    mixBlendMode: mixBlendMode,
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div
      className={`glass-surface ${className}`}
      style={{ ...baseStyle, ...style }}
    >
      {children}
    </div>
  );
};

export default GlassSurface;

