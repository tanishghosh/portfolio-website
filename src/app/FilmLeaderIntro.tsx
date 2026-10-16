"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// Section identifiers matching the lens navigation
type SectionId = "cover" | "career" | "education" | "projects" | "specs";

interface FilmLeaderIntroProps {
  darkMode: boolean;
  onFinish: () => void;
}

export function FilmLeaderIntro({ darkMode, onFinish }: FilmLeaderIntroProps) {
  const [countdown, setCountdown] = useState<number>(3);
  const [frameNumber, setFrameNumber] = useState<number>(24);
  const [flashCrimson, setFlashCrimson] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exitTriggered = useRef<boolean>(false);

  const triggerExit = useCallback(() => {
    if (exitTriggered.current) return;
    exitTriggered.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsExiting(true);
    setTimeout(() => onFinish(), 700);
  }, [onFinish]);

  useEffect(() => {
    // Preload images
    ["/leader_light_2.jpg", "/leader_light_1.jpg", "/leader_dark_2.jpg", "/leader_dark_1.jpg"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // 3 -> 2 -> 1, one tick every 850ms
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 3) {
          setFrameNumber(48);
          setFlashCrimson(true);
          setTimeout(() => setFlashCrimson(false), 90);
          return 2;
        } else if (prev === 2) {
          setFrameNumber(72);
          setFlashCrimson(true);
          setTimeout(() => setFlashCrimson(false), 90);
          return 1;
        }
        return prev;
      });
    }, 850);

    const handleKeyDown = () => triggerExit();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerExit]);

  // Watch countdown — when it reaches 1, start exit after one frame display
  useEffect(() => {
    if (countdown === 1) {
      const t = setTimeout(() => triggerExit(), 850);
      return () => clearTimeout(t);
    }
  }, [countdown, triggerExit]);

  const bgClass = darkMode ? "bg-[#0a0a0c]" : "bg-[#f4f1ea]";
  const textClass = darkMode ? "text-[#f4f1ea]" : "text-[#121212]";
  const borderClass = darkMode ? "border-[#f4f1ea]" : "border-[#121212]";
  const subtextClass = darkMode ? "text-[#8c8576]" : "text-[#6b665c]";
  const crimsonClass = darkMode ? "bg-[#e0283f]" : "bg-[#c8102e]";
  const crimsonText = darkMode ? "text-[#e0283f]" : "text-[#c8102e]";
  const secondaryBorder = darkMode ? "border-[#2a2824]" : "border-[#cfc8b8]";
  const letterboxBg = darkMode ? "bg-[#000000]" : "bg-[#121212]";

  const progressPercent = countdown === 3 ? "33%" : countdown === 2 ? "66%" : "100%";

  return (
    <div
      onClick={() => {
        setIsExiting(true);
        setTimeout(onFinish, 300);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-start overflow-hidden ${bgClass} cursor-pointer transition-opacity duration-700 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      title="Click or press any key to skip intro"
    >
      {/* Film grain layer */}
      <div
        className={`flex items-start absolute inset-0 pointer-events-none animate-film-grain ${
          darkMode
            ? "opacity-[0.05] bg-[radial-gradient(circle,#f4f1ea_0.6px,transparent_0.9px),radial-gradient(circle,#f4f1ea_0.5px,transparent_0.8px)]"
            : "opacity-[0.04] bg-[radial-gradient(circle,#121212_0.6px,transparent_0.9px),radial-gradient(circle,#121212_0.5px,transparent_0.8px)]"
        } bg-[size:3px_3px,5px_5px] bg-[position:0_0,1px_2px]`}
      />

      {/* Vignette / Ellipse gradient */}
      <div
        className={`flex items-start absolute inset-0 pointer-events-none ${
          darkMode
            ? "bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_45%,rgba(0,0,0,0.35)_75%,rgba(0,0,0,0.7)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(18,18,18,0)_50%,rgba(18,18,18,0.03)_75%,rgba(18,18,18,0.08)_100%)]"
        }`}
      />

      {/* Reticle Crosshairs */}
      <div
        className={`flex h-px w-full flex-none items-start ${
          darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]"
        } opacity-60 absolute left-0 top-[calc(50%-36px)]`}
      />
      <div
        className={`flex w-px items-start ${
          darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]"
        } opacity-60 absolute left-1/2 top-16 bottom-16`}
      />

      {/* Left Sprocket Holes */}
      <div
        className={`flex w-10 flex-col items-center justify-between border-r border-solid ${borderClass} py-6 absolute left-0 top-16 bottom-16 mobile:w-6 mobile:flex-none`}
      >
        {[...Array(14)].map((_, i) => (
          <div
            key={`left-sprocket-${i}`}
            className={`flex h-4 w-5 flex-none items-start rounded-sm ${
              darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]"
            } mobile:w-3`}
          />
        ))}
      </div>

      {/* Right Sprocket Holes */}
      <div
        className={`flex w-10 flex-col items-center justify-between border-l border-solid ${borderClass} py-6 absolute right-0 top-16 bottom-16 mobile:w-6 mobile:flex-none`}
      >
        {[...Array(14)].map((_, i) => (
          <div
            key={`right-sprocket-${i}`}
            className={`flex h-4 w-5 flex-none items-start rounded-sm ${
              darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]"
            } mobile:w-3`}
          />
        ))}
      </div>

      {/* Reel Header Info */}
      <div className="flex items-center gap-3 absolute left-16 top-24 mobile:absolute mobile:left-9 mobile:top-20">
        <div className={`flex h-2 w-2 flex-none items-start ${crimsonClass}`} />
        <span
          className={`font-mono ${textClass} text-[11px] tracking-[0.2em] mobile:text-[9px]`}
        >
          THE DIRECTOR&#39;S CUT — REEL 01
        </span>
      </div>

      <div
        className={`flex items-center gap-3 border border-solid ${borderClass} ${bgClass} px-3 py-1.5 absolute right-16 top-[88px] mobile:hidden`}
      >
        <span className={`font-mono ${textClass} text-[11px] tracking-[0.2em]`}>
          PROJECTOR CALIBRATION · 24 FPS
        </span>
      </div>

      {/* Feed Reel Motif (left side) with smooth spin */}
      <div className="flex flex-col items-center gap-3 absolute left-20 top-[calc(50%-36px)] -translate-y-1/2 mobile:hidden">
        <div
          className={`flex h-24 w-24 flex-none items-start rounded-full border border-solid ${borderClass} ${bgClass} relative animate-reel-spin`}
        >
          <div
            className={`flex h-[84px] w-[84px] flex-none items-start rounded-full border border-solid ${secondaryBorder} absolute left-[5px] top-[5px]`}
          />
          <div
            className={`flex h-4 w-4 flex-none items-start rounded-full border border-solid ${borderClass} absolute left-[39px] top-[11px]`}
          />
          <div
            className={`flex h-4 w-4 flex-none items-start rounded-full border border-solid ${borderClass} absolute left-[65px] top-[30px]`}
          />
          <div
            className={`flex h-4 w-4 flex-none items-start rounded-full border border-solid ${borderClass} absolute left-[55px] top-[62px]`}
          />
          <div
            className={`flex h-4 w-4 flex-none items-start rounded-full border border-solid ${borderClass} absolute left-[23px] top-[62px]`}
          />
          <div
            className={`flex h-4 w-4 flex-none items-start rounded-full border border-solid ${borderClass} absolute left-[13px] top-[30px]`}
          />
          <div
            className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border border-solid ${borderClass} ${bgClass} absolute left-[37px] top-[37px]`}
          >
            <div className={`flex h-1.5 w-1.5 flex-none items-start rounded-full ${crimsonClass}`} />
          </div>
        </div>
        <span className={`font-mono ${subtextClass} text-[10px] tracking-[0.2em]`}>
          FEED · A
        </span>
      </div>

      {/* Frame Counter with Crimson Flash on each countdown step */}
      <div
        className={`flex flex-col items-center gap-2 border border-solid ${borderClass} ${bgClass} px-3 py-3 absolute right-20 top-[calc(50%-36px)] -translate-y-1/2 mobile:hidden transition-colors duration-150`}
      >
        <span className={`font-mono ${subtextClass} text-[10px] tracking-[0.2em]`}>
          FRAME
        </span>
        <div className={`flex h-px w-full flex-none items-start ${darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]"}`} />
        <span
          className={`font-mono ${
            flashCrimson ? crimsonText : crimsonText
          } text-[20px] font-[700] tracking-[0.08em] transition-colors`}
        >
          {String(frameNumber).padStart(4, "0")}
        </span>
        <span className={`font-mono ${textClass} text-[11px] tracking-[0.12em]`}>
          / 0072
        </span>
      </div>

      {/* Central Countdown Disc & Radar Sweep */}
      <div className="flex h-[440px] w-[440px] flex-none items-center justify-center absolute left-1/2 top-[calc(50%-36px)] -translate-x-1/2 -translate-y-1/2 mobile:h-[300px] mobile:w-[300px]">
        <span
          className={`font-mono ${textClass} text-[10px] tracking-[0.16em] ${bgClass} px-1 absolute left-1/2 top-0 -translate-x-1/2`}
        >
          0°
        </span>
        <span
          className={`font-mono ${textClass} text-[10px] tracking-[0.16em] ${bgClass} px-1 absolute right-0 top-1/2 -translate-y-1/2`}
        >
          90°
        </span>
        <span
          className={`font-mono ${textClass} text-[10px] tracking-[0.16em] ${bgClass} px-1 absolute left-1/2 bottom-0 -translate-x-1/2`}
        >
          180°
        </span>
        <span
          className={`font-mono ${textClass} text-[10px] tracking-[0.16em] ${bgClass} px-1 absolute left-0 top-1/2 -translate-y-1/2`}
        >
          270°
        </span>

        <div
          className={`flex h-[360px] w-[360px] flex-none items-center justify-center overflow-hidden rounded-full border border-solid ${borderClass} relative mobile:h-60 mobile:w-60`}
        >
          {/* Radar sweep conical gradient */}
          <div
            className={`flex items-start rounded-full absolute inset-0 animate-radar-sweep ${
              darkMode
                ? "bg-[conic-gradient(from_0deg,rgba(244,241,234,0)_0deg,rgba(244,241,234,0.04)_40deg,rgba(244,241,234,0.18)_90deg,rgba(244,241,234,0)_90deg)]"
                : "bg-[conic-gradient(from_0deg,rgba(107,102,92,0)_0deg,rgba(107,102,92,0.06)_40deg,rgba(107,102,92,0.22)_90deg,rgba(107,102,92,0)_90deg)]"
            }`}
          />

          {/* Radar Line arm */}
          <div
            className={`flex h-[180px] w-px flex-none items-start ${crimsonClass} absolute left-1/2 top-0 origin-bottom animate-radar-sweep mobile:h-[120px]`}
          />

          {/* Inner Circle & Countdown Visual / Authentic Frame */}
          <div
            className={`flex h-[280px] w-[280px] flex-none items-center justify-center rounded-full border border-solid ${borderClass} relative mobile:h-[186px] mobile:w-[186px] overflow-hidden`}
          >
            {countdown === 2 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={darkMode ? "/leader_dark_2.jpg" : "/leader_light_2.jpg"}
                  alt="Film Leader Frame 2"
                  className="w-full h-full object-cover scale-[1.04] animate-pulse"
                />
                <div
                  className={`absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 ${
                    darkMode ? "bg-black" : "bg-[#f4f1ea]"
                  }`}
                />
              </div>
            ) : countdown === 1 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={darkMode ? "/leader_dark_1.jpg" : "/leader_light_1.jpg"}
                  alt="Film Leader Frame 1"
                  className="w-full h-full object-cover scale-[1.04] animate-pulse"
                />
                <div
                  className={`absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 ${
                    darkMode ? "bg-black" : "bg-[#f4f1ea]"
                  }`}
                />
              </div>
            ) : (
              <span
                key={countdown}
                className={`font-playfair text-[220px] font-[900] leading-[220px] tracking-[-0.04em] ${textClass} mobile:text-[140px] mobile:leading-[140px] animate-pulse select-none`}
              >
                {countdown}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar & Subtext */}
      <div className="flex w-[440px] flex-col items-center gap-3 bg-transparent px-4 pt-3 absolute left-1/2 bottom-[88px] -translate-x-1/2 mobile:w-[300px]">
        <span
          className={`font-playfair text-[28px] font-[900] leading-[32px] tracking-[-0.02em] ${textClass} mobile:text-[20px] mobile:leading-[24px]`}
        >
          LOADING ISSUE NO. 01...
        </span>
        <div className={`flex h-px w-full flex-none items-start ${secondaryBorder} relative`}>
          <div
            className={`flex h-[3px] items-start ${crimsonClass} absolute left-0 -top-px transition-all duration-500 ease-out`}
            style={{ width: progressPercent }}
          />
          <div
            className={`flex h-2.5 w-px flex-none items-start ${darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]"} absolute -top-1 transition-all duration-500 ease-out`}
            style={{ left: progressPercent }}
          />
        </div>
        <span className={`font-mono ${subtextClass} text-[10px] tracking-[0.2em] mobile:text-[9px]`}>
          FRAME {String(frameNumber).padStart(2, "0")} OF 72 — CLICK OR PRESS ANY KEY TO SKIP
        </span>
      </div>

      {/* Letterbox Bar (Top) */}
      <div
        className={`flex h-16 w-full flex-none items-center justify-between ${letterboxBg} px-16 absolute left-0 top-0 mobile:px-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isExiting ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <span className="font-mono text-[#8c8576] text-[10px] tracking-[0.24em]">
          REEL 01 / 04
        </span>
        <span className="font-mono text-[#8c8576] text-[10px] tracking-[0.24em] mobile:hidden">
          35MM · 1.85 : 1
        </span>
      </div>

      {/* Letterbox Bar (Bottom) */}
      <div
        className={`flex h-16 w-full flex-none items-center justify-between ${letterboxBg} px-16 absolute left-0 bottom-0 mobile:px-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isExiting ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <span className="font-mono text-[#8c8576] text-[10px] tracking-[0.24em]">
          TC 00:00:01:00
        </span>
        <div className="flex items-center gap-2">
          <div className={`flex h-1.5 w-1.5 flex-none items-start rounded-full ${crimsonClass}`} />
          <span className="font-mono text-[#f4f1ea] text-[10px] tracking-[0.24em]">
            CALIBRATING
          </span>
        </div>
      </div>
    </div>
  );
}
