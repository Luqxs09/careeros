"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type SceneKey =
  | "intro"
  | "choose-stream"
  | "science"
  | "accounting"
  | "tvet"
  | "arts"
  | "spm"
  | "engineering"
  | "internship"
  | "future";

type Stats = {
  logic: number;
  creativity: number;
  practical: number;
  business: number;
  tech: number;
  stress: number;
};

type Choice = {
  label: string;
  next: SceneKey;
  effect?: Partial<Stats>;
};

const initialStats: Stats = {
  logic: 0,
  creativity: 0,
  practical: 0,
  business: 0,
  tech: 0,
  stress: 10,
};

const scenes: Record<
  SceneKey,
  {
    age: string;
    title: string;
    text: string;
    choices: Choice[];
  }
> = {
  intro: {
    age: "15",
    title: "Form 3",
    text: "You are 15. Everyone keeps asking the same question: what stream will you choose?",
    choices: [{ label: "Start Journey", next: "choose-stream" }],
  },
  "choose-stream": {
    age: "15",
    title: "Stream Selection Day",
    text: "Your teacher explains the choices. Each stream opens different futures.",
    choices: [
      {
        label: "Science Stream",
        next: "science",
        effect: { logic: 15, tech: 10, stress: 8 },
      },
      {
        label: "Accounting Stream",
        next: "accounting",
        effect: { business: 18, logic: 8, stress: 4 },
      },
      {
        label: "TVET",
        next: "tvet",
        effect: { practical: 20, tech: 8, stress: 2 },
      },
      {
        label: "Arts Stream",
        next: "arts",
        effect: { creativity: 20, business: 5, stress: 2 },
      },
    ],
  },
  science: {
    age: "16",
    title: "Science Stream",
    text: "You choose Science Stream. Add Math is scary, Physics is confusing, but engineering starts to look interesting.",
    choices: [
      {
        label: "Continue to SPM",
        next: "spm",
        effect: { logic: 10, tech: 8, stress: 10 },
      },
    ],
  },
  accounting: {
    age: "16",
    title: "Accounting Stream",
    text: "You choose Accounting Stream. Numbers, business, and finance start to shape your future.",
    choices: [{ label: "Back to Stream Selection", next: "choose-stream" }],
  },
  tvet: {
    age: "16",
    title: "TVET Path",
    text: "You choose TVET. Hands-on skills, practical training, and technical problem solving become your strength.",
    choices: [{ label: "Back to Stream Selection", next: "choose-stream" }],
  },
  arts: {
    age: "16",
    title: "Arts Stream",
    text: "You choose Arts Stream. Creativity, communication, and human understanding become your advantage.",
    choices: [{ label: "Back to Stream Selection", next: "choose-stream" }],
  },
  spm: {
    age: "17",
    title: "SPM Results Day",
    text: "Your results are out. Now you must decide your next move after school.",
    choices: [
      {
        label: "Foundation in Engineering",
        next: "engineering",
        effect: { logic: 8, tech: 12, stress: 8 },
      },
      { label: "Restart Journey", next: "intro" },
    ],
  },
  engineering: {
    age: "19",
    title: "Engineering Degree",
    text: "You enter engineering. Coding, circuits, group projects, and sleepless assignment nights become part of your life.",
    choices: [
      {
        label: "Choose Internship",
        next: "internship",
        effect: { tech: 15, practical: 10, stress: 10 },
      },
    ],
  },
  internship: {
    age: "22",
    title: "Internship Decision",
    text: "You receive several internship options. You choose a tech-focused internship to build your AI and robotics portfolio.",
    choices: [
      {
        label: "Unlock Future Path",
        next: "future",
        effect: { tech: 20, practical: 8, business: 3 },
      },
    ],
  },
  future: {
    age: "25+",
    title: "Future Path Unlocked",
    text: "Your choices have created a possible career direction. This is not a prediction — it is a pathway simulation.",
    choices: [{ label: "Restart", next: "intro" }],
  },
};

function addStats(current: Stats, effect?: Partial<Stats>) {
  if (!effect) return current;

  return {
    logic: current.logic + (effect.logic || 0),
    creativity: current.creativity + (effect.creativity || 0),
    practical: current.practical + (effect.practical || 0),
    business: current.business + (effect.business || 0),
    tech: current.tech + (effect.tech || 0),
    stress: Math.min(100, current.stress + (effect.stress || 0)),
  };
}

function getCareerMatches(stats: Stats) {
  const careers = [
    {
      title: "AI Engineer",
      score: stats.tech * 2 + stats.logic + stats.practical,
    },
    {
      title: "Robotics Engineer",
      score: stats.tech + stats.logic + stats.practical * 2,
    },
    {
      title: "Business Analyst",
      score: stats.business * 2 + stats.logic + stats.creativity,
    },
    {
      title: "Creative Technology Strategist",
      score: stats.creativity * 2 + stats.business + stats.tech,
    },
  ];

  return careers.sort((a, b) => b.score - a.score).slice(0, 3);
}

