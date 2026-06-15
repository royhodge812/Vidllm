/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimelineEntry {
  id: string;
  timeLabel: string; // e.g. "21:58:57", "00:15"
  relativeSeconds: number; // For interactive scrubbing simulation
  eventTitle: string;
  category: "TELEMETRY" | "SENSE" | "AUDIT" | "TRANSCRIPT" | "ACTION";
  summary: string;
  transcript?: string;
  details: string;
  frameVisualId: string; // Ties back to illustrated rendering configuration
}

export interface VideoFeed {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  systemEra: string;
  timeline: TimelineEntry[];
  summaryText: string;
  hardwareInventory: string[];
}

export interface ArchNode {
  id: string;
  title: string;
  description: string;
  items: string[];
  color: string;
}

export const ARCH_NODES: ArchNode[] = [
  {
    id: "artifact-hub",
    title: "ARTIFACT HUB - Google Drive",
    description: "The primary distributed workspace and durable file repository for audit logging and long-context coordination files.",
    items: [
      "/daily-ops-log - Daily logs documenting autonomic operations and milestones",
      "/weekly-audits - End-of-week structural synchronization reviews",
      "/preprints-BSS-zenodo-mcp - Persistent scientific and technical preprints",
      "/repo-sync - Central mirror point for version control updates"
    ],
    color: "border-teal-500 bg-teal-950/20 text-teal-400"
  },
  {
    id: "orchestration",
    title: "ORCHESTRATION LAYER",
    description: "Multi-agent coordination controller responsible for intent classification, agent routing, and conflict-free state resolution.",
    items: [
      "Orchestrator++ Router & Classifier - Directs tasks based on intent complexity",
      "Model Assignment Protocol - Chooses specialized agents dynamically",
      "CRDT State Store - Automerge/Yjs framework enabling conflict-free shared state"
    ],
    color: "border-amber-500 bg-amber-950/20 text-amber-400"
  },
  {
    id: "models",
    title: "MODEL LAYER",
    description: "The cognitive processing units of the system, combining specialized model capabilities depending on the operational domain.",
    items: [
      "Claude Sub-Processor - Strategic planning, analytical writing, research reports",
      "Gemini Sub-Processor - Long-context retrieval, rapid code synthesis, multimodal logs",
      "Alt Frameworks - Extended workflows powered by LangGraph, CrewAI, AutoGen, and DSPy"
    ],
    color: "border-blue-500 bg-blue-950/20 text-blue-400"
  },
  {
    id: "repos",
    title: "GITHUB REPOS (royhodge812/*)",
    description: "Persistent version-controlled registry containing the master index and system status schemas.",
    items: [
      "PROJECT_REGISTRY.md - Version-controlled master list of code repositories",
      "COORDINATION.md - Shared machine-readable state and active task schemes"
    ],
    color: "border-indigo-500 bg-indigo-950/20 text-indigo-400"
  },
  {
    id: "identity",
    title: "IDENTITY MESH",
    description: "Public identity verification nodes establishing professional credibility and verifiable scientific citations.",
    items: [
      "ORCID ID - Academic validation link",
      "Zenodo DOIs - Credible milestone archival reference",
      "YouTube Vlog / X (Twitter) - Build-in-public social proof and digital footprint"
    ],
    color: "border-pink-500 bg-pink-950/20 text-pink-400"
  }
];

