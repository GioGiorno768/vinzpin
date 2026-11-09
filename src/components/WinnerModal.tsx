import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ThemeConfig } from '../types';
import { playFanfareSound } from '../utils/audio';
import { Trophy, RotateCw, UserMinus } from 'lucide-react';

interface WinnerModalProps {
  winner: string | null;
  round: number;
  theme: ThemeConfig;
  soundEnabled: boolean;
  onClose: () => void;
  onRemoveWinnerAndClose: (winnerName: string) => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  round,
  theme,
  soundEnabled,
  onClose,
  onRemoveWinnerAndClose,
}) => {
  useEffect(() => {
    if (!winner) return;

    // Trigger celebration fanfare
    playFanfareSound(soundEnabled);

    // Launch multi-burst canvas confetti
    const count = 140;
    const defaults = {
      origin: { y: 0.65 },
      colors: theme.confettiColors,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [winner, theme, soundEnabled]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-slide-in">
      <div
        className={`w-full max-w-sm p-8 rounded-3xl text-center shadow-2xl relative border ${theme.modalBoxClass}`}
      >
        {/* Animated Trophy Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="text-6xl animate-bounce drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)]">
              🏆
            </div>
            <span className="absolute -top-1 -right-2 text-2xl animate-pulse">
              ✨
            </span>
          </div>
        </div>

        {/* Round badge */}
        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 bg-white/10 opacity-80">
          Putaran #{round}
        </div>

        <h3 className="text-xs uppercase tracking-widest font-semibold opacity-70">
          Selamat! Pemenang Terpilih:
        </h3>

        {/* Winner Name Display */}
        <div className="text-3xl sm:text-4xl font-black my-4 break-words drop-shadow tracking-tight text-balance">
          {winner}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={onClose}
            style={{ background: theme.spinBtnGradient }}
            className="w-full py-3.5 text-white font-bold text-base rounded-2xl transition shadow-lg hover:brightness-110 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Lanjut Putar Lagi! 🚀</span>
          </button>

          <button
            onClick={() => onRemoveWinnerAndClose(winner)}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-2xl transition flex items-center justify-center gap-1.5 opacity-80 hover:opacity-100 cursor-pointer"
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span>Hapus &quot;{winner.length > 14 ? winner.slice(0, 12) + '...' : winner}&quot; dari Roda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
