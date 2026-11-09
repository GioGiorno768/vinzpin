import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ThemeConfig } from '../types';
import { playTickSound } from '../utils/audio';

interface SpinWheelProps {
  names: string[];
  theme: ThemeConfig;
  durationSeconds: number;
  soundEnabled: boolean;
  onSpinStart?: () => void;
  onWinnerSelected: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const VIRTUAL_SIZE = 460;

export const SpinWheel: React.FC<SpinWheelProps> = ({
  names,
  theme,
  durationSeconds,
  soundEnabled,
  onSpinStart,
  onWinnerSelected,
  isSpinning,
  setIsSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastSliceIndexRef = useRef<number>(-1);
  const [pointerTick, setPointerTick] = useState(false);

  // Draw wheel cleanly with fixed logical coordinates
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Ensure physical canvas pixel dimensions match virtual size * dpr
    const targetPixelWidth = Math.round(VIRTUAL_SIZE * dpr);
    if (canvas.width !== targetPixelWidth || canvas.height !== targetPixelWidth) {
      canvas.width = targetPixelWidth;
      canvas.height = targetPixelWidth;
    }

    ctx.save();
    // Reset any transform and scale to high-DPI coordinates
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const centerX = VIRTUAL_SIZE / 2; // 230
    const centerY = VIRTUAL_SIZE / 2; // 230
    const radius = VIRTUAL_SIZE / 2 - 14; // 216

    ctx.clearRect(0, 0, VIRTUAL_SIZE, VIRTUAL_SIZE);

    // If no names, draw empty state
    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = theme.key === 'candy' ? '#fdf2f8' : '#1e293b';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.canvasBorder;
      ctx.stroke();

      ctx.fillStyle = theme.key === 'candy' ? '#9d174d' : '#94a3b8';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Buka Pengaturan & Isi Nama!', centerX, centerY);
      ctx.restore();
      return;
    }

    const arc = (Math.PI * 2) / names.length;
    const currentAngle = currentAngleRef.current;
    const sliceColors = theme.sliceColors;

    // Draw Slices
    for (let i = 0; i < names.length; i++) {
      const sliceStart = currentAngle + i * arc;
      const sliceEnd = sliceStart + arc;

      // Slice background
      ctx.beginPath();
      ctx.fillStyle = sliceColors[i % sliceColors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sliceStart, sliceEnd);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Divider line between slices
      ctx.lineWidth = names.length > 20 ? 1.5 : 2.5;
      ctx.strokeStyle = theme.canvasBorder;
      ctx.stroke();

      // Text inside slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(sliceStart + arc / 2);

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme.key === 'candy' ? '#0f172a' : '#ffffff';

      // Dynamic font sizing according to participant count
      const fontSize =
        names.length > 24 ? 10 : names.length > 16 ? 12 : names.length > 8 ? 14 : 16;
      ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;

      ctx.shadowColor =
        theme.key === 'candy' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;

      let displayText = names[i];
      const maxChars = names.length > 20 ? 11 : 16;
      if (displayText.length > maxChars) {
        displayText = displayText.substring(0, maxChars - 2) + '..';
      }

      ctx.fillText(displayText, radius - 22, 0);
      ctx.restore();
    }

    // Outer wheel border ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 7;
    ctx.strokeStyle = theme.canvasBorder;
    ctx.stroke();

    // Metallic rim pins / studs on edge
    for (let i = 0; i < names.length; i++) {
      const pinAngle = currentAngle + i * arc;
      const pinX = centerX + (radius - 1) * Math.cos(pinAngle);
      const pinY = centerY + (radius - 1) * Math.sin(pinAngle);

      ctx.beginPath();
      ctx.arc(pinX, pinY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();
    }

    // Center Hub - Outer metallic ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
    ctx.fillStyle = theme.key === 'candy' ? '#ffffff' : '#0f172a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = theme.centerPinStroke;
    ctx.stroke();

    // Center Hub - Inner jewel pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = theme.centerPinStroke;
    ctx.fill();

    // Center jewel highlight dot
    ctx.beginPath();
    ctx.arc(centerX - 3, centerY - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();

    ctx.restore();
  }, [names, theme]);

  // Initial draw and redraw on prop changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Spin Execution
  const spin = useCallback(() => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    if (onSpinStart) onSpinStart();

    const startAngle = currentAngleRef.current % (Math.PI * 2);
    const baseSpins = Math.max(4, Math.floor(durationSeconds * 1.5));
    const randomExtraTurns = (baseSpins + Math.random() * 2) * (Math.PI * 2);
    const totalRotation = randomExtraTurns + Math.random() * Math.PI * 2;
    const durationMs = durationSeconds * 1000;

    let startTime: number | null = null;
    let lastTickTime = 0;

    // Quintic deceleration easing for smooth stop
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutQuint(progress);

      const newAngle = startAngle + totalRotation * easedProgress;
      currentAngleRef.current = newAngle;
      drawWheel();

      // Detect slice crossing pointer at top (3*PI/2)
      const arc = (Math.PI * 2) / names.length;
      const normalizedAngle = ((newAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
      const pointerAngle = (3 * Math.PI) / 2; // Top position
      let relativeAngle = (pointerAngle - normalizedAngle) % (Math.PI * 2);
      if (relativeAngle < 0) relativeAngle += Math.PI * 2;
      const currentSliceIdx = Math.floor(relativeAngle / arc);

      if (currentSliceIdx !== lastSliceIndexRef.current) {
        lastSliceIndexRef.current = currentSliceIdx;
        const currentSpeed = 1 - progress;

        // Throttle rapid clicks during high-speed phase
        if (timestamp - lastTickTime > 35) {
          playTickSound(soundEnabled, currentSpeed);
          setPointerTick(true);
          setTimeout(() => setPointerTick(false), 45);
          lastTickTime = timestamp;
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const winningWinner = names[currentSliceIdx] || names[0];
        onWinnerSelected(winningWinner);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    isSpinning,
    names,
    durationSeconds,
    drawWheel,
    onSpinStart,
    setIsSpinning,
    onWinnerSelected,
    soundEnabled,
  ]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Wheel Wrapper */}
      <div
        className="relative wheel-glow flex items-center justify-center"
        style={{ '--glow-color': theme.glowColor } as React.CSSProperties}
      >
        {/* Pointer indicator mathematically centered at top */}
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] transition-transform duration-75 origin-top ${
            pointerTick ? 'scale-110 -rotate-6' : 'scale-100 rotate-0'
          }`}
        >
          <svg
            className="w-11 h-11 sm:w-12 sm:h-12"
            viewBox="0 0 24 24"
            fill={theme.pointerColor}
            stroke={theme.pointerStroke}
            strokeWidth="2.5"
          >
            <path d="M12 21L3 6h18l-9 15z" />
          </svg>
        </div>

        {/* Canvas Element with crisp responsive sizing */}
        <canvas
          ref={canvasRef}
          className="w-[270px] h-[270px] xs:w-[310px] xs:h-[310px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] rounded-full border-[6px] border-slate-900 shadow-2xl bg-slate-900/90 transition-all select-none block"
        />
      </div>

      {/* Action Area: Putar Button & Timer badge */}
      <div className="flex flex-col items-center mt-5 w-full max-w-xs">
        <button
          onClick={spin}
          disabled={isSpinning || names.length === 0}
          style={{ background: theme.spinBtnGradient }}
          className={`w-full py-3.5 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl transition-all duration-300 tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
            isSpinning || names.length === 0
              ? 'opacity-60 cursor-not-allowed scale-98 shadow-none'
              : 'hover:scale-105 active:scale-95 hover:shadow-2xl'
          }`}
        >
          <span>{isSpinning ? 'MEMUTAR...' : 'PUTAR!'}</span>
          <span className="text-xl">{isSpinning ? '🌀' : '🎯'}</span>
        </button>

        {/* Timer duration badge */}
        <div
          className={`mt-2.5 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur flex items-center gap-1.5 ${theme.badgeStyle}`}
        >
          <span>⏱️ Durasi:</span>
          <span className="font-bold">{durationSeconds} detik</span>
        </div>
      </div>
    </div>
  );
};
