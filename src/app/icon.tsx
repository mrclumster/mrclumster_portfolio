import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          background: "linear-gradient(135deg, #1a3a5c, #0d2240)",
          color: "white",
          fontSize: "16px",
          fontWeight: 700,
          letterSpacing: "-0.5px",
        }}
      >
        AT
      </div>
    ),
    { ...size }
  );
}
