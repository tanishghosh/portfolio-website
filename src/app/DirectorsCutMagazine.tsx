"use client";

import React, { useState, useEffect, useRef } from "react";
import { FilmLeaderIntro } from "./FilmLeaderIntro";

interface DirectorsCutMagazineProps {
  initialDarkMode?: boolean;
}

export default function DirectorsCutMagazine({
  initialDarkMode = false,
}: DirectorsCutMagazineProps) {
  const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("cover");
  const [activeYear, setActiveYear] = useState<number>(2024);
  const [timecode, setTimecode] = useState<string>("TC 00:20:26:00");

  // Metrics animation states
  const [hasScrolledIntoSpecs, setHasScrolledIntoSpecs] = useState<boolean>(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    role: "Engineering Leadership",
    message: "",
  });
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [hasTransmitted, setHasTransmitted] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Timecode real-time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const ms = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, "0");
      setTimecode(`TC ${h}:${m}:${s}:${ms}`);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Section observer & scroll tracking
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const sections = [
        { id: "cover", el: document.getElementById("cover") },
        { id: "note", el: document.getElementById("note") },
        { id: "ch-01", el: document.getElementById("ch-01") },
        { id: "ch-02", el: document.getElementById("ch-02") },
        { id: "ch-03", el: document.getElementById("ch-03") },
        { id: "specs", el: document.getElementById("specs") },
        { id: "contact", el: document.getElementById("contact") },
      ];

      const scrollY = window.scrollY;
      const viewportMid = scrollY + window.innerHeight * 0.35;

      for (const s of sections) {
        if (!s.el) continue;
        const top = s.el.offsetTop;
        const height = s.el.offsetHeight;
        if (viewportMid >= top && viewportMid < top + height) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setActiveSection(s.id);
          }, 150);
          break;
        }
      }

      // Chrono bar progression mapping
      const chSection = document.getElementById("chronology");
      if (chSection) {
        const rect = chSection.getBoundingClientRect();
        const winHeight = window.innerHeight;
        if (rect.top <= winHeight && rect.bottom >= 0) {
          const totalDist = rect.height;
          const currentPos = Math.max(0, winHeight * 0.5 - rect.top);
          const ratio = Math.min(1, Math.max(0, currentPos / totalDist));
          if (ratio < 0.25) setActiveYear(2024);
          else if (ratio < 0.5) setActiveYear(2021);
          else if (ratio < 0.75) setActiveYear(2020);
          else setActiveYear(2017);
        }
      }

      // Specs visibility for metrics counter trigger
      const specsEl = document.getElementById("specs");
      if (specsEl) {
        const rect = specsEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setHasScrolledIntoSpecs(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Chrono click handler
  const handleYearClick = (year: number) => {
    setActiveYear(year);
    let targetId = "career-entry-2024";
    if (year === 2021 || year === 2022 || year === 2023) targetId = "career-entry-2021";
    if (year === 2020) targetId = "career-entry-2020";
    if (year <= 2019) targetId = "education-entry-2017";
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Color classes depending on theme
  const bgMain = darkMode ? "bg-[#0a0a0c]" : "bg-[#f4f1ea]";
  const textMain = darkMode ? "text-[#f4f1ea]" : "text-[#121212]";
  const borderMain = darkMode ? "border-[#f4f1ea]" : "border-[#121212]";
  const bgBorder = darkMode ? "bg-[#f4f1ea]" : "bg-[#121212]";
  const textMuted = darkMode ? "text-[#8c8576]" : "text-[#6b665c]";
  const crimsonText = darkMode ? "text-[#e0283f]" : "text-[#c8102e]";
  const crimsonBg = darkMode ? "bg-[#e0283f]" : "bg-[#c8102e]";
  const crimsonBorderHover = darkMode ? "hover:border-[#e0283f]" : "hover:border-[#c8102e]";
  const crimsonShadow = darkMode ? "hover:shadow-[4px_4px_0_#f4f1ea]" : "hover:shadow-[4px_4px_0_#121212]";
  const pillShadow = darkMode ? "hover:shadow-[2px_2px_0_#f4f1ea]" : "hover:shadow-[2px_2px_0_#121212]";
  const cardBg = darkMode ? "bg-[#141417]" : "bg-[#fbf9f4]";
  const dividerLine = darkMode ? "bg-[#2a2824]" : "bg-[#cfc8b8]";
  const dividerBorder = darkMode ? "border-[#2a2824]" : "border-[#cfc8b8]";

  // Year mapping to percentage on chrono line (2017 to 2026, 9 years)
  const getChronoPercentage = () => {
    switch (activeYear) {
      case 2017:
        return "0%";
      case 2018:
        return "11.1%";
      case 2019:
        return "22.2%";
      case 2020:
        return "33.3%";
      case 2021:
        return "44.4%";
      case 2022:
        return "55.5%";
      case 2023:
        return "66.6%";
      case 2024:
        return "77.7%";
      case 2025:
        return "88.8%";
      case 2026:
        return "100%";
      default:
        return "77.7%";
    }
  };

  const getActiveSectionLabel = () => {
    if (activeSection === "cover") return "THE COVER STORY";
    if (activeSection === "note") return "EDITOR'S NOTE";
    if (activeSection === "ch-01") return "CH. 01 · CAREER";
    if (activeSection === "ch-02") return "CH. 02 · EDUCATION";
    if (activeSection === "ch-03") return "CH. 03 · PROJECTS";
    if (activeSection === "specs") return "TECHNICAL SPEC SHEET";
    if (activeSection === "contact") return "DISPATCH // TRANSMISSION";
    return "CAREER";
  };

  return (
    <div className={`flex w-full flex-col items-start ${bgMain} pb-24 relative min-h-screen transition-colors duration-300 font-sans selection:bg-[#c8102e] selection:text-white`}>
      {/* Film Leader Countdown Intro (First load / Can be skipped) */}
      {showIntro && (
        <FilmLeaderIntro darkMode={darkMode} onFinish={() => setShowIntro(false)} />
      )}

      {/* Atmospheric Film Grain texture overlay */}
      <div
        className={`flex items-start absolute inset-0 pointer-events-none ${
          darkMode
            ? "opacity-[0.04] bg-[radial-gradient(circle,#F4F1EA_0.6px,transparent_0.9px),radial-gradient(circle,#F4F1EA_0.5px,transparent_0.8px)]"
            : "opacity-[0.035] bg-[radial-gradient(circle,#121212_0.6px,transparent_0.9px),radial-gradient(circle,#121212_0.5px,transparent_0.8px)]"
        } bg-[size:3px_3px,5px_5px] bg-[position:0_0,1px_2px]`}
      />

      {/* Header */}
      <header className={`flex w-full flex-col items-start ${bgMain} px-16 pt-6 relative mobile:px-6 mobile:pt-4 z-10 transition-colors duration-300`}>
        <div className="flex w-full items-center justify-between pb-4">
          <span className={`font-playfair text-[30px] font-[900] leading-[34px] tracking-[-0.02em] ${textMain} mobile:text-[22px] mobile:leading-[26px]`}>
            THE DIRECTOR&#39;S CUT
          </span>

          {/* Theme Toggle & Reel Info & Contact Jump */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`font-mono text-[10px] tracking-[0.16em] border border-solid ${borderMain} px-2.5 py-1 ${textMain} transition-all duration-150 hover:${bgBorder} hover:${
                darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
              } cursor-pointer`}
              title="Jump to Contact section"
            >
              ✉ CONTACT
            </button>
            <button
              onClick={() => setShowIntro(true)}
              className={`font-mono text-[10px] tracking-[0.16em] border border-solid ${borderMain} px-2.5 py-1 ${textMain} transition-all duration-150 hover:${bgBorder} hover:${darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"} mobile:hidden cursor-pointer`}
              title="Play opening countdown sequence"
            >
              ▶ PLAY LEADER
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 border border-solid ${borderMain} px-3 py-1 font-mono text-[11px] tracking-[0.16em] ${textMain} transition-all duration-200 cursor-pointer hover:${bgBorder} hover:${
                darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
              }`}
              aria-label="Toggle theme mode"
            >
              <div className={`h-2 w-2 rounded-full ${darkMode ? "bg-[#e0283f]" : "bg-[#c8102e]"}`} />
              <span>{darkMode ? "LIGHT" : "DARK"}</span>
            </button>
          </div>
        </div>
        <div className={`flex h-1 w-full flex-none items-start border-y border-solid ${borderMain}`} />
      </header>

      {/* COVER STORY SECTION */}
      <section id="cover" className="flex w-full flex-col items-start relative z-10">
        <div className="flex w-full flex-col items-start gap-12 px-16 pt-16 pb-24 mobile:gap-8 mobile:px-6 mobile:pt-10 mobile:pb-16">
          <div className="flex w-full items-center gap-4">
            <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.2em] font-semibold`}>
              THE COVER STORY
            </span>
            <div className={`flex h-px items-start ${bgBorder} grow`} />
            <div className={`flex items-center gap-3 border border-solid ${borderMain} ${bgMain} px-3 py-2 shadow-sm`}>
              <div className={`flex h-2 w-2 flex-none items-start ${crimsonBg}`} />
              <span className={`font-mono ${textMain} text-[11px] tracking-[0.18em]`}>
                ISSUE NO. 01 // 2026
              </span>
            </div>
          </div>

          {/* Hero Row: Left Title & Description, Right Portrait Photo */}
          <div className="flex w-full items-start justify-between gap-12 mobile:flex-col mobile:gap-8">
            <div className="flex flex-col items-start gap-8 grow max-w-[850px]">
              {/* Intro Badge: Consistent with Page Editorial / Film aesthetic */}
              <div
                className={`inline-flex items-center gap-2.5 border border-solid ${borderMain} ${
                  darkMode ? "bg-[#141417]" : "bg-[#fbf9f4]"
                } px-3.5 py-1.5 shadow-[2px_2px_0_#c8102e] transition-all hover:-translate-y-0.5`}
              >
                <div className={`h-2 w-2 rounded-full ${crimsonBg} animate-pulse`} />
                <span className={`font-mono text-[11px] font-bold tracking-[0.18em] ${textMain} uppercase`}>
                  HEY, I&#39;M TANISH
                </span>
                <span className="text-[13px] leading-none">👋</span>
              </div>

              <h1 className={`font-playfair text-[96px] font-[900] leading-[90px] tracking-[-0.035em] ${textMain} uppercase mobile:text-[44px] mobile:leading-[44px]`}>
                Software Development Engineer — II
              </h1>
              <p className={`max-w-[720px] font-sans ${textMuted} text-[20px] font-[400] leading-[30px] mobile:text-[18px] mobile:leading-[27px]`}>
                Architecting mission-critical travel technology at Amadeus Labs — powering
                the Central Reservation System with Python, high-throughput APIs, and distributed event pipelines.
              </p>
            </div>

            {/* Photo shifted to the right of SOFTWARE DEVELOPMENT ENGINEER */}
            <div className="flex w-64 flex-none flex-col items-start gap-3 mobile:w-full mobile:max-w-[280px]">
              <div
                className={`flex w-full items-start border border-solid ${borderMain} ${cardBg} p-3 transition-all duration-200 cursor-pointer ${crimsonBorderHover} ${crimsonShadow} overflow-hidden group`}
              >
                <img
                  alt="Tanish Ghosh"
                  className="grow shrink-0 basis-0 aspect-[4/5] grayscale contrast-125 object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                />
              </div>
              <span className={`font-mono ${textMuted} text-[10px] leading-[15px] tracking-[0.18em]`}>
                SDE II @ AMADEUS LABS · BENGALURU, INDIA
              </span>
            </div>
          </div>

          <div className={`flex w-full items-center border-t border-solid ${borderMain} pt-6`}>
            <div className="flex flex-wrap items-center gap-2">
              {[
                "AMADEUS LABS",
                "CENTRAL RESERVATION SYSTEM",
                "PYTHON BACKEND",
                "APACHE KAFKA",
                "BENGALURU",
                "SMART INDIA HACKATHON WINNER",
              ].map((tag) => (
                <span
                  key={tag}
                  className={`font-mono ${textMain} text-[11px] tracking-[0.16em] border border-solid ${borderMain} px-2.5 py-1 transition-all duration-150 cursor-default hover:${bgBorder} hover:${
                    darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                  } hover:-translate-y-0.5 ${pillShadow}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDITOR'S NOTE SECTION */}
      <section id="note" className="flex w-full flex-col items-start gap-12 px-16 pt-16 pb-12 mobile:gap-8 mobile:px-6 mobile:pt-12 mobile:pb-8 z-10">
        <div className="flex w-full flex-col items-start gap-4">
          <div className={`flex h-[3px] w-full flex-none items-start ${bgBorder}`} />
          <div className="flex w-full items-end justify-between gap-6">
            <h2 className={`font-playfair text-[56px] font-[900] leading-[56px] tracking-[-0.03em] ${textMain} mobile:text-[36px] mobile:leading-[38px]`}>
              EDITOR&#39;S NOTE
            </h2>
          </div>
          <div className={`flex h-1 w-full flex-none items-start border-y border-solid ${borderMain}`} />
        </div>

        <div className="flex w-full items-stretch mobile:flex-col">
          <div className="flex w-full flex-col items-start gap-6">
            <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.24em] font-semibold`}>
              A NOTE FROM THE ENGINEER
            </span>
            <p className={`max-w-[820px] font-playfair text-[34px] font-[700] leading-[42px] tracking-[-0.015em] ${crimsonText} mobile:text-[26px] mobile:leading-[33px]`}>
              Over 5 years building resilient backend foundations for global hospitality &amp; travel.
            </p>
            <p className={`max-w-[820px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
              Currently, I am working as a Python backend developer at Amadeus Labs, where I incorporate high-impact features, implement API enhancements, and collaborate cross-functionally across the Amadeus Central Reservation System (CRS).
            </p>
            <p className={`max-w-[820px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
              In my free time, I explore modern web stacks and distributed patterns — building with React, Angular, NodeJS, and Flask. Learning being a continuous process drives me to continuously learn from challenges and iterate towards engineering excellence.
            </p>
            <p className={`max-w-[820px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
              That journey began with my B.Tech in Computer Science from Vellore Institute of Technology (2017–2021), complemented by winning the nationwide Smart India Hackathon in 2020.
            </p>
            <div className="flex w-full max-w-[820px] items-center gap-4 pt-4">
              <div className={`flex h-px w-12 flex-none items-start ${bgBorder}`} />
              <span className={`font-mono ${textMain} text-[11px] tracking-[0.2em]`}>
                — T.G., SDE-II @ AMADEUS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THE CHRONOLOGY SECTION */}
      <section id="chronology" className="flex w-full flex-col items-start gap-12 px-16 pt-16 pb-12 mobile:px-6 mobile:pt-12 mobile:pb-8 z-10">
        <div className="flex w-full flex-col items-start gap-4">
          <div className={`flex h-[3px] w-full flex-none items-start ${bgBorder}`} />
          <div className="flex w-full items-end justify-between gap-6">
            <h2 className={`font-playfair text-[56px] font-[900] leading-[56px] tracking-[-0.03em] ${textMain} mobile:text-[36px] mobile:leading-[38px]`}>
              THE CHRONOLOGY
            </h2>
            <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em] mobile:hidden`}>
              2015 → PRESENT
            </span>
          </div>
          <div className={`flex h-1 w-full flex-none items-start border-y border-solid ${borderMain}`} />
        </div>

        <div className="flex w-full flex-col items-start relative">
          <div className={`flex w-px items-start ${bgBorder} absolute left-[200px] top-0 bottom-0 mobile:hidden`} />

          {/* CH. 01 CAREER Header */}
          <div id="ch-01" className="flex w-full items-center py-6">
            <div className="flex w-44 flex-none items-center justify-end pr-2 mobile:hidden">
              <span className={`font-mono ${textMuted} text-[10px] tracking-[0.2em]`}>
                CH. 01
              </span>
            </div>
            <div className="flex w-12 flex-none items-center justify-center mobile:hidden">
              <div className={`flex h-4 w-4 flex-none items-center justify-center border border-solid ${borderMain} ${bgMain}`}>
                <div className={`flex h-1.5 w-1.5 flex-none items-start ${bgBorder}`} />
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 items-center gap-4">
              <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.24em] font-semibold`}>
                CAREER &amp; EXPERIENCE
              </span>
              <div className={`flex h-px grow shrink-0 basis-0 items-start ${bgBorder}`} />
            </div>
          </div>

          {/* Article 2024: SDE II at Amadeus Labs */}
          <article id="career-entry-2024" className="flex w-full items-start mobile:flex-col group">
            <div className="flex w-44 flex-none flex-col items-end gap-2 pr-2 pt-14 mobile:w-full mobile:flex-none mobile:items-start mobile:pr-0 mobile:pt-8">
              <span className={`font-playfair text-[48px] font-[900] leading-[48px] tracking-[-0.03em] ${textMain}`}>
                2024
              </span>
              <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.16em]`}>
                — PRESENT
              </span>
            </div>
            <div className="flex w-12 flex-none items-start justify-center pt-[74px] mobile:hidden">
              <div className={`flex h-3 w-3 flex-none items-start border border-solid ${borderMain} ${crimsonBg}`} />
            </div>
            <div className="flex grow shrink-0 basis-0 items-start gap-10 py-14 mobile:flex-col mobile:gap-6 mobile:pt-4 mobile:pb-10">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
                <h3 className={`font-playfair text-[34px] font-[800] leading-[38px] tracking-[-0.02em] ${textMain}`}>
                  Software Development Engineer — II
                </h3>
                <span className={`font-mono ${textMuted} text-[12px] tracking-[0.16em]`}>
                  AMADEUS LABS · BENGALURU, INDIA
                </span>
                <p className={`max-w-[560px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
                  Core Python backend developer for the Amadeus Central Reservation System (CRS). Architecting new service features, critical API enhancements, and cross-team integrations across enterprise travel infrastructure.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {["Python", "Kafka", "Distributed Systems", "APIs", "Couchbase", "Microservices"].map((tech) => (
                    <span
                      key={tech}
                      className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                        darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                      } hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`flex w-56 flex-none flex-col items-start gap-2 border-l border-solid ${borderMain} pl-6 mobile:w-full mobile:flex-none mobile:pl-0 mobile:pt-4 mobile:border-l-0 mobile:border-t`}>
                <span className={`font-playfair text-[64px] font-[900] leading-[64px] tracking-[-0.04em] ${crimsonText}`}>
                  5+ YRS
                </span>
                <span className={`font-sans ${textMuted} text-[14px] leading-[20px]`}>
                  Total tenure at Amadeus Labs
                </span>
              </div>
            </div>
          </article>

          {/* Article 2021: Software Development Engineer I */}
          <article id="career-entry-2021" className="flex w-full items-start mobile:flex-col group">
            <div className="flex w-44 flex-none flex-col items-end gap-2 pr-2 pt-14 mobile:w-full mobile:flex-none mobile:items-start mobile:pr-0 mobile:pt-8">
              <span className={`font-playfair text-[48px] font-[900] leading-[48px] tracking-[-0.03em] ${textMain}`}>
                2021
              </span>
              <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em]`}>
                — 2024
              </span>
            </div>
            <div className="flex w-12 flex-none items-start justify-center pt-[74px] mobile:hidden">
              <div className={`flex h-3 w-3 flex-none items-start border border-solid ${borderMain} ${bgMain}`} />
            </div>
            <div className={`flex grow shrink-0 basis-0 items-start gap-10 border-t border-solid ${dividerBorder} py-14 mobile:flex-col mobile:gap-6 mobile:pt-4 mobile:pb-10 mobile:border-t-0`}>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
                <h3 className={`font-playfair text-[34px] font-[800] leading-[38px] tracking-[-0.02em] ${textMain}`}>
                  Software Development Engineer
                </h3>
                <span className={`font-mono ${textMuted} text-[12px] tracking-[0.16em]`}>
                  AMADEUS LABS · BENGALURU, INDIA
                </span>
                <p className={`max-w-[560px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
                  Engineered and maintained backend APIs and booking pipelines for Amadeus CRS. Transitioned from successful engineering internship (Jan–May 2021) into full-time engineering with end-to-end service delivery.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {["Python", "Flask", "NodeJS", "MongoDB", "MySQL", "Git"].map((tech) => (
                    <span
                      key={tech}
                      className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                        darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                      } hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`flex w-56 flex-none flex-col items-start gap-2 border-l border-solid ${borderMain} pl-6 mobile:w-full mobile:flex-none mobile:pl-0 mobile:pt-4 mobile:border-l-0 mobile:border-t`}>
                <span className={`font-playfair text-[64px] font-[900] leading-[64px] tracking-[-0.04em] ${crimsonText}`}>
                  — —
                </span>
                <span className={`font-sans ${textMuted} text-[14px] leading-[20px]`}>
                  Milestone Metric
                </span>
              </div>
            </div>
          </article>

          {/* Article 2020: Early Internships & Hackathon */}
          <article id="career-entry-2020" className="flex w-full items-start mobile:flex-col group">
            <div className="flex w-44 flex-none flex-col items-end gap-2 pr-2 pt-14 mobile:w-full mobile:flex-none mobile:items-start mobile:pr-0 mobile:pt-8">
              <span className={`font-playfair text-[48px] font-[900] leading-[48px] tracking-[-0.03em] ${textMain}`}>
                2020
              </span>
              <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em]`}>
                — 2021
              </span>
            </div>
            <div className="flex w-12 flex-none items-start justify-center pt-[74px] mobile:hidden">
              <div className={`flex h-3 w-3 flex-none items-start border border-solid ${borderMain} ${bgMain}`} />
            </div>
            <div className={`flex grow shrink-0 basis-0 items-start gap-10 border-t border-solid ${dividerBorder} py-14 mobile:flex-col mobile:gap-6 mobile:pt-4 mobile:pb-10 mobile:border-t-0`}>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
                <h3 className={`font-playfair text-[34px] font-[800] leading-[38px] tracking-[-0.02em] ${textMain}`}>
                  Engineering Internships &amp; Research
                </h3>
                <span className={`font-mono ${textMuted} text-[12px] tracking-[0.16em]`}>
                  SCIENTECH TECHNOLOGIES &amp; KPMG VIRTUAL
                </span>
                <p className={`max-w-[560px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
                  Tackled challenging sensor data pipelines and image classification problem statements. Completed KPMG Data Consulting Virtual Program focusing on Data Quality Assessment, Insights, and Visualization.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {["Sensor Data", "Image Classification", "Pandas", "TensorFlow", "JavaScript"].map((tech) => (
                    <span
                      key={tech}
                      className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                        darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                      } hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`flex w-56 flex-none flex-col items-start gap-2 border-l border-solid ${borderMain} pl-6 mobile:w-full mobile:flex-none mobile:pl-0 mobile:pt-4 mobile:border-l-0 mobile:border-t`}>
                <span className={`font-playfair text-[64px] font-[900] leading-[64px] tracking-[-0.04em] ${crimsonText}`}>
                  — —
                </span>
                <span className={`font-sans ${textMuted} text-[14px] leading-[20px]`}>
                  Achievement Metric
                </span>
              </div>
            </div>
          </article>

          {/* CH. 02 EDUCATION Header */}
          <div id="ch-02" className="flex w-full items-center py-6">
            <div className="flex w-44 flex-none items-center justify-end pr-2 mobile:hidden">
              <span className={`font-mono ${textMuted} text-[10px] tracking-[0.2em]`}>
                CH. 02
              </span>
            </div>
            <div className="flex w-12 flex-none items-center justify-center mobile:hidden">
              <div className={`flex h-4 w-4 flex-none items-center justify-center border border-solid ${borderMain} ${bgMain}`}>
                <div className={`flex h-1.5 w-1.5 flex-none items-start ${bgBorder}`} />
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 items-center gap-4">
              <span className={`font-mono ${textMain} text-[11px] tracking-[0.24em] font-semibold`}>
                EDUCATION &amp; FOUNDATIONS
              </span>
              <div className={`flex h-px grow shrink-0 basis-0 items-start ${bgBorder}`} />
            </div>
          </div>

          {/* Article 2017: VIT */}
          <article id="education-entry-2017" className="flex w-full items-start mobile:flex-col group">
            <div className="flex w-44 flex-none flex-col items-end gap-2 pr-2 pt-14 mobile:w-full mobile:flex-none mobile:items-start mobile:pr-0 mobile:pt-8">
              <span className={`font-playfair text-[48px] font-[900] leading-[48px] tracking-[-0.03em] ${textMain}`}>
                2017
              </span>
              <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em]`}>
                — 2021
              </span>
            </div>
            <div className="flex w-12 flex-none items-start justify-center pt-[74px] mobile:hidden">
              <div className={`flex h-3 w-3 flex-none items-start border border-solid ${borderMain} ${bgMain}`} />
            </div>
            <div className="flex grow shrink-0 basis-0 items-start gap-10 py-14 mobile:flex-col mobile:gap-6 mobile:pt-4 mobile:pb-10">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
                <h3 className={`font-playfair text-[34px] font-[800] leading-[38px] tracking-[-0.02em] ${textMain}`}>
                  Bachelor of Technology, Computer Science &amp; Engineering
                </h3>
                <span className={`font-mono ${textMuted} text-[12px] tracking-[0.16em]`}>
                  VELLORE INSTITUTE OF TECHNOLOGY (VIT)
                </span>
                <p className={`max-w-[560px] font-sans ${textMain} text-[17px] font-[400] leading-[27px]`}>
                  Comprehensive computer science curriculum with specialization in systems design, algorithms, machine learning, and database management. Schooling completed at Vivekananda Kendra Vidyalaya, Dibrugarh (2004–2017).
                </p>
                <div className="flex w-full flex-col items-start gap-3 pt-1">
                  <span className={`font-mono ${textMuted} text-[10px] tracking-[0.2em]`}>
                    KEY CERTIFICATIONS
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      "IBM Data Science Specialization",
                      "TensorFlow in Practice",
                      "DataFrames with Pandas",
                      "Data Quality & Presentation (KPMG)",
                    ].map((cert) => (
                      <span
                        key={cert}
                        className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                          darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                        } hover:-translate-y-0.5 ${pillShadow}`}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`flex w-56 flex-none flex-col items-start gap-2 border-l border-solid ${borderMain} pl-6 mobile:w-full mobile:flex-none mobile:pl-0 mobile:pt-4 mobile:border-l-0 mobile:border-t`}>
                <span className={`font-playfair text-[64px] font-[900] leading-[64px] tracking-[-0.04em] ${crimsonText}`}>
                  SIH
                </span>
                <span className={`font-sans ${textMuted} text-[14px] leading-[20px]`}>
                  National Hackathon Winner 2020
                </span>
              </div>
            </div>
          </article>

          {/* CH. 03 KEY INITIATIVES & STACKS Header */}
          <div id="ch-03" className="flex w-full items-center py-6">
            <div className="flex w-44 flex-none items-center justify-end pr-2 mobile:hidden">
              <span className={`font-mono ${textMuted} text-[10px] tracking-[0.2em]`}>
                CH. 03
              </span>
            </div>
            <div className="flex w-12 flex-none items-center justify-center mobile:hidden">
              <div className={`flex h-4 w-4 flex-none items-center justify-center border border-solid ${borderMain} ${bgMain}`}>
                <div className={`flex h-1.5 w-1.5 flex-none items-start ${bgBorder}`} />
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 items-center gap-4">
              <span className={`font-mono ${textMain} text-[11px] tracking-[0.24em] font-semibold`}>
                CORE SYSTEMS &amp; EXPLORATIONS
              </span>
              <div className={`flex h-px grow shrink-0 basis-0 items-start ${bgBorder}`} />
            </div>
          </div>

          {/* 3 Projects Grid with Real Stacks */}
          <article className="flex w-full items-start mobile:flex-col">
            <div className="flex w-44 flex-none flex-col items-end gap-2 pr-2 pt-14 mobile:w-full mobile:flex-none mobile:items-start mobile:pr-0 mobile:pt-8">
              <span className={`font-playfair text-[48px] font-[900] leading-[48px] tracking-[-0.03em] ${textMain}`}>
                PROJECTS
              </span>
              <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em]`}>
                — HIGHLIGHTS
              </span>
            </div>
            <div className="flex w-12 flex-none items-start justify-center pt-[74px] mobile:hidden">
              <div className={`flex h-3 w-3 flex-none items-start border border-solid ${borderMain} ${bgMain}`} />
            </div>
            <div className="grow shrink-0 basis-0 items-start gap-8 pt-14 pb-6 grid grid-cols-3 mobile:gap-10 mobile:pt-4 mobile:grid-cols-1">
              {/* Project Fig 01 */}
              <div className="flex flex-col items-start gap-4 self-stretch group">
                <div
                  className={`flex w-full items-start border border-solid ${borderMain} ${cardBg} p-5 transition-all duration-200 cursor-pointer overflow-hidden ${crimsonBorderHover} ${crimsonShadow}`}
                >
                  <img
                    alt="CRS Reservation Engine"
                    className="grow shrink-0 basis-0 aspect-[4/3] grayscale contrast-125 object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"
                  />
                </div>
                <span className={`font-mono ${textMain} text-[11px] tracking-[0.18em]`}>
                  FIG. 01 — CENTRAL RESERVATION BACKEND
                </span>
                <p className={`font-sans ${textMuted} text-[15px] font-[400] leading-[23px]`}>
                  High-availability Python backend powering reservation feature delivery and robust API enhancements.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["Python", "Kafka", "Couchbase"].map((tag) => (
                    <span
                      key={tag}
                      className={`font-mono ${
                        darkMode ? "text-[#0a0a0c] bg-[#F4F1EA]" : "text-[#f4f1ea] bg-[#121212]"
                      } text-[11px] px-2.5 py-0.5 transition-all duration-150 hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Fig 02 */}
              <div className="flex flex-col items-start gap-4 self-stretch group">
                <div
                  className={`flex w-full items-start border border-solid ${borderMain} ${cardBg} p-5 transition-all duration-200 cursor-pointer overflow-hidden ${crimsonBorderHover} ${crimsonShadow}`}
                >
                  <img
                    alt="Web Framework Explorations"
                    className="grow shrink-0 basis-0 aspect-[4/3] grayscale contrast-125 object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
                  />
                </div>
                <span className={`font-mono ${textMain} text-[11px] tracking-[0.18em]`}>
                  FIG. 02 — REACT &amp; ANGULAR PLATFORMS
                </span>
                <p className={`font-sans ${textMuted} text-[15px] font-[400] leading-[23px]`}>
                  Exploring modern front-end architectures, reactive component lifecycles, and state management.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["React", "Angular", "NodeJS"].map((tag) => (
                    <span
                      key={tag}
                      className={`font-mono ${
                        darkMode ? "text-[#0a0a0c] bg-[#F4F1EA]" : "text-[#f4f1ea] bg-[#121212]"
                      } text-[11px] px-2.5 py-0.5 transition-all duration-150 hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Fig 03 */}
              <div className="flex flex-col items-start gap-4 self-stretch group">
                <div
                  className={`flex w-full items-start border border-solid ${borderMain} ${cardBg} p-5 transition-all duration-200 cursor-pointer overflow-hidden ${crimsonBorderHover} ${crimsonShadow}`}
                >
                  <img
                    alt="Sensor & Analytics Pipeline"
                    className="grow shrink-0 basis-0 aspect-[4/3] grayscale contrast-125 object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
                  />
                </div>
                <span className={`font-mono ${textMain} text-[11px] tracking-[0.18em]`}>
                  FIG. 03 — SENSOR DATA &amp; CLASSIFICATION
                </span>
                <p className={`font-sans ${textMuted} text-[15px] font-[400] leading-[23px]`}>
                  End-to-end analytical pipelines for sensor telemetry and image classification with TensorFlow and Pandas.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["TensorFlow", "Pandas", "Flask"].map((tag) => (
                    <span
                      key={tag}
                      className={`font-mono ${
                        darkMode ? "text-[#0a0a0c] bg-[#F4F1EA]" : "text-[#f4f1ea] bg-[#121212]"
                      } text-[11px] px-2.5 py-0.5 transition-all duration-150 hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* TECHNICAL SPEC SHEET SECTION */}
      <section id="specs" className="flex w-full flex-col items-start gap-12 px-16 pt-16 pb-24 mobile:gap-8 mobile:px-6 mobile:pt-12 mobile:pb-16 z-10">
        <div className="flex w-full flex-col items-start gap-4">
          <div className={`flex h-[3px] w-full flex-none items-start ${bgBorder}`} />
          <div className="flex w-full items-end justify-between gap-6">
            <h2 className={`font-playfair text-[56px] font-[900] leading-[56px] tracking-[-0.03em] ${textMain} mobile:text-[36px] mobile:leading-[38px]`}>
              THE TECHNICAL SPEC SHEET
            </h2>
            <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em] mobile:hidden`}>
              SPECIFICATIONS — FORMAT 35MM
            </span>
          </div>
          <div className={`flex h-1 w-full flex-none items-start border-y border-solid ${borderMain}`} />
        </div>

        <div className={`flex w-full flex-col items-start border border-solid ${borderMain} ${darkMode ? "bg-[#141417]" : "bg-transparent"}`}>
          <div className="w-full items-stretch grid grid-cols-3 mobile:grid-cols-1">
            {/* SPEC 01 */}
            <div className="flex flex-col items-start">
              <div className={`flex w-full flex-col items-start gap-2 border-b border-solid ${borderMain} px-6 py-5`}>
                <span className={`font-mono ${crimsonText} text-[10px] tracking-[0.24em]`}>
                  SPEC 01
                </span>
                <h3 className={`font-playfair text-[28px] font-[800] leading-[32px] tracking-[-0.02em] ${textMain}`}>
                  Languages &amp; Core
                </h3>
              </div>
              <div className="flex w-full flex-col items-start gap-5 px-6 py-6 grow">
                <p className={`font-sans ${textMuted} text-[15px] font-[400] leading-[23px]`}>
                  Primary languages for scalable backend APIs and high-concurrency event-driven services.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["Python", "JavaScript", "Java", "SQL"].map((lang) => (
                    <span
                      key={lang}
                      className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} ${
                        darkMode ? "bg-[#0A0A0C]" : "bg-[#f4f1ea]"
                      } px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                        darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                      } hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SPEC 02 */}
            <div className={`flex flex-col items-start border-l border-solid ${borderMain} mobile:border-l-0 mobile:border-t`}>
              <div className={`flex w-full flex-col items-start gap-2 border-b border-solid ${borderMain} px-6 py-5`}>
                <span className={`font-mono ${crimsonText} text-[10px] tracking-[0.24em]`}>
                  SPEC 02
                </span>
                <h3 className={`font-playfair text-[28px] font-[800] leading-[32px] tracking-[-0.02em] ${textMain}`}>
                  Systems &amp; Databases
                </h3>
              </div>
              <div className="flex w-full flex-col items-start gap-5 px-6 py-6 grow">
                <p className={`font-sans ${textMuted} text-[15px] font-[400] leading-[23px]`}>
                  Distributed datastores, caching layers, and streaming event buses for reservation systems.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "Apache Kafka",
                    "Couchbase",
                    "MongoDB",
                    "MySQL",
                    "Amadeus CRS",
                    "Azure (Exploring)",
                  ].map((sys) => (
                    <span
                      key={sys}
                      className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} ${
                        darkMode ? "bg-[#0A0A0C]" : "bg-[#f4f1ea]"
                      } px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                        darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                      } hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SPEC 03 */}
            <div className={`flex flex-col items-start border-l border-solid ${borderMain} mobile:border-l-0 mobile:border-t`}>
              <div className={`flex w-full flex-col items-start gap-2 border-b border-solid ${borderMain} px-6 py-5`}>
                <span className={`font-mono ${crimsonText} text-[10px] tracking-[0.24em]`}>
                  SPEC 03
                </span>
                <h3 className={`font-playfair text-[28px] font-[800] leading-[32px] tracking-[-0.02em] ${textMain}`}>
                  Frameworks &amp; Tooling
                </h3>
              </div>
              <div className="flex w-full flex-col items-start gap-5 px-6 py-6 grow">
                <p className={`font-sans ${textMuted} text-[15px] font-[400] leading-[23px]`}>
                  Application runtimes, development frameworks, and version control workflows.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["Flask", "NodeJS", "Angular", "React", "Git", "GitHub", "Bitbucket"].map((tool) => (
                    <span
                      key={tool}
                      className={`font-mono ${textMain} text-[11px] border border-solid ${borderMain} ${
                        darkMode ? "bg-[#0A0A0C]" : "bg-[#f4f1ea]"
                      } px-2.5 py-0.5 transition-all duration-150 hover:${bgBorder} hover:${
                        darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                      } hover:-translate-y-0.5 ${pillShadow}`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISPATCH / CONTACT ME SECTION */}
      <section
        id="contact"
        className="flex w-full flex-col items-start gap-12 px-16 pt-20 pb-28 mobile:gap-8 mobile:px-6 mobile:pt-14 mobile:pb-20 z-10"
      >
        {/* Section Header */}
        <div className="flex w-full flex-col items-start gap-4">
          <div className={`flex h-[3px] w-full flex-none items-start ${bgBorder}`} />
          <div className="flex w-full items-end justify-between gap-6">
            <div className="flex flex-col items-start gap-1">
              <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.24em] font-semibold uppercase`}>
                COMMUNICATION CHANNEL // TRANSMISSION 04
              </span>
              <h2 className={`font-playfair text-[56px] font-[900] leading-[56px] tracking-[-0.03em] ${textMain} mobile:text-[36px] mobile:leading-[38px]`}>
                CONTACT &amp; DISPATCH
              </h2>
            </div>
            <div className="flex items-center gap-3 mobile:hidden">
              <div className={`flex h-2 w-2 flex-none items-start ${crimsonBg} animate-ping`} />
              <span className={`font-mono ${textMuted} text-[11px] tracking-[0.2em]`}>
                LINE OPEN · AMSTERDAM [CET]
              </span>
            </div>
          </div>
          <div className={`flex h-1 w-full flex-none items-start border-y border-solid ${borderMain}`} />
        </div>

        {/* Content Box */}
        <div className={`flex w-full flex-col items-start border border-solid ${borderMain} ${cardBg} shadow-sm overflow-hidden`}>
          {/* Film slate top strip */}
          <div className={`flex w-full items-center justify-between border-b border-solid ${borderMain} px-6 py-3 ${darkMode ? "bg-[#101014]" : "bg-[#f1ece1]"}`}>
            <div className="flex items-center gap-3">
              <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.2em] font-bold`}>
                SLATE 04
              </span>
              <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em]`}>
                // TAKE 01
              </span>
            </div>
            <span className={`font-mono ${textMuted} text-[11px] tracking-[0.16em] mobile:hidden`}>
              ENCRYPTION: 256-BIT EDITORIAL WIRE
            </span>
          </div>

          <div className="flex w-full items-stretch">
            {/* Direct Info & Editorial Memo Full Hub */}
            <div className="flex w-full flex-col justify-between p-12 mobile:p-6">
              <div className="flex flex-col items-start gap-8 max-w-[840px]">
                <div className="flex items-center gap-3">
                  <div className={`flex h-2 w-2 flex-none items-start ${crimsonBg} animate-pulse`} />
                  <span className={`font-mono ${crimsonText} text-[11px] tracking-[0.24em] font-semibold uppercase`}>
                    DIRECT COMMUNICATION FREQUENCY
                  </span>
                </div>

                <h3 className={`font-playfair text-[44px] font-[900] leading-[48px] tracking-[-0.025em] ${textMain} mobile:text-[30px] mobile:leading-[34px]`}>
                  Let&#39;s collaborate on the next backend milestone.
                </h3>
                <p className={`font-sans ${textMuted} text-[17px] font-[400] leading-[28px]`}>
                  Open for Python backend engineering discussions, distributed API design, Kafka-driven event architectures, or full-stack software development collaborations.
                </p>

                {/* Email Copy Card */}
                <div
                  onClick={() => {
                    navigator.clipboard.writeText("tanishghosh@gmail.com");
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2200);
                  }}
                  className={`flex w-full max-w-[560px] flex-col items-start gap-2 border border-solid ${borderMain} ${
                    darkMode ? "bg-[#0a0a0c]" : "bg-[#f4f1ea]"
                  } p-5 cursor-pointer transition-all duration-150 ${crimsonBorderHover} ${crimsonShadow} group`}
                  title="Click to copy email address"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className={`font-mono ${textMuted} text-[11px] tracking-[0.18em]`}>
                      OFFICIAL INBOX
                    </span>
                    <span className={`font-mono ${copiedEmail ? crimsonText : textMuted} text-[11px] tracking-[0.16em] font-semibold transition-colors`}>
                      {copiedEmail ? "COPIED TO CLIPBOARD ✓" : "CLICK TO COPY"}
                    </span>
                  </div>
                  <span className={`font-mono ${textMain} text-[16px] font-bold tracking-[0.08em] group-hover:${crimsonText} transition-colors`}>
                    tanishghosh@gmail.com
                  </span>
                </div>

                {/* Social & Network Channels */}
                <div className="flex flex-col items-start gap-3 w-full pt-2">
                  <span className={`font-mono ${textMuted} text-[10px] tracking-[0.2em]`}>
                    PUBLIC FREQUENCIES
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { name: "LINKEDIN // /in/tanishghosh", href: "https://www.linkedin.com/in/tanishghosh" },
                      { name: "GITHUB // tanishghosh", href: "https://github.com" },
                      { name: "BITBUCKET // Workspace", href: "https://bitbucket.org" },
                    ].map((ch) => (
                      <a
                        key={ch.name}
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-mono ${textMain} text-[11px] tracking-[0.14em] border border-solid ${borderMain} ${
                          darkMode ? "bg-[#0A0A0C]" : "bg-[#f4f1ea]"
                        } px-3.5 py-2 transition-all duration-150 hover:${bgBorder} hover:${
                          darkMode ? "text-[#0a0a0c]" : "text-[#f4f1ea]"
                        } hover:-translate-y-0.5 ${pillShadow}`}
                      >
                        {ch.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Stamp */}
              <div className={`flex items-center gap-3 border-t border-solid ${borderMain} pt-6 mt-12`}>
                <div className={`flex h-2 w-2 flex-none items-start ${crimsonBg}`} />
                <span className={`font-mono ${textMuted} text-[11px] tracking-[0.18em]`}>
                  BENGALURU, KARNATAKA, INDIA · ORIGIN: DIBRUGARH, ASSAM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHRONO-BAR FOOTER (Interactive timeline playhead) */}
      <footer
        className={`flex w-full flex-col items-start border-t-[3px] border-solid ${borderMain} ${
          darkMode ? "bg-[#0a0a0c]" : "bg-[#f4f1ea]"
        } fixed bottom-0 left-0 right-0 z-30 shadow-2xl transition-colors duration-300`}
      >
        <div className="flex w-full items-center gap-8 px-16 py-3 mobile:gap-4 mobile:px-6">
          <span className={`font-mono ${textMuted} text-[10px] tracking-[0.16em] mobile:hidden`}>
            CHRONOLOGY
          </span>

          <div className="flex flex-col items-start gap-1.5 relative grow">
            {/* Timeline base track */}
            <div className={`flex h-px w-full flex-none items-start ${dividerLine} relative mt-2`}>
              <div
                className={`flex h-[3px] items-start ${crimsonBg} absolute left-0 -top-px transition-all duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                style={{ width: getChronoPercentage() }}
              />
            </div>

            {/* Playhead Marker */}
            <div
              className="flex flex-col items-center absolute top-0 -translate-x-1/2 transition-all duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
              style={{ left: getChronoPercentage() }}
            >
              <div className={`flex h-3 w-3 flex-none items-start border-2 border-solid ${borderMain} ${crimsonBg}`} />
              <div className={`flex h-6 w-px flex-none items-start ${borderMain}`} />
            </div>

            {/* Clickable Year Markers (2017 - 2026) */}
            <div className="flex w-full items-start justify-between pt-1">
              {[2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => {
                const isActive = activeYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => handleYearClick(yr)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      className={`flex h-1.5 w-px flex-none items-start transition-colors ${
                        isActive ? crimsonBg : bgBorder
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] transition-colors duration-150 ${
                        isActive ? `${crimsonText} font-[700]` : textMuted
                      } group-hover:${crimsonText}`}
                    >
                      {yr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Realtime Timecode Display */}
          <div className={`flex items-center gap-2 border border-solid ${borderMain} px-3 py-1.5 mobile:hidden`}>
            <span className={`font-mono ${textMain} text-[12px] tracking-[0.12em]`}>
              {timecode}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
