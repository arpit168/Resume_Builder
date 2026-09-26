"use client";

import React, { useState, useEffect } from "react";
import { Loader } from "../Loader";

export function InitialLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // Completely remove the splash screen from DOM after 3 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] transition-opacity duration-500 pointer-events-none print:hidden ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <Loader />
        </div>
      )}
      {children}
    </>
  );
}
