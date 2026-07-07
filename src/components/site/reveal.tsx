"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Aparición al hacer scroll: fade + desplazamiento sutil.
 * `reducedMotion="user"` desactiva los transforms para usuarios con
 * "reducir movimiento", manteniendo el fade (sin ramas SSR/cliente).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
