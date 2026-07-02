import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MariePrime Global Services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#0F2A20",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#C9A876",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          MariePrime Global Services
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 58,
            color: "#FBF9F5",
            fontWeight: 600,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Your journey, handled with precision.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            color: "rgba(251,249,245,0.7)",
          }}
        >
          Flights · Visas · Study Abroad · Business Registration
        </div>
      </div>
    ),
    { ...size }
  );
}
