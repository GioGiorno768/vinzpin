import React, { useState } from 'react';
import { ThemeConfig, ThemeKey } from '../types';
import { THEMES } from '../data/themes';
import { X, Shuffle, RotateCcw, Trash2, Volume2, VolumeX, UserMinus } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onSelectTheme: (key: ThemeKey) => void;
  durationSeconds: number;
  onChangeDuration: (sec: number) => void;
  names: string[];
  onSaveNames: (newNames: string[]) => void;
  autoRemoveWinner: boolean;
  onToggleAutoRemoveWinner: (val: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: (val: boolean) => void;
  defaultNames: string[];
}

const PRESETS = [
  {
    name: '🎁 Doorprize',
    list: ['Laptop ROG', 'Smart TV 50"', 'Sepeda Lipat', 'Air Fryer', 'Logam Mulia 1g', 'Saldo Gopay 500rb', 'Earbuds TWS', 'Zonk Coba Lagi!'],
  },
  {
    name: '👥 Tim Kantor',
    list: ['Budi Santoso', 'Siti Rahma', 'Ahmad Fikri', 'Dewi Sartika', 'Reza Pratama', 'Maya Kusuma', 'Doni Saputra', 'Eka Putri'],
  },
  {
    name: '🔢 Angka 1-12',
    list: Array.from({ length: 12 }, (_, i) => `Nomor ${i + 1}`),
  },
  {
    name: '🍕 Menu Makan',
    list: ['Nasi Padang', 'Ayam Geprek', 'Mie Ayam Bakso', 'Sate Ayam', 'Burger & Fries', 'Ramen', 'Nasi Goreng', 'Gado-gado'],
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  durationSeconds,
  onChangeDuration,
  names,
  onSaveNames,
  autoRemoveWinner,
  onToggleAutoRemoveWinner,
  soundEnabled,
  onToggleSound,
  defaultNames,
}) => {
  const [textValue, setTextValue] = useState(names.join('\n'));

  // Sync internal state when opening modal
  React.useEffect(() => {
    if (isOpen) {
      setTextValue(names.join('\n'));
    }
  }, [isOpen, names]);

  if (!isOpen) return null;

  const currentNamesCount = textValue
    .split('\n')
    .map((n) => n.trim())
    .filter((n) => n.length > 0).length;

  const handleShuffle = () => {
    const list = textValue
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setTextValue(shuffled.join('\n'));
  };

  const handleResetDefault = () => {
    setTextValue(defaultNames.join('\n'));
  };

  const handleClear = () => {
    setTextValue('');
  };

  const handleApplyPreset = (presetList: string[]) => {
    setTextValue(presetList.join('\n'));
  };

  const handleSaveAndClose = () => {
    const parsed = textValue
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    onSaveNames(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-slide-in">
      <div
        className={`w-full max-w-lg p-6 rounded-3xl border flex flex-col gap-4 max-h-[92vh] overflow-y-auto custom-scroll transition-colors ${currentTheme.modalBoxClass}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3 border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-base font-bold">Pengaturan & Tema</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl opacity-60 hover:opacity-100 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Theme Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2 block">
            🎨 Tema Tampilan
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
              const th = THEMES[key];
              const isSelected = key === currentTheme.key;
              return (
                <button
                  key={key}
                  onClick={() => onSelectTheme(key)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-violet-500 bg-violet-500/20 shadow-md ring-2 ring-violet-500/50'
                      : 'border-white/10 bg-black/20 opacity-80 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <span className="truncate">{th.name}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span
                      className="w-3 h-3 rounded-full border border-black/30"
                      style={{ background: th.sliceColors[0] }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/30"
                      style={{ background: th.sliceColors[1] }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Timer Duration Slider */}
        <div className="p-3.5 rounded-2xl border border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="timer-slider"
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <span>⏱️ Durasi Putaran</span>
            </label>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${currentTheme.badgeStyle}`}
            >
              {durationSeconds} detik
            </span>
          </div>
          <input
            id="timer-slider"
            type="range"
            min="2"
            max="20"
            step="1"
            value={durationSeconds}
            onChange={(e) => onChangeDuration(parseInt(e.target.value, 10))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-violet-500 bg-white/20"
          />
          <div className="flex justify-between text-[10px] opacity-50 mt-1 font-mono">
            <span>Cepat (2s)</span>
            <span>Standar (5s)</span>
            <span>Tegang (20s)</span>
          </div>
        </div>

        {/* 3. Toggles: Auto-remove winner & Audio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Auto remove */}
          <button
            type="button"
            onClick={() => onToggleAutoRemoveWinner(!autoRemoveWinner)}
            className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition cursor-pointer text-left ${
              autoRemoveWinner
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                : 'border-white/10 bg-black/20 opacity-80'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserMinus className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="font-bold text-[11px]">Hapus Pemenang</p>
                <p className="text-[10px] opacity-70">
                  {autoRemoveWinner ? 'Aktif (Tak dobel)' : 'Nonaktif'}
                </p>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                autoRemoveWinner
                  ? 'border-emerald-400 bg-emerald-400'
                  : 'border-white/30'
              }`}
            >
              {autoRemoveWinner && (
                <span className="text-[9px] text-black font-black">✓</span>
              )}
            </div>
          </button>

          {/* Sound */}
          <button
            type="button"
            onClick={() => onToggleSound(!soundEnabled)}
            className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition cursor-pointer text-left ${
              soundEnabled
                ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                : 'border-white/10 bg-black/20 opacity-80'
            }`}
          >
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 flex-shrink-0 opacity-50" />
              )}
              <div>
                <p className="font-bold text-[11px]">Efek Audio</p>
                <p className="text-[10px] opacity-70">
                  {soundEnabled ? 'Tick & Fanfare' : 'Senyap'}
                </p>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                soundEnabled
                  ? 'border-violet-400 bg-violet-400'
                  : 'border-white/30'
              }`}
            >
              {soundEnabled && (
                <span className="text-[9px] text-black font-black">✓</span>
              )}
            </div>
          </button>
        </div>

        {/* 4. Participant Names Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="names-input"
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Daftar Peserta</span>
              <span className={`font-mono font-bold ${currentTheme.accentText}`}>
                ({currentNamesCount} nama)
              </span>
            </label>
            <button
              onClick={handleShuffle}
              className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl border border-white/10 transition flex items-center gap-1 cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              <span>Acak</span>
            </button>
          </div>

          <textarea
            id="names-input"
            rows={5}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Ketik tiap nama di baris baru..."
            className="custom-scroll w-full bg-black/40 border border-white/15 rounded-2xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 font-mono transition resize-none placeholder:opacity-40"
          />

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] opacity-60 font-medium mr-1">Preset:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleApplyPreset(p.list)}
                className="text-[10px] bg-white/5 hover:bg-white/15 px-2 py-0.5 rounded-lg border border-white/10 transition cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Utility action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleResetDefault}
            className="w-1/2 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            onClick={handleClear}
            className="w-1/2 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold rounded-xl border border-rose-900/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveAndClose}
          style={{ background: currentTheme.spinBtnGradient }}
          className="w-full py-3 text-white font-bold text-sm rounded-2xl transition shadow-lg hover:brightness-110 active:scale-98 cursor-pointer mt-1"
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
};
