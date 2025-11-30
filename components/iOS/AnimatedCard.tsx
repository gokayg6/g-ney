"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <motion.div
      className={className}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={{ scale: 0.94 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      style={{
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
      }}
    >
      {children}
    </motion.div>
  );
};