function getCharacter(sceneKey: SceneKey) {
  if (
    sceneKey === "intro" ||
    sceneKey === "choose-stream" ||
    sceneKey === "science" ||
    sceneKey === "accounting" ||
    sceneKey === "tvet" ||
    sceneKey === "arts"
  ) {
    return "/characters/student15.png";
  }

  if (sceneKey === "spm") return "/Characters/student17.png";
  if (sceneKey === "engineering") return "/Characters/university19.png";
  if (sceneKey === "internship") return "/Characters/intern22.png";

  return "/Characters/engineer25.png";
}

function getProgress(age: string) {
  if (age === "15") return "20%";
  if (age === "16") return "35%";
  if (age === "17") return "50%";
  if (age === "19") return "70%";
  if (age === "22") return "90%";
  return "100%";
}

export default function Home() {
  const [sceneKey, setSceneKey] = useState<SceneKey>("intro");
  const [stats, setStats] = useState<Stats>(initialStats);
  const [history, setHistory] = useState<string[]>([]);

  const current = scenes[sceneKey];
  const careerMatches = getCareerMatches(stats);

  function choose(choice: Choice) {
    if (choice.next === "intro") {
      setStats(initialStats);
      setHistory([]);
      setSceneKey("intro");
      return;
    }

    setStats((prev) => addStats(prev, choice.effect));
    setHistory((prev) => [...prev, choice.label]);
    setSceneKey(choice.next);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #172554)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <motion.section
        key={sceneKey}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "980px",
          minHeight: "680px",
          borderRadius: 28,
          overflow: "hidden",
          border: "1px solid rgba(250,204,21,0.35)",
          background: "rgba(255,255,255,0.08)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            height: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: "url('/background/classroom.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <motion.img
            key={getCharacter(sceneKey)}
            src={getCharacter(sceneKey)}
            alt="character"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              height: "310px",
              maxWidth: "90%",
              objectFit: "contain",
              borderRadius: 24,
              position: "absolute",
              bottom: 0,
              zIndex: 2,
              filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        <div style={{ padding: 35, background: "rgba(0,0,0,0.35)" }}>
          <div
            style={{
              width: "100%",
              height: "12px",
              background: "#374151",
              borderRadius: "999px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: getProgress(current.age),
                height: "100%",
                background: "#facc15",
                borderRadius: "999px",
                transition: "0.5s",
              }}
            />
          </div>

          <div
            style={{
              display: "inline-block",
              background: "#facc15",
              color: "#111827",
              padding: "8px 16px",
              borderRadius: "999px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            🎂 Current Age: {current.age}
          </div>

          <h1 style={{ fontSize: "2.4rem", margin: "10px 0" }}>
            {current.title}
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: "#d1d5db",
            }}
          >
            {current.text}
          </p>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              background: "rgba(250,204,21,0.12)",
              border: "1px solid rgba(250,204,21,0.35)",
              color: "#fde68a",
              fontSize: "0.95rem",
            }}
          >
            Career OS Insight: This simulation helps students explore possible
            pathways, trade-offs, and skill gaps before making real-life
            decisions.
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <Stat label="Logic" value={stats.logic} />
            <Stat label="Tech" value={stats.tech} />
            <Stat label="Practical" value={stats.practical} />
            <Stat label="Business" value={stats.business} />
            <Stat label="Creativity" value={stats.creativity} />
            <Stat label="Stress" value={stats.stress} />
          </div>

          {history.length > 0 && (
            <div style={{ marginTop: 20, color: "#cbd5e1" }}>
              <strong>Journey:</strong> {history.join(" → ")}
            </div>
          )}

          {sceneKey === "future" && (
            <div
              style={{
                marginTop: 24,
                padding: 20,
                borderRadius: 20,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              <h2 style={{ marginTop: 0 }}>Top Career Matches</h2>

              <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                Your journey suggests several possible futures. This is not a
                prediction; it is a navigation map based on the choices and
                trade-offs you explored.
              </p>

              {careerMatches.map((career, index) => (
                <div
                  key={career.title}
                  style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 12,
                    background: "rgba(15,23,42,0.65)",
                  }}
                >
                  #{index + 1} {career.title} — Match Score: {career.score}
                </div>
              ))}

              <p style={{ color: "#d1d5db", marginTop: 16 }}>
                <strong>Recommended Next Actions:</strong>
                <br />
                1. Build a simple portfolio with your best school and university
                projects.
                <br />
                2. Learn coding fundamentals and basic AI tools.
                <br />
                3. Join robotics, innovation, or hackathon activities.
                <br />
                4. Apply for internships that match your technical interests.
              </p>
            </div>
          )}

          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {current.choices.map((choice, index) => (
              <motion.button
                key={choice.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.12 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => choose(choice)}
                style={{
                  padding: "14px 22px",
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: "#facc15",
                  color: "#111827",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(250,204,21,0.35)",
                }}
              >
                <div>{choice.label}</div>

                {choice.effect && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: "0.75rem",
                      opacity: 0.75,
                      fontWeight: "normal",
                    }}
                  >
                    {Object.entries(choice.effect)
                      .map(([key, value]) => `+${value} ${key}`)
                      .join(" • ")}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.15)",
        fontSize: "0.9rem",
      }}
    >
      <strong>{label}:</strong> {value}
    </div>
  );
}