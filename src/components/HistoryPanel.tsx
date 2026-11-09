import React, { useState } from 'react';
import { ThemeConfig, WinnerRecord } from '../types';
import { Trash2, Copy, Download, Award, Clock, Check } from 'lucide-react';

interface HistoryPanelProps {
  history: WinnerRecord[];
  theme: ThemeConfig;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  theme,
  onClearHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleCopyHistory = () => {
    if (history.length === 0) return;
    const text = history
      .map(
        (h) =>
          `Putaran #${h.round}: ${h.name} (${h.time}${h.date ? `, ${h.date}` : ''})`
      )
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Round,Winner,Time,Date']
        .concat(
          history.map(
            (h) => `"${h.round}","${h.name.replace(/"/g, '""')}","${h.time}","${h.date}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riwayat-spin-wheel-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full max-w-[340px] sm:max-w-[360px] h-[360px] sm:h-[390px] md:h-[420px] p-4 sm:p-5 rounded-3xl border flex flex-col justify-between backdrop-blur-md transition-all duration-300 ${theme.cardClass}`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3.5 border-b ${theme.panelHeaderClass}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="font-bold text-sm tracking-wide">Riwayat Spin</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                theme.key === 'candy'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-white/10 text-white'
              }`}
            >
              {history.length}
            </span>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleCopyHistory}
                  title="Salin semua riwayat"
                  className="p-1.5 rounded-lg text-xs opacity-70 hover:opacity-100 hover:bg-white/10 transition cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleExportCSV}
                  title="Ekspor CSV"
                  className="p-1.5 rounded-lg text-xs opacity-70 hover:opacity-100 hover:bg-white/10 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}

            {history.length > 0 && (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Hapus riwayat pemenang"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Banner if Clicked Reset */}
        {showConfirmReset && (
          <div className="my-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex flex-col gap-2 animate-slide-in">
            <p className="font-semibold text-center">Reset seluruh riwayat brok?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* List of winners */}
        <div className="custom-scroll mt-3 flex-1 overflow-y-auto min-h-0 flex flex-col gap-2 pr-1">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10">
              <span className="text-4xl mb-2">🎯</span>
              <p className="text-sm font-semibold">Belum ada riwayat brok.</p>
              <p className="text-xs opacity-75 mt-0.5">
                Putar roda untuk mencatat pemenang!
              </p>
            </div>
          ) : (
            history.map((item, index) => {
              const isLatest = index === 0;
              return (
                <div
                  key={item.id}
                  className={`animate-slide-in flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-200 ${
                    theme.historyItemClass
                  } ${
                    isLatest
                      ? 'ring-2 ring-offset-1 ' +
                        (theme.key === 'candy'
                          ? 'ring-rose-400'
                          : theme.key === 'casino'
                          ? 'ring-amber-500'
                          : theme.key === 'synthwave'
                          ? 'ring-pink-500'
                          : 'ring-violet-500')
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="font-mono font-bold opacity-60 text-[11px] flex-shrink-0">
                      #{item.round}
                    </span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isLatest && (
                        <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-bounce" />
                      )}
                      <span className="font-bold truncate max-w-[150px] text-[13px]">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] opacity-60 font-mono flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] opacity-60">
        <span>Pemenang terbaru di atas</span>
        <span>Total: {history.length} kali putar</span>
      </div>
    </div>
  );
};
