"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavSignpostProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (sectionId: string) => void;
}

export default function NavSignpost({ isOpen, onClose, onNavigate }: NavSignpostProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest(".home-icon-wrapper")
      ) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (target: string) => {
    if (onNavigate) {
      onNavigate(target);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-Screen Page Background Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-black/65 backdrop-blur-md cursor-pointer pointer-events-auto"
          />

          {/* Signpost Totem - Placed Directly on Ground (Bottom-0, Zero Gap) */}
          <motion.div
            ref={containerRef}
            initial={{ y: 120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // Cinematic smooth spring/ease
            }}
            className="fixed z-[9995] bottom-0 left-[16px] sm:left-[24px] pointer-events-auto flex flex-col items-center select-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="signpost-close-btn"
              aria-label="Close menu"
            >
              ✕
            </button>

            {/* Signpost Artwork Connected Directly to Ground */}
            <div className="signpost-artwork-box">
              <img
                src="/nav-signpost-transparent.png"
                alt="Odyssey Navigation Signpost"
                className="signpost-transparent-img"
              />

              {/* Interactive Hitbox Buttons */}
              <div className="signpost-hotspots-layer">
                {/* 1. EVENTS */}
                <button
                  onClick={() => handleItemClick("timeline")}
                  className="nav-hitbox hitbox-events group"
                  title="Events & Timeline"
                >
                  <div className="nav-hitbox-glow" />
                </button>

                {/* 2. GALLERY */}
                <button
                  onClick={() => handleItemClick("about")}
                  className="nav-hitbox hitbox-gallery group"
                  title="Gallery & About"
                >
                  <div className="nav-hitbox-glow" />
                </button>

                {/* 3. MERCHANDISE */}
                <button
                  onClick={() => handleItemClick("sponsors")}
                  className="nav-hitbox hitbox-merch group"
                  title="Merchandise & Sponsors"
                >
                  <div className="nav-hitbox-glow" />
                </button>

                {/* 4. TEAMS */}
                <button
                  onClick={() => handleItemClick("faq")}
                  className="nav-hitbox hitbox-teams group"
                  title="Teams & FAQ"
                >
                  <div className="nav-hitbox-glow" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
