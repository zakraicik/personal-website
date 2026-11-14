import { ImageResponse } from "next/og";

export const alt = "Zak Raicik | Machine Learning Leader & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "65px 80px", background: "#141418", color: "#f4f3f8", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 24, color: "#aaa9b7" }}>ZAK RAICIK / MACHINE LEARNING / ENGINEERING / LEADERSHIP</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 94, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-5px" }}>
        <span>Always curious.</span><span style={{ color: "#d4fa47" }}>Always building.</span>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#b7a8ff" }}>Deep ML experience. Hands-on engineering. Relentless curiosity.</div>
    </div>, size
  );
}
