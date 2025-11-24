"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse pozisyonunu takip et
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-[40px]
        border border-white/25
        text-white font-medium
        rounded-2xl
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.5)]
        hover:border-white/35
        transition-all duration-500
        cursor-pointer
        select-none
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* iOS 26 Liquid Glass - Çok katmanlı cam yüzeyi */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/3 to-white/8 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent rounded-2xl" />
      
      {/* Liquid glass - Mouse pozisyonuna göre dinamik ışık yansıması */}
      {isHovered && (
        <>
          {/* Ana highlight - mouse'u takip eden parlak nokta */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            initial={false}
            animate={{
              x: mousePosition.x - 80,
              y: mousePosition.y - 80,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
            style={{
              width: 160,
              height: 160,
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)",
              filter: "blur(25px)",
              opacity: 0.8,
            }}
          />
          
          {/* İkincil highlight - daha büyük ve yumuşak */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            initial={false}
            animate={{
              x: mousePosition.x - 120,
              y: mousePosition.y - 120,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 30,
            }}
            style={{
              width: 240,
              height: 240,
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
              filter: "blur(35px)",
              opacity: 0.6,
            }}
          />
          
          {/* Üçüncül highlight - ambient glow */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            initial={false}
            animate={{
              x: mousePosition.x - 150,
              y: mousePosition.y - 150,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 25,
            }}
            style={{
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%)",
              filter: "blur(45px)",
              opacity: 0.4,
            }}
          />
        </>
      )}

      {/* Liquid glass distortion - dinamik gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)`
            : "transparent",
          transition: "background 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Liquid glass border - iOS 26 tarzı ince border */}
      <div className="absolute inset-0 rounded-2xl border border-white/25" />
      
      {/* İç border highlight */}
      <div className="absolute inset-[1px] rounded-2xl border border-white/5" />
      
      {/* İçerik */}
      <span className="relative z-10 block">{children}</span>
    </button>
  );
};

export default LiquidGlassButton;

