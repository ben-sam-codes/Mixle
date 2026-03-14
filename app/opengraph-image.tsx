import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const alt = "Mixle — Daily Word Game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const spaceMono = await readFile(
    join(process.cwd(), "public/fonts/SpaceMono-Bold.ttf")
  );

  const sampleLetters = ["M", "I", "X", "L", "E", "W", "O", "R", "D"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "SpaceMono",
        }}
      >
        {/* Letter tiles */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          {sampleLetters.map((letter, i) => (
            <div
              key={i}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: 700,
                color: "#eee",
                background:
                  i < 5
                    ? "linear-gradient(135deg, #e94560, #f5c518)"
                    : "#1c2a4a",
                border: i < 5 ? "none" : "2px solid #253a5e",
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #e94560, #f5c518)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
          }}
        >
          Mixle
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#8892a4",
            marginTop: "12px",
          }}
        >
          Make your best word
        </div>

        {/* Description pills */}
        <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
          {["9 Letters", "3 Rounds", "Daily Puzzle"].map((text) => (
            <div
              key={text}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(233, 69, 96, 0.15)",
                border: "1px solid rgba(233, 69, 96, 0.3)",
                color: "#e94560",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "SpaceMono",
          data: await spaceMono,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
