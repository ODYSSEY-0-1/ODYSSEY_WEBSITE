"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Smooth volume fade helper
  const fadeVolume = (target: number, duration = 1200) => {
    const vid = videoRef.current;
    if (!vid) return;
    const start = vid.volume;
    const diff = target - start;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      if (vid) {
        vid.volume = Math.max(0, Math.min(1, start + diff * ease));
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Trigger visual reveal entrance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    // Attempt unmuted automatic playback immediately
    async function startAutoPlay() {
      if (!vid) return;
      try {
        vid.muted = false;
        vid.volume = 1.0;
        await vid.play();
      } catch (err) {
        // Fallback: If browser enforces autoplay audio policy, start muted and auto-unlock sound on first interaction
        vid.muted = true;
        vid.play().catch(() => {});

        const enableAudio = () => {
          if (!vid) return;
          vid.muted = false;
          vid.volume = 0;
          fadeVolume(1.0, 1500);
          window.removeEventListener("click", enableAudio);
          window.removeEventListener("touchstart", enableAudio);
          window.removeEventListener("keydown", enableAudio);
          window.removeEventListener("pointerdown", enableAudio);
        };

        window.addEventListener("click", enableAudio, { once: true });
        window.addEventListener("touchstart", enableAudio, { once: true, passive: true });
        window.addEventListener("keydown", enableAudio, { once: true });
        window.addEventListener("pointerdown", enableAudio, { once: true });
      }
    }

    startAutoPlay();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleVideoEnded = () => {
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
      onClick={onComplete}
    >
      {/* Fullscreen Video */}
      <video
        ref={videoRef}
        src="/Odysseus_Wink_removed_smooth_HD_2ab2ed0e.mp4"
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleVideoEnded}
        className={`fixed top-0 left-0 w-screen h-screen object-cover z-10 transition-all duration-[2000ms] ease-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      />

      {/* Cinematic Vignette */}
      <div
        className="fixed inset-0 z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />
    </motion.div>
  );
}
