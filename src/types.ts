export type ThemeKey = 'cyber' | 'casino' | 'synthwave' | 'candy';

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  badgeLabel: string;
  bodyClass: string;
  cardClass: string;
  panelHeaderClass: string;
  historyItemClass: string;
  modalBoxClass: string;
  glowColor: string;
  pointerColor: string;
  pointerStroke: string;
  canvasBorder: string;
  centerPinStroke: string;
  spinBtnGradient: string;
  badgeStyle: string;
  accentText: string;
  confettiColors: string[];
  sliceColors: string[];
}

export interface WinnerRecord {
  id: string;
  name: string;
  round: number;
  time: string;
  date: string;
  themeKey: ThemeKey;
}
