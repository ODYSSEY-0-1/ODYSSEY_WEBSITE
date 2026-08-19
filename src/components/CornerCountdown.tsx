"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MiniDigit = ({ value, label }: { value: string | number; label: string }) => {
  const formattedValue = typeof value === "number" ? String(value).padStart(2, "0") : value;

  return (
    <div className="mini-countdown-card group">
      {/* Corner Accents */}
      <div className="mini-corner top-left" />
      <div className="mini-corner top-right" />
      <div className="mini-corner bottom-left" />
      <div className="mini-corner bottom-right" />

      {/* Digit Display */}
      <div className="mini-digit-box">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formattedValue}
            initial={{ y: -8, opacity: 0, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 8, opacity: 0, filter: "blur(2px)" }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mini-digit-value"
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Subtle Horizontal Divider */}
      <div className="mini-card-divider" />

      {/* Label */}
      <span className="mini-digit-label">{label}</span>
    </div>
  );
};

export default function CornerCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 42,
    hours: 16,
    minutes: 19,
    seconds: 36,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const storedTarget = typeof window !== "undefined" ? localStorage.getItem("odyssey_target_date") : null;
    let targetTime: number;

    if (storedTarget) {
      targetTime = parseInt(storedTarget, 10);
      if (isNaN(targetTime) || targetTime <= Date.now()) {
        targetTime = Date.now() + (42 * 86400 + 16 * 3600 + 19 * 60 + 36) * 1000;
        localStorage.setItem("odyssey_target_date", targetTime.toString());
      }
    } else {
      targetTime = Date.now() + (42 * 86400 + 16 * 3600 + 19 * 60 + 36) * 1000;
      if (typeof window !== "undefined") {
        localStorage.setItem("odyssey_target_date", targetTime.toString());
      }
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = Math.max(0, targetTime - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="corner-countdown-wrapper">
      <div className="corner-countdown-container">
        {/* DAYS */}
        <MiniDigit
          value={isClient ? String(timeLeft.days).padStart(2, "0") : "42"}
          label="days"
        />

        {/* SEPARATOR */}
        <div className="mini-separator">
          <span className="mini-dot">◆</span>
          <span className="mini-dot">◆</span>
        </div>

        {/* HOURS (00–23) */}
        <MiniDigit
          value={isClient ? String(timeLeft.hours).padStart(2, "0") : "16"}
          label="hours"
        />

        {/* SEPARATOR */}
        <div className="mini-separator">
          <span className="mini-dot">◆</span>
          <span className="mini-dot">◆</span>
        </div>

        {/* MINUTES (00–59) */}
        <MiniDigit
          value={isClient ? String(timeLeft.minutes).padStart(2, "0") : "19"}
          label="min"
        />

        {/* SEPARATOR */}
        <div className="mini-separator">
          <span className="mini-dot">◆</span>
          <span className="mini-dot">◆</span>
        </div>

        {/* SECONDS (00–59) */}
        <MiniDigit
          value={isClient ? String(timeLeft.seconds).padStart(2, "0") : "36"}
          label="sec"
        />
      </div>
    </div>
  );
}
