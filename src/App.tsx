/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeKey, WinnerRecord } from './types';
import { THEMES } from './data/themes';
import { SpinWheel } from './components/SpinWheel';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsModal } from './components/SettingsModal';
import { WinnerModal } from './components/WinnerModal';
import { Settings, Volume2, VolumeX, Sparkles } from 'lucide-react';

const DEFAULT_NAMES = [
  'Brok Budi',
  'Siti Rahma',
  'Ahmad Fikri',
  'Dewi Sartika',
  'Reza Pratama',
  'Maya Kusuma',
  'Doni Saputra',
  'Eka Putri',
];

const STORAGE_KEYS = {
  NAMES: 'spinwheel_names_v1',
  HISTORY: 'spinwheel_history_v1',
  THEME: 'spinwheel_theme_v1',
  DURATION: 'spinwheel_duration_v1',
  SOUND: 'spinwheel_sound_v1',
  AUTO_REMOVE: 'spinwheel_auto_remove_v1',
};

export default function App() {
  // 1. Participant Names
  const [names, setNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_NAMES;
  });

  // 2. Winner History
  const [history, setHistory] = useState<WinnerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // 3. Theme
  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeKey;
      if (saved && THEMES[saved]) return saved;
    } catch {
      // fallback
    }
    return 'cyber';
  });

  // 4. Spin duration (seconds)
  const [durationSeconds, setDurationSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DURATION);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 2 && parsed <= 20) return parsed;
      }
    } catch {
      // fallback
    }
    return 5;
  });

  // 5. Sound Enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return true;
  });

  // 6. Auto-remove winner from pool
  const [autoRemoveWinner, setAutoRemoveWinner] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_REMOVE);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return false;
  });

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [winnerModalData, setWinnerModalData] = useState<{
    winner: string;
    round: number;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const currentTheme = THEMES[themeKey] || THEMES.cyber;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NAMES, JSON.stringify(names));
    } catch {}
  }, [names]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, themeKey);
    } catch {}
  }, [themeKey]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DURATION, durationSeconds.toString());
    } catch {}
  }, [durationSeconds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, soundEnabled.toString());
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_REMOVE, autoRemoveWinner.toString());
    } catch {}
  }, [autoRemoveWinner]);

  // Handle winner selected
  const handleWinnerSelected = useCallback(
    (winnerName: string) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const dateStr = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });

      const nextRound = history.length + 1;
      const newRecord: WinnerRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: winnerName,
        round: nextRound,
        time: timeStr,
        date: dateStr,
        themeKey: themeKey,
      };

      setHistory((prev) => [newRecord, ...prev]);
      setWinnerModalData({
        winner: winnerName,
        round: nextRound,
      });

      // If auto-remove is toggled on, remove winner from pool
      if (autoRemoveWinner) {
        setNames((prev) => {
          const index = prev.indexOf(winnerName);
          if (index !== -1) {
            const next = [...prev];
            next.splice(index, 1);
            return next;
          }
          return prev;
        });
      }
    },
    [autoRemoveWinner, history.length, themeKey]
  );

  // Manual remove winner from modal
  const handleRemoveWinnerAndClose = (winnerToRemove: string) => {
    setNames((prev) => {
      const index = prev.indexOf(winnerToRemove);
      if (index !== -1) {
        const next = [...prev];
        next.splice(index, 1);
        return next;
      }
      return prev;
    });
    setWinnerModalData(null);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Keyboard shortcut: Spacebar to spin if modals are closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSettingsOpen && !winnerModalData && !isSpinning) {
        // Prevent page scroll when spacebar is pressed
        const activeEl = document.activeElement;
        const isInput =
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement;
        if (!isInput && names.length > 0) {
          e.preventDefault();
          // Trigger spin button click
          const spinBtn = document.querySelector('button[disabled="false"]');
          if (spinBtn) {
            (spinBtn as HTMLButtonElement).click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, winnerModalData, isSpinning, names.length]);

  return (
    <div
      className={`${currentTheme.bodyClass} min-h-screen flex flex-col justify-between items-center px-3 py-2 sm:px-6 sm:py-4 relative overflow-x-hidden transition-colors duration-400`}
    >
      {/* Background radial highlight */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${currentTheme.glowColor}, transparent 65%)`,
        }}
      />

      {/* TOP HEADER */}
      <header className="w-full max-w-6xl flex items-center justify-between py-1.5 sm:py-2.5 z-10">
        <div className="flex items-center gap-2.5">
          <h1
            className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent flex items-center gap-2"
          >
            <span>VINZPIN</span>
            <Sparkles className="w-4 h-4 text-amber-400 inline" />
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mute/Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl border border-white/10 bg-black/20 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Suara: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 opacity-50" />
                <span className="hidden sm:inline opacity-70">Mute</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-black/30 hover:bg-white/10 border border-white/15 rounded-2xl shadow-lg transition active:scale-95 group backdrop-blur cursor-pointer"
          >
            <Settings className="w-4 h-4 text-violet-400 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Pengaturan &amp; Tema
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA: WHEEL + HISTORY PANEL SIDE-BY-SIDE */}
      <main className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 my-auto py-2 sm:py-4 z-10">
        {/* WHEEL SECTION */}
        <div className="flex flex-col items-center justify-center">
          <SpinWheel
            names={names}
            theme={currentTheme}
            durationSeconds={durationSeconds}
            soundEnabled={soundEnabled}
            onWinnerSelected={handleWinnerSelected}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </div>

        {/* HISTORY PANEL (RIGHT BESIDE THE WHEEL) */}
        <div className="flex justify-center w-full lg:w-auto">
          <HistoryPanel
            history={history}
            theme={currentTheme}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-2 text-center text-xs opacity-60 z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <span>Tekan tombol atau spasi untuk memutar</span>
        <span>•</span>
        <span>{names.length} peserta aktif</span>
        <span>•</span>
        <span>Tema: {currentTheme.badgeLabel}</span>
      </footer>

      {/* SETTINGS & THEMES MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(newKey) => setThemeKey(newKey)}
        durationSeconds={durationSeconds}
        onChangeDuration={(sec) => setDurationSeconds(sec)}
        names={names}
        onSaveNames={(newNames) => setNames(newNames)}
        autoRemoveWinner={autoRemoveWinner}
        onToggleAutoRemoveWinner={(val) => setAutoRemoveWinner(val)}
        soundEnabled={soundEnabled}
        onToggleSound={(val) => setSoundEnabled(val)}
        defaultNames={DEFAULT_NAMES}
      />

      {/* WINNER REVEAL MODAL */}
      <WinnerModal
        winner={winnerModalData?.winner || null}
        round={winnerModalData?.round || 0}
        theme={currentTheme}
        soundEnabled={soundEnabled}
        onClose={() => setWinnerModalData(null)}
        onRemoveWinnerAndClose={handleRemoveWinnerAndClose}
      />
    </div>
  );
}
