"use client";

import React from "react";
import { useTheme } from "next-themes";

interface CardBoxProps {
  children: React.ReactNode;
  variant?: "light" | "dark" | "auto";
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const CardBox: React.FC<CardBoxProps> = ({
  children,
  variant = "auto",
  className = "",
  padding = "md",
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Variant'a göre tema belirleme
  const effectiveVariant =
    variant === "auto" ? (isDark ? "dark" : "light") : variant;

  // Padding sınıfları
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Light mode için stil
  const lightStyles = {
    background: "bg-white/90",
    border: "border border-slate-200",
    shadow: "shadow-lg",
  };

  // Dark mode için stil
  const darkStyles = {
    background: "bg-slate-900/80",
    border: "border border-slate-700",
    shadow: "shadow-xl",
  };

  const styles =
    effectiveVariant === "light" ? lightStyles : darkStyles;

  return (
    <div
      className={`
        ${styles.background}
        ${styles.border}
        ${styles.shadow}
        ${paddingClasses[padding]}
        rounded-2xl
        transition-all duration-500 ease-out
        ${className}
      `}
    >
      {/* İçerik - kullanıcı kendi stilini uygulayabilir */}
      <div className="[&_h1]:text-slate-900 [&_h1]:dark:text-slate-50 [&_h1]:text-lg [&_h1]:md:text-xl [&_h1]:font-semibold [&_h1]:mb-3
                      [&_h2]:text-slate-900 [&_h2]:dark:text-slate-50 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-semibold [&_h2]:mb-3
                      [&_h3]:text-slate-900 [&_h3]:dark:text-slate-50 [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-semibold [&_h3]:mb-3
                      [&_p]:text-slate-600 [&_p]:dark:text-slate-400 [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default CardBox;

