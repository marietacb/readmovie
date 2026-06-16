import { ImageResponse } from "next/og";

export function renderPwaIcon(size: number) {
  const fontSize = Math.round(size * 0.42);
  const radius = Math.round(size * 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1a2f4b 0%, #2d4a6e 100%)",
          borderRadius: radius,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            color: "#f7f5f2",
            letterSpacing: "-0.04em",
          }}
        >
          D
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
