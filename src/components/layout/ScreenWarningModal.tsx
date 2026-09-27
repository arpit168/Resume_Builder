"use client";

import { useEffect, useRef, useState } from "react";
import { X, Monitor } from "lucide-react";

const TOTAL_SECONDS = 7;
const ENABLE_CLOSE_AFTER_MS = 2000;

export function ScreenWarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  // Use a ref for isPaused so the countdown interval can read it without re-creating
  const isPausedRef = useRef(false);

  useEffect(() => {
    // Only show on first visit per session
    const hasSeen = sessionStorage.getItem("hasSeenScreenWarning");
    if (!hasSeen) {
      sessionStorage.setItem("hasSeenScreenWarning", "true");
      setTimeout(() => setIsOpen(true), 100);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Enable close button after ENABLE_CLOSE_AFTER_MS
    const enableCloseTimer = setTimeout(() => {
      setCanClose(true);
    }, ENABLE_CLOSE_AFTER_MS);

    return () => clearTimeout(enableCloseTimer);
  }, [isOpen]);

  // Single stable countdown — reads isPaused via ref to avoid recreating every second
  useEffect(() => {
    if (!isOpen) return;

    const countdownInterval = setInterval(() => {
      if (isPausedRef.current) return; // skip tick while paused

      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isOpen]); // runs once when modal opens, stable from then on

  const handleInteraction = () => {
    if (!isPaused) {
      isPausedRef.current = true;
      setIsPaused(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white dark:bg-[#151B2B] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-300"
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            For the Best Experience
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Please use a big screen (Desktop or Laptop) to access all features
            comfortably while building your perfect resume.
          </p>

          <button
            onClick={() => canClose && setIsOpen(false)}
            disabled={!canClose}
            aria-label={
              canClose ? "Continue to app" : `Please wait ${timeLeft} seconds`
            }
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 ${
              canClose
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            }`}
          >
            {canClose ? (
              <>
                Continue to App
                <X className="w-4 h-4 ml-1" />
              </>
            ) : (
              `Please wait... ${isPaused ? "" : `(${timeLeft}s)`}`
            )}
          </button>
        </div>

        {/* Progress bar */}
        {!isPaused && (
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / TOTAL_SECONDS) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
