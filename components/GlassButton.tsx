"use client";

import React from "react";
import GlassSurface, { GlassSurfaceProps } from "./GlassSurface";

export interface GlassButtonProps extends Omit<GlassSurfaceProps, "children"> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  buttonClassName?: string;
  style?: React.CSSProperties;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  width,
  height,
  borderRadius = 20,
  displace,
  distortionScale,
  redOffset,
  greenOffset,
  blueOffset,
  brightness,
  opacity,
  mixBlendMode,
  className = "",
  style,
  onClick,
  type = "button",
  disabled = false,
  children,
  buttonClassName = "",
}) => {
  return (
    <GlassSurface
      width={width}
      height={height}
      borderRadius={borderRadius}
      displace={displace}
      distortionScale={distortionScale}
      redOffset={redOffset}
      greenOffset={greenOffset}
      blueOffset={blueOffset}
      brightness={brightness}
      opacity={opacity}
      mixBlendMode={mixBlendMode}
      className={`glass-button-wrapper group hover:shadow-xl hover:shadow-white/20 transition-all duration-300 ${className}`}
      style={style}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full h-full
          flex items-center justify-center
          text-white font-medium
          cursor-pointer
          select-none
          active:scale-[0.98]
          transition-transform duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          relative z-10
          ${buttonClassName}
        `}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
        }}
      >
        {/* Glass glow overlay - hover efekti */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]"
          style={{
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
            borderRadius: `${borderRadius}px`,
          }}
        />
        {/* İçerik - tam ortalanmış */}
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
      </button>
    </GlassSurface>
  );
};

export default GlassButton;