export const VIDEO_FEEDS: VideoFeed[] = [
  {
    id: "feed-01",
    title: "Feed 01: Night Highway Telemetry",
    subtitle: "Route I-65 Indiana Camera Tracker",
    location: "I-65 near Scottsburg, Indiana",
    coordinates: { lat: 38.87982, lng: -85.77519 },
    systemEra: "Q4 2025 (November 13)",
    summaryText: "High-angle nighttime traffic surveillance logging road conditions, weather integrity, and physical logistics flow in the southern Indiana transit corridor.",
    hardwareInventory: [
      "511in.org Traffic Monitoring Node (13810)",
      "High-Sensitivity Night Vision Lens (Infrared Modulated)",
      "Automated Optical Character Reader Telemetry Overlay"
    ],
    timeline: [
      {
        id: "f1-1",
        timeLabel: "21:58:57",
        relativeSeconds: 0,
        eventTitle: "Oncoming Traffic Bloom Detect",
        category: "TELEMETRY",
        summary: "Headlights from approaching motor vehicles flare in the camera's high-sensitivity night mode.",
        details: "Atmospheric dampness or light ground fog causes a pronounced light bloom on the main asphalt lanes. The camera captures standard low-contrast green hues in the surrounding grassy shoulders.",
        frameVisualId: "highway-bloom-strong"
      },
      {
        id: "f1-2",
        timeLabel: "21:59:00",
        relativeSeconds: 3,
        eventTitle: "Sensor Refresh & Lane Calibration",
        category: "TELEMETRY",
        summary: "Feed registers a minor frame-refresh shift as traffic maintains a steady transit speed.",
        details: "Luminosity values remain within standard parameters for night road tracking. Headlight bloom persists, tracking the approach profile of standard vehicle clusters.",
        frameVisualId: "highway-bloom-steady"
      },
      {
        id: "f1-3",
        timeLabel: "21:59:02",
        relativeSeconds: 5,
        eventTitle: "Red Sedan Transit Verified",
        category: "TELEMETRY",
        summary: "A crimson/red passenger sedan transits securely beneath overhead illumination.",
        details: "The vehicle silhouette is illuminated directly by high-intensity roadway fixtures. Silhouette verification confirms steady speed, stable steering control, and uninhibited flow.",
        frameVisualId: "highway-red-car"
      }
    ]
  },
  {
    id: "feed-02",
    title: "Feed 02: Station Node Verification",
    subtitle: "Desktop Layout & Signature Signal Check",
    location: "Sovereign Workshop Station",
    systemEra: "Mid-Year 2026 (June 14)",
    summaryText: "A short high-fidelity validation vlog testing dual-capture functionality, workstation configuration, and workspace environmental stability.",
    hardwareInventory: [
      "Custom Standing Rolling Workstation Desk",
      "Laptop with Pegasus-themed Linux Core OS",
      "Brass Adjustable Desktop Lamp with Beige Shade",
      "Workstation Signal-Verification Call Bell"
    ],
    timeline: [
      {
        id: "f2-1",
        timeLabel: "00:00",
        relativeSeconds: 0,
        eventTitle: "Autonomic Call Bell Verification",
        category: "ACTION",
        summary: "Vlogger strikes the desk service call bell to initiate the structural audio testing sequence.",
        details: "The main camera is held facing downward from the main desk panel, following the hand down to verify the location of the hardware chime.",
        transcript: "[Sound of service bell chime: *DING!*]",
        frameVisualId: "desk-bell-strike"
      },
      {
        id: "f2-2",
        timeLabel: "00:03",
        relativeSeconds: 3,
        eventTitle: "Workstation Workspace Sweep",
        category: "SENSE",
        summary: "POV pans upwards, revealing the running Pegasus desktop environment next to the desk lamp.",
        details: "The laptop is powered, indicating active network connectivity. In the top-right corner, PIP of developer Roy Hodge Jr. shows him looking down calmly at his workspace.",
        frameVisualId: "desk-laptop-view"
      },
      {
        id: "f2-3",
        timeLabel: "00:06",
        relativeSeconds: 6,
        eventTitle: "Drywall Seams & Peace Sign Sign-off",
        category: "AUDIT",
        summary: "Vlogger holds up a peace sign to declare workspace audit complete.",
        details: "Exposed joists, insulation batts, and unfinished mudded drywall seams are verified in the background. In the PIP, Roy delivers a neat 'V' gesture directly looking into the camera lens to sign off.",
        frameVisualId: "desk-peace-sign"
      }
    ]
  },
  {
    id: "feed-03",
    title: "Feed 03: Sovereign Posterity Walkthrough",
    subtitle: "Dual-Capture Living Quarters Infrastructure Audit",
    location: "Sovereign Quarters",
    systemEra: "Mid-Year 2026 (June 14)",
    summaryText: "Comprehensive walkthrough of the live-work residential habitat, documenting construction state, entertainment stations, and living accommodations under dual-capture conditions.",
    hardwareInventory: [
      "Sovereign Entry Portal (White Frame/Black Handle)",
      "Portable Dual-Capture Video Recorder Node (Vlogger Phone)",
      "Audio Synthesizer & Flat Screen TV Advertising Engine",
      "Physical Storage & Equipment Wardrobe"
    ],
    timeline: [
      {
        id: "f3-1",
        timeLabel: "00:00",
        relativeSeconds: 0,
        eventTitle: "Entryway & Work Boots Inspection",
        category: "SENSE",
        summary: "Walkthrough begins in entry porch showing boots, folding wooden chair, and heavy table.",
        details: "Camera captures a round wooden table, a matching light-colored folding wooden chair on linoleum, and a solid pair of dirty work boots on the floor. PIP shows Roy with a vape/cigarette exhaling, starting the narration.",
        transcript: "Roy: \"Sovereign dual-capture video vlogs posterity test for Q2 2026...\"",
        frameVisualId: "walk-entry-boots"
      },
      {
        id: "f3-2",
        timeLabel: "00:06",
        relativeSeconds: 6,
        eventTitle: "Entry Portal Transit",
        category: "ACTION",
        summary: "The camera is guided paste the pine framing edge toward the white interior gateway handle.",
        details: "The wood construction seams (exposed pine plywood framing) are visible around the door casing. PIP maintains video of Roy walking and speaking.",
        transcript: "Roy: \"...Believe Q3 is coming up, so hopefully this will be iterated and implemented...\"",
        frameVisualId: "walk-door-handle"
      },
      {
        id: "f3-3",
        timeLabel: "00:12",
        relativeSeconds: 12,
        eventTitle: "Interior Living Space Survey",
        category: "AUDIT",
        summary: "Inside quarters, highlighting the futon sofa, wall mirror, and shoe organization system.",
        details: "A black leather folding couch sits beneath a wall-spanning mirror framed in artificial climbing ivy. Roy's voice describes the environmental review in progress.",
        transcript: "Roy: \"...Just a quick rundown analysis of living situation and working environment...\"",
        frameVisualId: "walk-futon-mirror"
      },
      {
        id: "f3-4",
        timeLabel: "00:20",
        relativeSeconds: 20,
        eventTitle: "Louvered Wardrobe & Sound Transition",
        category: "SENSE",
        summary: "Camera pans past a tall white louvered-door cabinet; spoken narration yields to audio background music.",
        details: "The wardrobe unit hosts multiple modern pull drawers and a tall sliding louvre screen. Narration pauses. In the PIP, Roy quietly smokes.",
        transcript: "[Vocal speech transition] -> [Deep hip-hop trap synthesizer baseline begins playing]",
        frameVisualId: "walk-whitewardrobe"
      },
      {
        id: "f3-5",
        timeLabel: "00:30",
        relativeSeconds: 30,
        eventTitle: "Mud Mouth Music Broadcast Check",
        category: "TELEMETRY",
        summary: "Television shows 'MUD MOUTH CARRYON.COM' with a high-intensity trap beat.",
        details: "A desk houses a black flat-screen television displaying promotional text: 'MUD MOUTH CARRYON.COM - NO ESCAPE - ALBUM OUT NOW'. A small black fan sits underneath on a shelf next to an oversized green chemical/water bottle.",
        transcript: "[High-energy rap track with snare rolls, deep basslines, and active verses playing from TV speaker]",
        frameVisualId: "walk-tv-mudmouth"
      },
      {
        id: "f3-6",
        timeLabel: "00:46",
        relativeSeconds: 46,
        eventTitle: "Yearly Calendar & Desktop Loop Closure",
        category: "AUDIT",
        summary: "Walkthrough sweeps past the 2026 yearly wall calendar, completing the room cycle.",
        details: "The camera sweeps past the 2026 monthly calendar grid, the desktop terminal lamp, and focuses back near the doorway, completing the comprehensive audit.",
        transcript: "[Background trap music track continues looping until fade to black]",
        frameVisualId: "walk-calendar-fin"
      }
    ]
  }
];
