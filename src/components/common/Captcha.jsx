import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

const DIGITS = "0123456789";

export function generateCaptchaCode(length = 4) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return code;
}

export default function Captcha({ code, onRefresh }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "rgba(212, 175, 55, 0.1)");
    bg.addColorStop(1, "rgba(212, 175, 55, 0.03)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    const colors = ["#f5d76e", "#d4af37", "#ffffff"];
    const charWidth = width / code.length;
    for (let i = 0; i < code.length; i++) {
      const x = charWidth * i + charWidth / 2;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = ((Math.random() * 24 - 12) * Math.PI) / 180;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `700 ${20 + Math.floor(Math.random() * 3)}px "Space Grotesk", monospace`;
      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
      ctx.shadowBlur = 6;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  }, [code]);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <canvas
        ref={canvasRef}
        width={130}
        height={42}
        style={{
          width: 130,
          height: 42,
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(212, 175, 55, 0.25)",
          background: "rgba(212, 175, 55, 0.04)",
        }}
      />
      <button type="button" className="icon-btn" onClick={onRefresh} aria-label="Refresh captcha" style={{ flexShrink: 0 }}>
        <RefreshCw size={16} />
      </button>
    </div>
  );
}
