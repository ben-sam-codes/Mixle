import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDayNumber } from "@/lib/rng";

export const alt = "Mixle — Daily Word Game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const spaceMono = await readFile(
    join(process.cwd(), "public/fonts/SpaceMono-Bold.ttf")
  );

  const dayNum = getDayNumber();

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
          background: "#1a1a2e",
          fontFamily: "SpaceMono",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            background: "linear-gradient(180deg, #e8a44a, #c47830)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
          }}
        >
          MIXLE
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#e8a44a",
            marginTop: "20px",
          }}
        >
          {`#${dayNum} — Today's Puzzle`}
        </div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#6b7a90",
            marginTop: "16px",
          }}
        >
          MAKE YOUR BEST WORD
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "SpaceMono",
          data: spaceMono,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
