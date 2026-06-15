/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Video,
  Clock,
  Compass,
  Layers,
  Cpu,
  GitBranch,
  UserCheck,
  Bell,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  FileText,
  ChevronRight,
  ChevronLeft,
  Download,
  AlertCircle,
  MapPin,
  Calendar,
  Wifi,
  Tv,
  FileCode,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { VIDEO_FEEDS, ARCH_NODES, VideoFeed, TimelineEntry } from "./data";

export default function App() {
  const [selectedFeedId, setSelectedFeedId] = useState<string>("feed-03"); // Default to Feed 3 (the longest walkthrough)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedArchNode, setSelectedArchNode] = useState<string | null>(null);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);
  const [bellCount, setBellCount] = useState<number>(0);
  const [bellRippling, setBellRippling] = useState<boolean>(false);

  const activeFeedObj = VIDEO_FEEDS.find((f) => f.id === selectedFeedId) || VIDEO_FEEDS[2];
  const activeTimelineItem = activeFeedObj.timeline[activeSegmentIndex] || activeFeedObj.timeline[0];

  useEffect(() => {
    // Reset active index when feed changes
    setActiveSegmentIndex(0);
    setIsPlaying(false);
    addDiagnostic(`Switched to ${activeFeedObj.title}`);
  }, [selectedFeedId]);

  // Simulation timer for "playing" the timeline
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveSegmentIndex((prev) => {
          if (prev >= activeFeedObj.timeline.length - 1) {
            setIsPlaying(false);
            addDiagnostic("Timeline sequence playback completed.");
            return prev;
          }
          const nextIndex = prev + 1;
          addDiagnostic(`Auto-scrubbed to timestamp: ${activeFeedObj.timeline[nextIndex].timeLabel}`);
          return nextIndex;
        });
      }, 3500 / playSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeFeedObj, playSpeed]);

  const addDiagnostic = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDiagnosticLog((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Synthesize call bell sound using Web Audio API on physical bell click trigger
  const triggerBellNode = () => {
    setBellCount((prev) => prev + 1);
    setBellRippling(true);
    addDiagnostic("Maneuvered station call-bell. Web Audio chime wave generated.");
    setTimeout(() => setBellRippling(false), 800);

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const osc3 = audioCtx.createOscillator();
      
      const gainNode1 = audioCtx.createGain();
      const gainNode2 = audioCtx.createGain();
      const gainNode3 = audioCtx.createGain();
      
      const masterGain = audioCtx.createGain();
      
      const baseFreq = 2200; // Realistic desk bell frequency
      
      osc1.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, audioCtx.currentTime); // Perfect fifth over
      osc3.frequency.setValueAtTime(baseFreq * 2.01, audioCtx.currentTime); // Sparkle overtone
      
      // Decay envelopes
      gainNode1.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      
      gainNode2.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      
      gainNode3.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode3.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      
      masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      
      osc1.connect(gainNode1);
      osc2.connect(gainNode2);
      osc3.connect(gainNode3);
      
      gainNode1.connect(masterGain);
      gainNode2.connect(masterGain);
      gainNode3.connect(masterGain);
      
      masterGain.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      osc3.start();
      
      osc1.stop(audioCtx.currentTime + 1.3);
      osc2.stop(audioCtx.currentTime + 0.7);
      osc3.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      console.warn("AudioContext active lock in browser sandbox:", err);
    }
  };

  const copyMarkdownContext = () => {
    const md = `
# CHRONOLOGICAL LOG: SOVEREIGN NODE AUDIT FEEDS
System Epoch: Q4 2025 - Q2 2026
Verified Host: Roy Hodge Jr.

${VIDEO_FEEDS.map((feed) => `
## ${feed.title} (${feed.subtitle})
- Location: ${feed.location}
- System Era: ${feed.systemEra}
- Summary: ${feed.summaryText}
- Hardware Inventory: ${feed.hardwareInventory.join(", ")}

TIMELINE EVENTS:
${feed.timeline.map((item) => `
### [${item.timeLabel}] ${item.eventTitle} (${item.category})
- Visual Summary: ${item.summary}
- Technical Detail: ${item.details}
${item.transcript ? `- Audio Transcript: ${item.transcript}` : ""}
`).join("")}
`).join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopiedCode(true);
    addDiagnostic("Markdown document copied to user clipboard.");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1a1a1a] font-sans flex flex-col selection:bg-neutral-900 selection:text-white">
      
      {/* 🚀 Top Ambient Status Line */}
      <div className="bg-[#FAF9F5] border-b border-neutral-300 px-6 py-2.5 text-[10px] uppercase font-mono tracking-widest flex justify-between items-center text-neutral-600 select-none">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-none bg-neutral-900 animate-pulse"></span>
          <span>Sovereign Node: <strong className="text-neutral-950 font-bold">Active-812</strong></span>
          <span className="text-neutral-300">/</span>
          <span>Latency: <strong className="text-neutral-950 font-bold">0.03ms</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Era Calibration: <strong className="text-neutral-950 font-bold">June 2026</strong></span>
          <span className="text-neutral-300">/</span>
          <span>UTC Sync: <strong className="text-neutral-950 font-bold">Online</strong></span>
        </div>
      </div>

      {/* 🛰️ Navbar (Editorial Masthead Style) */}
      <header className="px-8 pt-10 pb-8 bg-[#FDFDFB] border-b border-neutral-300 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-neutral-900 text-[#FDFDFB] p-2 aspect-square flex items-center justify-center font-serif text-lg font-bold shadow-md">
              C
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-neutral-900 leading-none">
              CHRONO-TELEMETRY
            </h1>
          </div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#4a4a4a] mt-3.5 flex items-center gap-2 flex-wrap font-medium">
            <span>Video Forensic Logs</span>
            <span className="text-neutral-300">•</span>
            <span>Sovereign Multi-Agent Architecture Synthesis</span>
            <span className="text-neutral-350">•</span>
            <span className="italic text-neutral-500 font-serif lowercase tracking-wide font-normal">compiled Q2 2026</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            id="btn-copy-markdown"
            onClick={copyMarkdownContext}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-[#FDFDFB] px-5 py-3 text-xs font-mono uppercase tracking-widest transition-all duration-250 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-semibold"
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Export Forensic Log</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 🔮 Active Feed Indicator */}
      <section className="px-8 py-5 bg-[#FAFBF8] border-b border-neutral-300 sticky top-0 z-40 backdrop-blur-md">
        <label className="text-neutral-500 text-[9px] uppercase tracking-widest font-mono block mb-3 font-semibold select-none">
          Select Inspected Telemetry Feed
        </label>
        <div className="flex flex-wrap gap-3">
          {VIDEO_FEEDS.map((feed) => {
            const isActive = feed.id === selectedFeedId;
            return (
              <button
                key={feed.id}
                id={`btn-tab-${feed.id}`}
                onClick={() => setSelectedFeedId(feed.id)}
                className={`px-5 py-3.5 text-xs transition-all text-left flex items-center gap-4.5 border ${
                  isActive
                    ? "bg-white border-2 border-neutral-900 text-neutral-900 shadow-md scale-[1.01]"
                    : "bg-[#FDFDFB] border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 hover:bg-[#FAFAF7]"
                }`}
              >
                <Video className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-neutral-900" : "text-neutral-400"}`} />
                <div>
                  <div className="font-serif font-bold tracking-tight text-neutral-900 text-sm">{feed.title.split(":")[0]}</div>
                  <div className="text-[9px] text-neutral-500 font-mono mt-0.5 font-normal uppercase tracking-wider">{feed.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🦾 Main Multi-Module Control Panels */}
      <main className="flex-1 p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 bg-[#F6F5F2]/20 border-b border-neutral-300">
        
        {/* ================= COLUMN 1: VISUAL SIMULATOR (5 cols) ================= */}
        <section className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-neutral-300 p-6 flex flex-col h-full justify-between shadow-sm relative">
            {/* Top Border Accent block for editorial aesthetic */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-900"></div>
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-100">
                <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-800 flex items-center gap-2 font-bold select-none">
                  <span className="w-2 h-2 bg-neutral-950 rounded-none animate-pulse" />
                  Visual Frame Exhibit
                </span>
                <span className="text-[10px] font-mono text-neutral-400 font-medium">
                  REF ID: {activeTimelineItem.frameVisualId}
                </span>
              </div>

              {/* Simulated Media Player Screen Container - Elegant Editorial Gallery board */}
              <div className="relative aspect-video bg-stone-900 p-1.5 border border-neutral-250 shadow-inner">
                <div className="relative w-full h-full overflow-hidden border-4 border-white shadow-md">
                
                {/* SVG/CSS Driven Precise Video Screen Re-creations */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTimelineItem.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <RenderedFrameVisualizer visualId={activeTimelineItem.frameVisualId} />
                  </motion.div>
                </AnimatePresence>

                {/* Picture-in-Picture (PIP) Simulated Box */}
                <AnimatePresence>
                  {selectedFeedId !== "feed-01" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-3 right-3 w-28 aspect-[4/3] bg-[#FDFDFB] border border-neutral-800 shadow-xl overflow-hidden z-10 p-0.5"
                    >
                      <div className="relative w-full h-full bg-stone-950 flex flex-col items-center justify-center p-1">
                        <span className="absolute top-1 left-1.5 text-[7px] font-mono text-[#FDFDFB] bg-neutral-900 px-1 py-0.5 uppercase tracking-wider font-bold">
                          PIP REC
                        </span>
                        
                        {/* Render miniature representation of Roy Hodge Jr. based on scene */}
                        {activeTimelineItem.frameVisualId === "desk-bell-strike" && (
                          <div className="text-center">
                            <div className="w-7 h-7 rounded-full bg-stone-800 border border-neutral-700 mx-auto overflow-hidden relative">
                              <span className="absolute top-0.5 left-2 w-3 h-3 rounded-full bg-neutral-400" />
                              <div className="absolute bottom-0 inset-x-0 h-2.5 bg-neutral-300" />
                            </div>
                            <span className="text-[7px] font-mono text-neutral-400 block mt-1 uppercase leading-none">Syncing</span>
                          </div>
                        )}

                        {activeTimelineItem.frameVisualId === "desk-laptop-view" && (
                          <div className="text-center relative">
                            <span className="w-1 h-1 rounded-full bg-red-500 absolute top-0 -left-1.5 animate-pulse" />
                            <div className="w-7 h-7 rounded-full bg-stone-800 border border-neutral-700 mx-auto overflow-hidden relative">
                              <span className="absolute top-0.5 left-2 w-3 h-3 rounded-full bg-neutral-400" />
                              <div className="absolute bottom-0 inset-x-0 h-2.5 bg-neutral-100" />
                            </div>
                            <span className="text-[7px] font-mono text-neutral-300 block mt-1 uppercase leading-none">Auditing</span>
                          </div>
                        )}

                        {activeTimelineItem.frameVisualId === "desk-peace-sign" && (
                          <div className="text-center relative">
                            <div className="w-7 h-7 rounded-full bg-stone-800 border border-neutral-700 mx-auto overflow-hidden relative">
                              <span className="absolute top-0.5 left-2 w-3 h-3 rounded-full bg-neutral-400" />
                              {/* Hand peace symbol vector overlay */}
                              <div className="absolute bottom-3 right-2 w-2 h-2.5 bg-neutral-300 rounded-sm flex gap-0.5 p-0.5">
                                <div className="w-0.5 h-1.5 bg-neutral-100 rounded-full" />
                                <div className="w-0.5 h-1.5 bg-neutral-100 rounded-full" />
                              </div>
                              <div className="absolute bottom-0 inset-x-0 h-2.5 bg-neutral-200" />
                            </div>
                            <span className="text-[7px] font-mono text-neutral-200 block mt-1 font-bold uppercase leading-none">"v" gesture</span>
                          </div>
                        )}

                        {activeTimelineItem.frameVisualId.startsWith("walk-") && (
                          <div className="text-center relative flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-stone-800 border border-neutral-700 overflow-hidden relative">
                              {/* Head */}
                              <span className="absolute top-0.5 left-2.5 w-3.5 h-3.5 rounded-full bg-neutral-400" />
                              {/* Cigarette / Vape spark */}
                              <span className="absolute top-3 right-3.5 w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                              {/* White Tee Shirt */}
                              <div className="absolute bottom-0 inset-x-0 h-3 bg-neutral-200" />
                            </div>
                            <p className="text-[6px] font-mono text-neutral-400 tracking-wider uppercase mt-1 leading-none">
                              {activeTimelineItem.relativeSeconds < 20 ? "Vocal Walk" : "Active Audit"}
                            </p>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Screen overlays (Date indicators) */}
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end pointer-events-none z-20">
                  <div className="bg-neutral-900/90 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">
                    {selectedFeedId === "feed-01" ? "I-65 SCOTTSBURG IN" : "SOVEREIGN WALKDRAWN_LOG"}
                  </div>
                  <div className="bg-neutral-900/90 text-white font-mono text-[9px] tracking-wider px-2 py-0.5 font-bold">
                    {activeTimelineItem.timeLabel}
                  </div>
                </div>

                </div>
              </div>
            </div>

            {/* Simulated Player Controls and Scrubber Progress */}
            <div className="mt-6">
              <div className="flex gap-2 mb-3 bg-[#FAF9F5] p-3 border border-neutral-200 justify-between items-center text-xs">
                <span className="font-mono text-[11px] text-neutral-800 font-bold">
                  {activeTimelineItem.timeLabel}
                </span>
                <div className="flex-1 mx-3 relative">
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <motion.div
                      className="bg-neutral-900 h-full"
                      animate={{
                        width: `${((activeSegmentIndex + 1) / activeFeedObj.timeline.length) * 100}%`
                      }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>
                <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-normal text-[9px]">
                  Seg {activeSegmentIndex + 1} / {activeFeedObj.timeline.length}
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#FAF9F5]/40 p-1 border border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      addDiagnostic(isPlaying ? "Paused playback simulator." : "Active simulation playback running.");
                    }}
                    className={`px-4 py-2.5 text-xs font-mono tracking-wider font-bold uppercase transition-all duration-150 ${
                      isPlaying
                        ? "bg-neutral-900 text-white hover:bg-black"
                        : "bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    {isPlaying ? "PAUSE FEED" : "RUN SIMULATOR"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSegmentIndex(0);
                      setIsPlaying(false);
                      addDiagnostic("Manually reset timeline scrubber to 00:00.");
                    }}
                    className="p-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-600 transition-all font-mono text-xs font-bold uppercase"
                    title="Restart Sequence"
                  >
                    RESET
                  </button>

                  <div className="text-[10px] bg-white border border-neutral-250 px-2 py-1 font-mono text-neutral-500 font-bold">
                    SPD: {playSpeed}x
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={activeSegmentIndex === 0}
                    onClick={() => setActiveSegmentIndex((p) => Math.max(0, p - 1))}
                    className="p-2 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeSegmentIndex === activeFeedObj.timeline.length - 1}
                    onClick={() => setActiveSegmentIndex((p) => Math.min(activeFeedObj.timeline.length - 1, p + 1))}
                    className="p-2 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
          {/* ================= COLUMN 2: THE CHRONOLOGICAL FEED (4 cols) ================= */}
        <section className="xl:col-span-4 flex flex-col gap-4 animate-fadeIn">
          <div className="bg-white border border-neutral-300 p-6 flex flex-col h-full shadow-sm relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-950"></div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100 font-bold select-none">
              <Clock className="w-4 h-4 text-neutral-900" />
              Chronological Event Ledger
            </span>

            {/* List scroll container */}
            <div className="flex-1 overflow-y-auto pr-1 overflow-x-hidden space-y-3.5 max-h-[460px]">
              {activeFeedObj.timeline.map((item, index) => {
                const isActive = index === activeSegmentIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveSegmentIndex(index);
                      addDiagnostic(`Manually selected timeline mark: [${item.timeLabel}]`);
                    }}
                    className={`p-4 transition-all text-left cursor-pointer border ${
                      isActive
                        ? "bg-[#FAFAF7] border-neutral-900 border-l-4 border-l-neutral-900 shadow-md scale-[1.01]"
                        : "bg-white border-neutral-200 border-l-4 border-l-transparent hover:bg-neutral-50 text-neutral-600"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2.5 gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        {item.timeLabel}
                      </span>
                      <span className={`text-[9.5px] font-mono px-2 py-0.5 font-extrabold uppercase tracking-widest border ${
                        item.category === "TELEMETRY" ? "bg-amber-50 text-amber-900 border-amber-200" :
                        item.category === "SENSE" ? "bg-stone-100 text-stone-800 border-stone-300" :
                        item.category === "AUDIT" ? "bg-rose-50 text-rose-900 border-rose-200" :
                        item.category === "ACTION" ? "bg-blue-50 text-blue-900 border-blue-200" :
                        "bg-neutral-100 text-neutral-800 border-neutral-300"
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold font-serif leading-tight tracking-tight ${isActive ? "text-neutral-900 font-extrabold" : "text-neutral-800 font-semibold"}`}>
                      {item.eventTitle}
                    </h4>

                    <p className="text-[11.5px] text-neutral-500 mt-2 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Short Audio indicator if transcripts are present */}
                    {item.transcript && (
                      <div className="mt-3.5 flex items-center gap-2 text-[10px] text-neutral-800 font-mono bg-neutral-100/80 p-2 border border-neutral-200">
                        <Volume2 className="w-3.5 h-3.5 flex-shrink-0 text-neutral-600" />
                        <span className="truncate italic font-serif text-neutral-700">"{item.transcript}"</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Diagnostic Terminal Module */}
            <div className="mt-6 border-t border-neutral-200 pt-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block mb-2.5 font-bold">
                Operational Telemetry Printout
              </span>
              <div className="bg-neutral-950 p-3 text-[10px] font-mono text-neutral-300 h-28 overflow-y-auto space-y-1.5 select-none border border-neutral-800">
                {diagnosticLog.length === 0 ? (
                  <p className="text-neutral-600 italic">No telemetry signal. Synchronize controls or click elements to track...</p>
                ) : (
                  diagnosticLog.map((log, lIdx) => (
                    <div key={lIdx} className="leading-relaxed">
                      <span className="text-neutral-500 font-bold">//</span> {log}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ================= COLUMN 3: CONTEXTUAL METADATA (3 cols) ================= */}
        <section className="xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white border border-neutral-300 p-6 flex flex-col justify-between h-full shadow-sm relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-950"></div>
            <div>
              <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100 font-bold select-none">
                <Compass className="w-4 h-4 text-neutral-900" />
                Physical Node dossier
              </span>

              {/* Coordinates block if present */}
              {activeFeedObj.coordinates && (
                <div className="bg-[#FAF9F5] p-3.5 border border-neutral-200 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 text-neutral-900" />
                    <span className="font-bold">GPS COORDINATES:</span>
                  </div>
                  <div className="text-neutral-900 font-bold mt-1 text-sm bg-white p-1.5 border border-neutral-200">
                    {activeFeedObj.coordinates.lat}, {activeFeedObj.coordinates.lng}
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeFeedObj.coordinates.lat},${activeFeedObj.coordinates.lng}`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="text-[10px] text-neutral-800 font-bold underline uppercase tracking-wider mt-2.5 flex items-center gap-1 hover:text-black transition-colors"
                  >
                    View Satellite Position <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {/* Node Timestamp Card */}
              <div className="bg-[#FAF9F5] p-3.5 border border-neutral-200 mb-4 text-xs font-mono text-neutral-600 space-y-2">
                <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                  <span>ERA SPEC:</span>
                  <span className="text-neutral-900 font-bold">{activeFeedObj.systemEra}</span>
                </div>
                <div className="flex justify-between">
                  <span>FEED SOURCE:</span>
                  <span className="text-neutral-900 font-bold text-right">{activeFeedObj.location.split(",")[0]}</span>
                </div>
              </div>

              {/* Detailed Explanation Context Cards */}
              <div className="bg-neutral-50 p-4 border border-neutral-200 mb-4 rounded-none">
                <label className="text-[9.5px] text-neutral-500 font-mono font-bold uppercase tracking-widest block mb-2 select-none">
                  Technical Insight & Narrative
                </label>
                <p className="text-[12.5px] font-serif text-neutral-800 leading-relaxed font-normal">
                  {activeTimelineItem.details}
                </p>
              </div>

              {/* Hardware Inventory Catalog */}
              <div className="bg-[#FAF9F5] p-4 border border-neutral-200">
                <span className="text-[9.5px] text-neutral-500 font-mono font-bold uppercase tracking-widest block mb-3 select-none">
                  Observed Physical Hardware
                </span>
                <ul className="text-xs text-neutral-800 space-y-2.5 list-none pr-1">
                  {activeFeedObj.hardwareInventory.map((hw, index) => {
                    // Check if it's the call-bell in Feed 02 to render a cute ringing element!
                    const isBell = hw.includes("Call Bell");
                    return (
                      <li key={index} className="flex items-start gap-2 leading-snug">
                        <span className="text-neutral-900 mt-1 flex-shrink-0">•</span>
                        <div className="flex-1">
                          <span className="font-serif italic font-medium">{hw}</span>
                          {isBell && (
                            <div className="mt-2.5">
                              <button
                                onClick={triggerBellNode}
                                className={`px-3.5 py-2 bg-neutral-900 hover:bg-black text-white text-[10px] uppercase font-mono tracking-wider flex items-center gap-2 select-none transition-all duration-150 ${
                                  bellRippling ? "ring-2 ring-neutral-950 ring-offset-2" : ""
                                }`}
                              >
                                <Bell className={`w-3.5 h-3.5 ${bellRippling ? "animate-bounce" : ""}`} />
                                <span>Strike Bell ({bellCount})</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* General System Context Warning */}
            <div className="mt-6 flex gap-3 items-start bg-[#FFFBEB] p-4 border border-yellow-250">
              <AlertCircle className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-900 font-mono leading-relaxed uppercase tracking-wider select-none font-bold">
                Log coordinates match telemetry records. Context is optimized.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ================= SECTION 4: SOVEREIGN COORDINATION ARCHITECTURE (BLUEPRINT) ================= */}
      <section className="m-8 p-8 bg-white border border-neutral-300 shadow-sm relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-900"></div>
        
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#4a4a4a] flex items-center gap-2 font-bold mb-1.5">
              <Layers className="w-4 h-4 text-neutral-900" />
              Sovereign Coordination Architecture blueprint
            </span>
            <h3 className="text-xl font-bold font-serif text-neutral-900 tracking-tight">
              Interactive System Topology (Roy × Claude × Gemini)
            </h3>
            <p className="text-xs text-neutral-500 max-w-xl mt-1.5 leading-relaxed font-sans">
              Visualizing the peer-to-peer relationships between physical user intent, external data nodes, and autonomous multi-agent systems.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-[#FAF9F5] text-neutral-700 px-3 py-2 border border-neutral-250 font-bold tracking-wider uppercase select-none">
            SPECIFICATION REFERENCE #4-A
          </span>
        </div>

        {/* Blueprint Flow Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Node details panel */}
          <div className="lg:col-span-4 bg-[#FAF9F5] p-5 border border-neutral-250 h-96 flex flex-col justify-between">
            {selectedArchNode ? (
              (() => {
                const node = ARCH_NODES.find((n) => n.id === selectedArchNode);
                if (!node) return null;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono bg-neutral-900 px-2.5 py-1 text-white uppercase tracking-wider font-extrabold">
                        Component Dossier
                      </span>
                      <h4 className="text-base font-extrabold font-serif text-neutral-900 mt-3 pb-1 border-b border-neutral-200">
                        {node.title}
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-2.5 p-3 bg-white border border-neutral-200 font-sans">
                        {node.description}
                      </p>

                      <div className="mt-4">
                        <span className="text-[9px] font-mono uppercase text-neutral-500 block mb-2 font-bold tracking-wider">
                          Operational Targets & Schemas
                        </span>
                        <div className="space-y-1.5">
                          {node.items.map((item, index) => (
                            <div
                              key={index}
                              className="text-[11px] font-mono text-neutral-800 flex items-start gap-1.5 bg-white p-2 border border-neutral-100"
                            >
                              <span className="text-neutral-900 font-bold">//</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedArchNode(null)}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 text-left mt-4 border-t border-neutral-200 pt-3"
                    >
                      &larr; Back to Schematic Index
                    </button>
                  </motion.div>
                );
              })()
            ) : (
              <div className="text-center my-auto px-4 py-8 select-none">
                <GitBranch className="w-8 h-8 text-neutral-400 mx-auto mb-4" />
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  No schematic node selected
                </h4>
                <p className="text-[11.5px] text-neutral-500 leading-relaxed mt-2.5 font-sans">
                  Click on any interactive node in the vector blueprint schematic to retrieve specific resources, operational parameters, and digital integrity targets.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {ARCH_NODES.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedArchNode(n.id)}
                      className="text-[9px] font-mono px-2.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:border-neutral-900 hover:bg-neutral-50 transition-colors uppercase font-bold"
                    >
                      {n.title.split("-")[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Vector Schematics (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-neutral-250 p-5 overflow-x-auto">
            <div className="min-w-[580px] py-4 relative flex flex-col items-center">
              
              {/* Central flow connector line */}
              <div className="absolute inset-y-0 w-0.5 bg-neutral-200 z-0 select-none pointer-events-none" />

              {/* Artifact Hub Node (Top of stack) */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                id="arch-artifact-hub"
                onClick={() => setSelectedArchNode("artifact-hub")}
                className={`w-3/4 max-w-md p-4 border cursor-pointer z-10 text-center transition-all ${
                  selectedArchNode === "artifact-hub"
                    ? "border-neutral-900 border-2 bg-[#FAF9F5] shadow-md"
                    : "border-neutral-200 bg-white hover:border-neutral-400"
                }`}
              >
                <div className="font-mono text-[9px] uppercase text-neutral-500 font-bold mb-1 tracking-wider">
                  Shared Asset Store
                </div>
                <div className="font-serif font-extrabold text-sm text-neutral-900">
                  ARTIFACT HUB — Google Drive
                </div>
                <p className="text-[10px] text-neutral-500 font-mono tracking-tight mt-1 truncate uppercase">
                  Holds /daily-ops-log, /weekly-audits, and ZENODO preprint DOI indexes.
                </p>
              </motion.div>

              {/* Connect Flow Arrow */}
              <div className="h-6 flex items-center justify-center text-neutral-400 font-bold z-0 font-mono text-xs">
                ↓
              </div>

              {/* Orchestration Layer Node */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                id="arch-orchestration"
                onClick={() => setSelectedArchNode("orchestration")}
                className={`w-3/4 max-w-md p-4 border cursor-pointer z-10 text-center transition-all ${
                  selectedArchNode === "orchestration"
                    ? "border-neutral-900 border-2 bg-[#FAF9F5] shadow-md"
                    : "border-neutral-200 bg-white hover:border-neutral-400"
                }`}
              >
                <div className="font-mono text-[9px] uppercase text-neutral-500 font-bold mb-1 tracking-wider">
                  State Coordination engine
                </div>
                <div className="font-serif font-extrabold text-sm text-neutral-900">
                  ORCHESTRATION LAYER (Autonomous State Machine)
                </div>
                <p className="text-[10px] text-neutral-500 font-mono tracking-tight mt-1 truncate uppercase">
                  Maintains collaborative, conflict-free state resolution protocols.
                </p>
              </motion.div>

              {/* Two Column Split Section */}
              <div className="w-full flex justify-between gap-4 px-4 mt-6 z-10">
                
                {/* Flow Link left */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-4 w-0.5 bg-neutral-200" />
                  
                  {/* Model Layer Left */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    id="arch-models"
                    onClick={() => setSelectedArchNode("models")}
                    className={`w-full p-4 border cursor-pointer transition-all text-center ${
                      selectedArchNode === "models"
                        ? "border-neutral-900 border-2 bg-[#FAF9F5] shadow-md"
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    }`}
                  >
                    <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase block mb-1 tracking-wider">
                      Resource Executors
                    </span>
                    <h5 className="font-serif font-bold text-xs text-neutral-900 uppercase">Model Execution Core</h5>
                    <p className="text-[9px] text-neutral-500 font-mono mt-1 px-1 uppercase tracking-wider truncate">
                      Specialized agent parameters: Claude & Gemini models.
                    </p>
                  </motion.div>
                </div>

                {/* GitHub repos right */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-4 w-0.5 bg-neutral-200" />
                  
                  {/* GitHub repos right */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    id="arch-repos"
                    onClick={() => setSelectedArchNode("repos")}
                    className={`w-full p-4 border cursor-pointer transition-all text-center ${
                      selectedArchNode === "repos"
                        ? "border-neutral-900 border-2 bg-[#FAF9F5] shadow-md"
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    }`}
                  >
                    <span className="font-mono text-[9px] text-neutral-500 font-bold uppercase block mb-1 tracking-wider">
                      Version registries
                    </span>
                    <h5 className="font-serif font-bold text-xs text-neutral-900 uppercase">Sovereign Repositories</h5>
                    <p className="text-[9px] text-neutral-500 font-mono mt-1 px-1 uppercase tracking-wider truncate">
                      Persistent master registries, directories, and code branches.
                    </p>
                  </motion.div>
                </div>

              </div>

              {/* Bottom flow connector line */}
              <div className="h-6 w-0.5 bg-neutral-200 mt-4" />

              {/* Identity Mesh Node (Foot of flow) */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                id="arch-identity"
                onClick={() => setSelectedArchNode("identity")}
                className={`w-3/4 max-w-md p-4 border cursor-pointer z-10 text-center transition-all ${
                  selectedArchNode === "identity"
                    ? "border-neutral-900 border-2 bg-[#FAF9F5] shadow-md"
                    : "border-neutral-200 bg-white hover:border-neutral-400"
                }`}
              >
                <div className="font-mono text-[9px] uppercase text-neutral-500 font-bold mb-1 tracking-wider">
                  Open Verification mesh
                </div>
                <div className="font-serif font-extrabold text-sm text-neutral-900">
                  IDENTITY MESH SECURE NODES
                </div>
                <p className="text-[10px] text-neutral-500 font-mono tracking-tight mt-1 truncate uppercase">
                  Integrates ORCID digital IDs, Zenodo preprint DOIs, and verified video hashes.
                </p>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* 🔮 Deeply styled Footer */}
      <footer className="mt-auto px-8 py-6 bg-[#FAF9F5] border-t border-neutral-300 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-600">
        <p className="text-[10px] font-mono tracking-wider uppercase font-semibold">
          © 2026 Sovereign Coordination Network — Academic peer-reviewed metadata.
        </p>
        <p className="text-[10px] font-mono flex items-center gap-2 uppercase tracking-widest font-bold text-neutral-900 select-none">
          <Wifi className="w-4 h-4 text-neutral-900 animate-pulse" />
          <span>secure telemetry hub v1.0.4 - editorial suite</span>
        </p>
      </footer>

    </div>
  );
}

/**
 * 🎨 Complex CSS-drawn vector components simulating high-fidelity screenshot scenes!
 */
function RenderedFrameVisualizer({ visualId }: { visualId: string }) {
  // Feed 1: Highway scenes
  if (visualId.startsWith("highway-")) {
    return (
      <div className="relative w-full h-full bg-[#0d131a] flex items-center justify-center p-2 font-mono">
        {/* Sky gradient background */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#020508] to-[#0d131a] z-0" />

        {/* Lanes recede to horizon */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 600 338" fill="none">
          {/* Median and roadside shoulders */}
          <polygon points="0,338 250,150 270,150 0,220" fill="#1b2a1a" opacity="0.3" /> {/* Left Grassy divider */}
          <polygon points="600,338 350,150 330,150 600,240" fill="#1b2a1a" opacity="0.3" /> {/* Right shoulder grass */}
          
          {/* Main Asphalt path */}
          <polygon points="50,338 270,150 330,150 550,338" fill="#131922" />
          
          {/* Traffic white lane dashes */}
          <line x1="180" y1="338" x2="285" y2="150" stroke="#f1f5f9" strokeWidth="2.5" strokeDasharray="8 12" opacity="0.4" />
          <line x1="380" y1="338" x2="315" y2="150" stroke="#f1f5f9" strokeWidth="2.5" strokeDasharray="8 12" opacity="0.4" />
          
          {/* Center yellow divider line */}
          <line x1="285" y1="338" x2="300" y2="150" stroke="#fbbf24" strokeWidth="2" opacity="0.75" />

          {/* Oncoming Traffic Headlight Flares */}
          {visualId === "highway-bloom-strong" && (
            <>
              {/* Outer light glow bulb */}
              <circle cx="295" cy="180" r="45" fill="url(#headlight-grad-big)" opacity="0.85" />
              <circle cx="280" cy="180" r="25" fill="url(#headlight-center-glow)" opacity="0.9" />
              {/* Flare beams */}
              <polygon points="295,180 50,338 540,338" fill="url(#flare-cone)" opacity="0.2" />
            </>
          )}

          {visualId === "highway-bloom-steady" && (
            <>
              <circle cx="295" cy="180" r="35" fill="url(#headlight-grad-big)" opacity="0.75" />
              <circle cx="285" cy="181" r="18" fill="url(#headlight-center-glow)" opacity="0.9" />
              <polygon points="295,180 10,338 590,338" fill="url(#flare-cone)" opacity="0.15" />
            </>
          )}

          {/* Red Sedan Transit Scene */}
          {visualId === "highway-red-car" && (
            <g transform="translate(190, 200) scale(0.6)">
              {/* Tail flare beam */}
              <circle cx="220" cy="50" r="30" fill="url(#red-light-glow)" opacity="0.4" />
              <circle cx="100" cy="50" r="15" fill="url(#headlight-center-glow)" opacity="0.6" />

              {/* Red car outline chassis block */}
              <path d="M 60,60 L 80,45 L 200,45 L 230,52 L 240,65 L 230,75 L 50,75 Z" fill="#b91c1c" />
              <rect x="90" y="48" width="50" height="12" rx="2" fill="#1e293b" />
              <rect x="150" y="48" width="40" height="12" rx="2" fill="#1e293b" />
              
              {/* Wheels */}
              <circle cx="95" cy="74" r="12" fill="#020617" />
              <circle cx="95" cy="74" r="5" fill="#94a3b8" />
              <circle cx="195" cy="74" r="12" fill="#020617" />
              <circle cx="195" cy="74" r="5" fill="#94a3b8" />
              
              {/* Red light indicators */}
              <rect x="235" y="55" width="5" height="8" rx="1" fill="#ef4444" />
              {/* White headlamp bulb */}
              <polygon points="50,60 10,75 10,50" fill="url(#small-headlight)" opacity="0.3" />
            </g>
          )}

          {/* Underlayer gradients */}
          <defs>
            <radialGradient id="headlight-grad-big" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="headlight-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="red-light-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="flare-cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="small-headlight" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Real camera telemetry OSD overlay details standard to Indiana surveillance cams */}
        <div className="absolute top-2 left-3 z-20 text-[9px] font-mono text-slate-300 drop-shadow flex flex-col leading-tight">
          <span>511in.org/camera/13810</span>
          <span>LAT: 38.87982 | LNG: -85.77519</span>
        </div>

        <div className="absolute bottom-2 left-3 z-20 text-xs font-mono font-bold tracking-widest text-[#ececf1] drop-shadow">
          {visualId === "highway-bloom-strong" && "2025-11-13 21:58:57"}
          {visualId === "highway-bloom-steady" && "2025-11-13 21:59:00"}
          {visualId === "highway-red-car" && "2025-11-13 21:59:02"}
        </div>
      </div>
    );
  }

  // Feed 2: Workstation desk check-in
  if (visualId.startsWith("desk-")) {
    return (
      <div className="relative w-full h-full bg-[#1b140f] overflow-hidden p-2">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 338" fill="none">
          {/* Wood deck desk panel receding */}
          <polygon points="0,338 0,160 600,160 600,338" fill="#5c3a21" opacity="0.8" />
          <polygon points="0,220 0,160 600,160 600,220" fill="#3d2211" opacity="0.9" />

          {/* Wooden wall background lines */}
          <line x1="300" y1="160" x2="300" y2="0" stroke="#2c1a0e" strokeWidth="2" />
          <line x1="500" y1="160" x2="500" y2="0" stroke="#2c1a0e" strokeWidth="2" />
          <line x1="100" y1="160" x2="100" y2="0" stroke="#2c1a0e" strokeWidth="2" />

          {/* Unfinished drywall framing outlines on the right side background */}
          {visualId === "desk-peace-sign" && (
            <g opacity="0.75" transform="translate(180, 20)">
              {/* Insulated Studs vector */}
              <rect x="250" y="-30" width="15" height="170" fill="#fabc3f" opacity="0.3" />
              <rect x="330" y="-30" width="15" height="170" fill="#fabc3f" opacity="0.3" />
              {/* Mud seams gray lines */}
              <path d="M 200, 0 L 210, 140" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
              <path d="M 290, -10 L 305, 140" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
              {/* White Door on the left */}
              <rect x="-80" y="-10" width="110" height="150" fill="#f8fafc" stroke="#64748b" strokeWidth="3" />
              <circle cx="15" cy="65" r="5" fill="#020617" /> {/* Black lever handle */}
              <line x1="15" y1="65" x2="25" y2="65" stroke="#020617" strokeWidth="3.5" />
            </g>
          )}

          {/* Verification Call-Bell under desk view */}
          {visualId === "desk-bell-strike" && (
            <g transform="translate(170, 165)">
              {/* Lower Shelf panel */}
              <polygon points="0,173 0,55 350,55 350,173" fill="#2d1d13" />
              
              {/* The Call Bell container */}
              <g transform="translate(140, 60)">
                {/* Brass gold pedestal base */}
                <path d="M 10,70 Q 15,65 50,65 Q 85,65 90,70 Z" fill="#92400e" stroke="#78350f" strokeWidth="1" />
                
                {/* Silver rounded metallic dome */}
                <path d="M 15,65 Q 15,30 50,30 Q 85,30 85,65 Z" fill="url(#silver-bell-dome)" stroke="#475569" strokeWidth="1" />
                
                {/* Top strike button */}
                <rect x="45" y="16" width="10" height="14" fill="#64748b" stroke="#334155" />
                <ellipse cx="50" cy="16" rx="8" ry="4" fill="#475569" />

                {/* Simulated action strike ring ripple (Hand element) */}
                <motion.ellipse
                  cx="50"
                  cy="16"
                  rx="15"
                  ry="8"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  fill="none"
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />

                {/* Hovering Hand Indicator */}
                <path d="M 45,-5 L 50,12 L 55,-5 Z" fill="#fda4af" opacity="0.8" />
              </g>
            </g>
          )}

          {/* Running Pegasus Laptop & Brass Table Lamp POV */}
          {(visualId === "desk-laptop-view" || visualId === "desk-peace-sign") && (
            <g transform="translate(110, 110)">
              {/* Desktop Lamp emitting a soft conical yellow beam onto desk table top */}
              <g transform="translate(40, -10)">
                {/* Cone of soft spotlight glow */}
                <polygon points="50,60 -60,228 160,228" fill="url(#soft-lamp-shine)" opacity="0.3" />
                
                {/* Brass stand, arm, and beige shade */}
                <line x1="50" y1="60" x2="50" y2="135" stroke="#78350f" strokeWidth="5.5" />
                <path d="M 30,60 L 70,60 L 80,95 L 20,95 Z" fill="#d97706" stroke="#92400e" strokeWidth="1" />
                <rect x="42" y="135" width="16" height="6" fill="#78350f" />
              </g>

              {/* Laptop Core setup */}
              <g transform="translate(180, 50)">
                {/* Standard angled screen frame outline */}
                <polygon points="10,0 210,0 220,110 -10,110" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                {/* Glowing neon pegasus wallpaper image */}
                <polygon points="15,5 205,5 212,105 -2,105" fill="#020617" />
                
                {/* Glowing cyan Pegasus Wings Symbol */}
                <path
                  d="M 105,35 Q 75,30 85,55 Q 98,58 105,48 M 105,35 Q 135,30 125,55 Q 112,58 105,48 M 105,48 L 105,80"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  fill="none"
                  className="animate-pulse"
                />
                <circle cx="105" cy="45" r="4.5" fill="#38bdf8" />
                <path d="M 105,80 L 100,92 M 105,80 L 110,92" stroke="#38bdf8" strokeWidth="2" />

                {/* System keyboard panel desk edge */}
                <polygon points="-10,110 220,110 240,140 -30,140" fill="#1e293b" />
                <rect x="25" y="115" width="170" height="20" rx="2" fill="#0f172a" />
              </g>

              {/* Calendar representation on the back wall hanging */}
              <g transform="translate(20, -50)" opacity="0.6">
                <rect x="0" y="0" width="130" height="90" fill="#f8fafc" stroke="#94a3b8" />
                <rect x="0" y="0" width="130" height="15" fill="#b91c1c" />
                <text x="65" y="11" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  2026 CALENDAR
                </text>
                {/* Grid dots block layout */}
                <circle cx="15" cy="30" r="1.5" fill="#334155" />
                <circle cx="35" cy="30" r="1.5" fill="#334155" />
                <circle cx="55" cy="30" r="1.5" fill="#334155" />
                <circle cx="75" cy="30" r="1.5" fill="#334155" />
                <circle cx="95" cy="30" r="1.5" fill="#334155" />
                <circle cx="115" cy="30" r="1.5" fill="#334155" />
                <circle cx="15" cy="45" r="1.5" fill="#334155" />
                <circle cx="35" cy="45" r="1.5" fill="#334155" />
                <circle cx="55" cy="45" r="1.5" fill="#334155" />
                <circle cx="75" cy="45" r="1.5" fill="#334155" />
                <circle cx="95" cy="45" r="1.5" fill="#334155" />
                <circle cx="115" cy="45" r="1.5" fill="#334155" />
              </g>
            </g>
          )}

          {/* Gradients */}
          <defs>
            <radialGradient id="silver-bell-dome" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <linearGradient id="soft-lamp-shine" x1="0.5" y1="0.2" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#fef08a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5c3a21" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Feed 3: Residential walkthrough scenes
  if (visualId.startsWith("walk-")) {
    return (
      <div className="relative w-full h-full bg-[#1c2229] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 338" fill="none">
          
          {/* Base floors and ambient structures */}
          <rect x="0" y="0" width="600" height="338" fill="#13171c" />
          <polygon points="0,338 0,140 600,140 600,338" fill="#2d1c12" opacity="0.3" /> {/* Floor boards glow */}
          
          {/* Specific scene: Entry & Boots layout */}
          {visualId === "walk-entry-boots" && (
            <g transform="translate(60, 40)">
              {/* Round wooden table board panel on the left */}
              <ellipse cx="-10" cy="180" rx="140" ry="80" fill="#7c2d12" stroke="#451a03" strokeWidth="4" />
              <ellipse cx="-10" cy="180" rx="120" ry="70" fill="#9a3412" />

              {/* Wooden folding chair neat center panel */}
              <g transform="translate(190, 80)">
                {/* Chair vertical spindles and back slats */}
                <rect x="25" y="10" width="6" height="120" fill="#b45309" />
                <rect x="85" y="10" width="6" height="120" fill="#b45309" />
                <rect x="25" y="20" width="66" height="20" fill="#d97706" rx="2" />
                <rect x="25" y="45" width="66" height="15" fill="#d97706" rx="2" />
                {/* Folding diagonal leg braces */}
                <line x1="20" y1="120" x2="90" y2="190" stroke="#78350f" strokeWidth="6" />
                <line x1="90" y1="120" x2="20" y2="190" stroke="#78350f" strokeWidth="6" />
                {/* Horizontal slats seat */}
                <polygon points="10,120 100,120 110,135 0,135" fill="#f59e0b" stroke="#d97706" />
              </g>

              {/* Worn heavy leather boots sitting neatly center floor */}
              <g transform="translate(170, 210) scale(0.9)">
                {/* Left Shoe */}
                <path d="M 12,50 L 15,10 L 30,10 L 32,32 L 62,35 L 64,56 L 10,56 Z" fill="#3f2305" stroke="#1c1917" strokeWidth="2" />
                <path d="M 28,11 L 32,32 L 60,35 Q 64,48 44,54 Z" fill="#7c2d12" />
                {/* Right Shoe */}
                <g transform="translate(65, -5)">
                  <path d="M 12,50 L 15,10 L 30,10 L 32,32 L 62,35 L 64,56 L 10,56 Z" fill="#3f2305" stroke="#1c1917" strokeWidth="2" />
                  <path d="M 28,11 L 32,32 L 60,35 Q 64,48 44,54 Z" fill="#7c2d12" />
                </g>
              </g>
            </g>
          )}

          {/* Specific scene: Secure white portal gate door handle focus */}
          {visualId === "walk-door-handle" && (
            <g transform="translate(100, 40)">
              {/* Pine studs adjacent left */}
              <rect x="-80" y="-80" width="55" height="420" fill="#b45309" opacity="0.4" />
              <line x1="-25" y1="-80" x2="-25" y2="340" stroke="#d97706" strokeWidth="3" />
              
              {/* Crisp white solid door panel */}
              <rect x="-10" y="-30" width="380" height="310" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="6" />
              
              {/* Prominent black secure door latch lever handle */}
              <g transform="translate(250, 110)">
                <rect x="0" y="0" width="35" height="90" rx="3" fill="#020617" />
                <circle cx="17.5" cy="25" r="10" fill="#1e293b" />
                
                {/* Extruded secure lever handle bar */}
                <rect x="17.5" y="16" width="130" height="24" rx="5" fill="#020617" />
                <circle cx="130" cy="28" r="4" fill="#334155" />
              </g>
            </g>
          )}

          {/* Specific scene: Interior futon, climbing wall ivy, and massive reflection mirror */}
          {visualId === "walk-futon-mirror" && (
            <g transform="translate(50, 30)">
              {/* Back Wall panel mirror reflection box */}
              <rect x="120" y="10" width="280" height="130" fill="#020617" stroke="#b45309" strokeWidth="10" />
              <rect x="130" y="20" width="260" height="110" fill="#1e293b" />
              
              {/* Decorative climbing green ivy foliage paths */}
              <path d="M 100,10 Q 150,40 220,15 T 320,30 Q 380,-10 420,12" stroke="#15803d" strokeWidth="4" fill="none" />
              <circle cx="150" cy="28" r="6" fill="#166534" />
              <circle cx="190" cy="20" r="5" fill="#166534" />
              <circle cx="240" cy="18" r="7" fill="#15803d" />
              <circle cx="280" cy="26" r="5" fill="#166534" />
              <circle cx="340" cy="15" r="8" fill="#15803d" />

              {/* Futon black leather folding sofa */}
              <g transform="translate(70, 150)">
                {/* Armrests solid wooden frames */}
                <rect x="-10" y="40" width="22" height="90" rx="4" fill="#78350f" />
                <rect x="360" y="40" width="22" height="90" rx="4" fill="#78350f" />
                
                {/* Thick black leather frame base cushions */}
                <rect x="10" y="60" width="350" height="65" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                <rect x="10" y="15" width="350" height="50" rx="8" fill="#1e293b" />
                
                {/* Cozy folded deep red contrast throw fleece blanket */}
                <path d="M 40,70 Q 60,65 140,65 Q 160,115 130,125 Q 50,125 40,70 Z" fill="#991b1b" opacity="0.9" />
              </g>
            </g>
          )}

          {/* Specific scene: High modern white wardrobe structure with louvered cabinet sliders */}
          {visualId === "walk-whitewardrobe" && (
            <g transform="translate(130, 10)">
              <rect x="0" y="0" width="320" height="310" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="6" rx="4" />
              <line x1="160" y1="0" x2="160" y2="310" stroke="#cbd5e1" strokeWidth="4" />

              {/* Left Column: Horizontal storage pull-drawers stack */}
              <g transform="translate(15, 20)">
                <rect x="0" y="10" width="130" height="50" fill="#f1f5f9" stroke="#cbd5e1" rx="2" />
                <circle cx="65" cy="35" r="6" fill="#64748b" />
                
                <rect x="0" y="75" width="130" height="50" fill="#f1f5f9" stroke="#cbd5e1" rx="2" />
                <circle cx="65" cy="100" r="6" fill="#64748b" />

                <rect x="0" y="140" width="130" height="130" fill="#f1f5f9" stroke="#cbd5e1" rx="2" />
                {/* Miniature shelves inside open slots */}
                <line x1="15" y1="200" x2="115" y2="200" stroke="#cbd5e1" strokeWidth="3" />
                <line x1="15" y1="240" x2="115" y2="240" stroke="#cbd5e1" strokeWidth="3" />
              </g>

              {/* Right Column: Sliding Louvered core screen door */}
              <g transform="translate(170, 20)">
                <rect x="0" y="10" width="135" height="260" fill="#e2e8f0" stroke="#cbd5e1" rx="2" />
                {/* Horizontal louver slats */}
                <line x1="15" y1="35" x2="120" y2="35" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="55" x2="120" y2="55" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="75" x2="120" y2="75" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="95" x2="120" y2="95" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="115" x2="120" y2="115" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="135" x2="120" y2="135" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="155" x2="120" y2="155" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="175" x2="120" y2="175" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="195" x2="120" y2="195" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="215" x2="120" y2="215" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="235" x2="120" y2="235" stroke="#94a3b8" strokeWidth="4" />
                <line x1="15" y1="255" x2="120" y2="255" stroke="#94a3b8" strokeWidth="4" />
              </g>
            </g>
          )}

          {/* Specific scene: MUD MOUTH album advertisement on black TV screen & support assets */}
          {visualId === "walk-tv-mudmouth" && (
            <g transform="translate(60, 20)">
              {/* Wooden Media Shelves Console */}
              <rect x="20" y="160" width="460" height="130" fill="#7c2d12" stroke="#451a03" strokeWidth="4" />
              <line x1="20" y1="210" x2="480" y2="210" stroke="#451a03" strokeWidth="3" />

              {/* Black Flat screen TV */}
              <rect x="70" y="10" width="350" height="140" fill="#020617" stroke="#1e293b" strokeWidth="6" rx="2" />
              
              {/* TV Screen displays Mud Mouth layout */}
              <g transform="translate(80, 20)">
                {/* Abstract album CD cover poster */}
                <rect x="20" y="10" width="100" height="100" fill="#1e1b4b" stroke="#3730a3" />
                {/* Giant spiral record pattern or star */}
                <circle cx="70" cy="60" r="28" fill="#312e81" />
                <circle cx="70" cy="60" r="15" fill="#4338ca" />
                <circle cx="70" cy="60" r="4.5" fill="#ffffff" />

                {/* Promotional headline text groups */}
                <text x="140" y="32" fill="#ef4444" fontSize="16" fontWeight="bold" fontFamily="monospace">MUD MOUTH</text>
                <text x="140" y="52" fill="#ececf1" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CARRYON.COM</text>
                <text x="140" y="74" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">NO ESCAPE</text>
                <text x="140" y="92" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">ALBUM OUT NOW</text>
              </g>

              {/* Air Circulating Fan on the lower deck shelf */}
              <g transform="translate(230, 168) scale(0.9)">
                {/* Wire cage guard outer circle */}
                <circle cx="50" cy="50" r="35" stroke="#475569" strokeWidth="3.5" fill="#1e293b" />
                
                {/* 3-blade propeller fan vectors rotating dynamically */}
                <g className="animate-spin" style={{ transformOrigin: '50px 50px', animationDuration: '4s' }}>
                  <path d="M 50,50 Q 30,20 50,10 Q 70,20 50,50 Z" fill="#94a3b8" />
                  <path d="M 50,50 Q 80,30 90,50 Q 80,70 50,50 Z" fill="#94a3b8" />
                  <path d="M 50,50 Q 30,80 50,90 Q 70,80 50,50 Z" fill="#94a3b8" />
                </g>
                <circle cx="50" cy="50" r="6" fill="#475569" />
              </g>

              {/* Translucent Green Gallon Jug (Water/Chemical Bottle) */}
              <g transform="translate(130, 218)">
                {/* Main bulb body */}
                <rect x="0" y="15" width="40" height="45" rx="5" fill="#15803d" opacity="0.7" stroke="#166534" />
                {/* Handle bracket loop */}
                <path d="M 5,20 L -10,25 L -10,40 L 5,45 Z" stroke="#15803d" strokeWidth="5.5" fill="none" opacity="0.6" />
                {/* White cap neck plug */}
                <rect x="15" y="5" width="10" height="10" fill="#f8fafc" />
              </g>
            </g>
          )}

          {/* Specific scene: Yearly wall calendar, active lamp, and walkthrough route completion */}
          {visualId === "walk-calendar-fin" && (
            <g transform="translate(80, 20)">
              {/* Detailed wall calendar hanger */}
              <g transform="translate(40, 20)">
                <rect x="0" y="0" width="200" height="150" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
                <rect x="0" y="0" width="200" height="24" fill="#1e3a8a" />
                <text x="100" y="16" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  2026 YEARLY CALENDAR
                </text>
                
                {/* Miniature grid drawings representing months */}
                <g opacity="0.75" transform="translate(10, 35)">
                  {/* Row 1 calendars */}
                  <rect x="0" y="0" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="48" y="0" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="96" y="0" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="144" y="0" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  
                  {/* Row 2 calendars */}
                  <rect x="0" y="44" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="48" y="44" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="96" y="44" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="144" y="44" width="36" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                </g>
              </g>

              {/* Brass Table Lamp with beige lampshade adjacent */}
              <g transform="translate(270, 70)">
                <line x1="50" y1="50" x2="50" y2="135" stroke="#78350f" strokeWidth="5.5" />
                <polygon points="50,50 -10,210 110,210" fill="url(#soft-lamp-shine-2)" opacity="0.2" />
                <path d="M 30,50 L 70,50 L 85,90 L 15,90 Z" fill="#d97706" stroke="#92400e" strokeWidth="1" />
                <rect x="42" y="135" width="16" height="6" fill="#78350f" />
              </g>
            </g>
          )}

          {/* Underlayer gradients */}
          <defs>
            <linearGradient id="soft-lamp-shine-2" x1="0.5" y1="0.2" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Fallback black card
  return <div className="w-full h-full bg-black flex items-center justify-center text-slate-500 font-mono text-xs">NO FEED SIGNAL</div>;
}
