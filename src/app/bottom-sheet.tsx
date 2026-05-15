"use client";

/**
 * M3BottomSheet — a Material Design 3-styled bottom sheet built on
 * motion/react's AnimatePresence so it matches Actify's animation system.
 * We roll our own instead of using Actify's BottomSheetsContent because
 * that component wraps children in a <p>, which breaks for complex layouts.
 */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface M3BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Tailwind / inline className applied to the content container */
  className?: string;
}

export function M3BottomSheet({
  open,
  onClose,
  children,
  className,
}: M3BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and add Escape key handler while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        /* Scrim / backdrop */
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="m3-sheet-scrim"
          onClick={onClose}
        >
          {/* Sheet panel */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
            className="m3-sheet-inner"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div ref={handleRef} className="m3-sheet-grab">
              <div className="m3-sheet-handle" />
            </div>

            {/* Content */}
            <div className={className}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
