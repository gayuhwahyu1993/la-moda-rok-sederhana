import React from 'react';
import { Printer, RotateCcw, Eye, Settings2 } from 'lucide-react';
import { SizePreset } from '../types/pattern';
import { useLanguage } from '../i18n';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  presets: SizePreset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
  onPrint: () => void;
  onPreview: () => void;
  onOpenAdmin?: () => void;
  activeView: 'two-column' | 'stacked';
  onToggleView: (view: 'two-column' | 'stacked') => void;
  activeCalculatorId?: string;
  onSelectCalculator?: (calculatorId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onReset,
  onPrint,
  onPreview,
  onOpenAdmin,
  activeCalculatorId = 'rok',
  onSelectCalculator,
}) => {
  const { t } = useLanguage();
  const isRokSederhana = activeCalculatorId === 'rok' || activeCalculatorId === 'rok-sederhana';

  return (
    <header className="bg-[#FCFAF7]/95 backdrop-blur-sm border-b border-[#E8DED8] sticky top-0 z-30 shadow-2xs">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRokSederhana ? 'py-2 sm:py-2.5' : 'py-3 sm:py-3.5'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & System Switcher */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Proportional La Moda Brand Logo */}
            <div className="shrink-0 flex items-center">
              <img
                src="/la-moda-logo.svg"
                alt="La MODA"
                className="h-9 sm:h-10 md:h-10.5 w-auto max-w-[190px] sm:max-w-[225px] object-contain select-none"
              />
            </div>

            {/* Garment Drafting System Switcher */}
            {onSelectCalculator && (
              <div className="flex items-center gap-1.5 bg-[#E8DED8] p-0.5 sm:p-1 rounded-xl border border-[#DFD4CD] text-xs flex-wrap">
                <div className="flex items-center gap-0.5 bg-[#DFCFC7]/60 rounded-lg p-0.5">
                  <span className="text-[10px] font-bold text-[#6B5E57] uppercase px-1.5 select-none">Rok:</span>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('rok')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'rok' || activeCalculatorId === 'rok-sederhana'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Rok — Sistem Sederhana"
                  >
                    Sederhana
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('rok-dressmaking')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'rok-dressmaking'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Rok — Sistem Dressmaking"
                  >
                    Dressmaking
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('rok-indonesia')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'rok-indonesia'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Rok — Sistem Indonesia"
                  >
                    Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('rok-lingkaran')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'rok-lingkaran'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Rok Lingkaran & Setengah Lingkaran"
                  >
                    Lingkaran
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('pola-rok-kerut-bertingkat')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'pola-rok-kerut-bertingkat' || activeCalculatorId === 'rok-kerut-bertingkat' || activeCalculatorId === 'rok-kerut' || activeCalculatorId === 'tiered-skirt'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Rok Kerut Bertingkat — Tiered Gathered Skirt Pattern"
                  >
                    Kerut Bertingkat
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('rok-pias-godet')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'rok-pias-godet' || activeCalculatorId === 'pias-godet' || activeCalculatorId === 'rok-pias'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Rok Pias & Godet — Gored Skirt & Godet Pattern"
                  >
                    Pias & Godet
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('rok-lipit-searah')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'rok-lipit-searah' || activeCalculatorId === 'rok-lipit' || activeCalculatorId === 'lipit-searah' || activeCalculatorId === 'lipit'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Rok Lipit Searah — One-Way Pleated Skirt Pattern"
                  >
                    Lipit Searah
                  </button>
                </div>

                <div className="flex items-center gap-0.5 bg-[#DFCFC7]/60 rounded-lg p-0.5">
                  <span className="text-[10px] font-bold text-[#6B5E57] uppercase px-1.5 select-none">Badan:</span>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('badan-sederhana')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'badan-sederhana' || activeCalculatorId === 'badan' || activeCalculatorId === 'basic-bodice-sederhana'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Badan Wanita — Sistem Sederhana"
                  >
                    Sederhana
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('badan-dressmaking')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'badan-dressmaking' || activeCalculatorId === 'basic-bodice-dressmaking'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Badan Wanita — Sistem Dressmaking"
                  >
                    Dressmaking
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('badan-indonesia')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'badan-indonesia' || activeCalculatorId === 'basic-bodice-indonesia'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Badan Wanita — Sistem Indonesia"
                  >
                    Indonesia
                  </button>
                </div>

                <div className="flex items-center gap-0.5 bg-[#DFCFC7]/60 rounded-lg p-0.5">
                  <span className="text-[10px] font-bold text-[#6B5E57] uppercase px-1.5 select-none">Lengan:</span>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('pola-lengan')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'pola-lengan' || activeCalculatorId === 'lengan' || activeCalculatorId === 'basic-sleeve'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Lengan — Basic Sleeve Pattern Calculator"
                  >
                    Pola Lengan
                  </button>
                </div>

                <div className="flex items-center gap-0.5 bg-[#DFCFC7]/60 rounded-lg p-0.5">
                  <span className="text-[10px] font-bold text-[#6B5E57] uppercase px-1.5 select-none">Celana:</span>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('pola-celana-piyama')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'pola-celana-piyama' || activeCalculatorId === 'celana-piyama' || activeCalculatorId === 'celana' || activeCalculatorId === 'pajama-pants'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Dasar Celana Piyama — Basic Pajama Pants Pattern Calculator"
                  >
                    Piyama
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCalculator('pola-kulot')}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-md transition-all cursor-pointer ${
                      activeCalculatorId === 'pola-kulot' || activeCalculatorId === 'kulot' || activeCalculatorId === 'culottes' || activeCalculatorId === 'culotte-pants'
                        ? 'bg-[#FCFAF7] text-[#8F2635] shadow-xs border border-[#DFD4CD] font-bold'
                        : 'text-[#6B5E57] hover:text-[#332C29]'
                    }`}
                    title="Pola Kulot — Culottes Pattern Calculator"
                  >
                    Kulot
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls: Single Top Language Selector + Preset Selector + Actions */}
          <div className={`flex items-center ${isRokSederhana ? 'gap-1.5 sm:gap-2 md:gap-2.5' : 'gap-2.5 sm:gap-3'} flex-wrap justify-between lg:justify-end`}>
            
            {/* Top Bar Main Language Selector */}
            <LanguageSelector isCompact={isRokSederhana} />

            {/* Sizing Presets */}
            <div className={`flex items-center bg-[#E8DED8] ${isRokSederhana ? 'p-0.5 rounded-lg' : 'p-1 rounded-xl'} border border-[#DFD4CD]`}>
              <span className={`text-[10px] md:text-[11px] font-semibold text-[#6B5E57] ${isRokSederhana ? 'px-1.5' : 'px-2'} uppercase tracking-wider hidden sm:inline select-none`}>
                {t.presetLabel}
              </span>
              {presets.map((preset, idx) => {
                const presetTrans = t.presets[preset.id as keyof typeof t.presets];
                const desc = presetTrans?.description || preset.description;
                const customPad = isRokSederhana
                  ? (idx === 0 ? 'pl-1.5 pr-2' : idx === 3 ? 'pl-1 pr-2' : 'px-2')
                  : (idx === 0 ? 'pl-2 pr-2.5' : idx === 3 ? 'pl-[7px] pr-2.5' : 'px-2.5');
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset.id)}
                    className={`${customPad} ${isRokSederhana ? 'py-0.5 md:py-1 text-[11px] md:text-xs' : 'py-1 text-xs'} font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      selectedPresetId === preset.id
                        ? 'bg-[#FCFAF7] text-[#332C29] shadow-xs border border-[#DFD4CD]'
                        : 'text-[#6B5E57] hover:text-[#332C29] hover:bg-[#F3E7E7]'
                    }`}
                    title={desc}
                  >
                    {preset.badge}
                  </button>
                );
              })}
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onReset}
              className={`flex items-center gap-1 sm:gap-1.5 ${isRokSederhana ? 'px-2 sm:px-2.5 py-0.5 md:py-1 text-[11px] md:text-xs' : 'px-3 py-1.5 text-xs'} rounded-lg border border-[#DFD4CD] bg-[#FCFAF7] hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] font-semibold transition-colors shadow-2xs cursor-pointer whitespace-nowrap`}
              title={t.resetTitle}
            >
              <RotateCcw size={isRokSederhana ? 12 : 13} className="shrink-0" />
              <span className="hidden sm:inline">{t.resetBtn}</span>
            </button>

            {/* Worksheet Buttons: Preview & Print */}
            <div className={`flex items-center ${isRokSederhana ? 'gap-1 sm:gap-1.5' : 'gap-1.5 sm:gap-2'} shrink-0`}>
              {/* Preview Worksheet Button */}
              <button
                type="button"
                onClick={onPreview}
                id="btn-preview-worksheet-header"
                className={`flex items-center justify-center gap-1 sm:gap-1.5 ${isRokSederhana ? 'px-2 sm:px-2.5 md:px-3 py-0.5 md:py-1 text-[11px] md:text-xs' : 'px-3.5 py-1.5 text-xs'} rounded-lg border border-[#A85C68] bg-[#FCFAF7] hover:bg-[#E8DED8] active:bg-[#DFD4CD] text-[#8F2635] font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap`}
                title={t.previewHeaderTitle}
              >
                <Eye size={isRokSederhana ? 12 : 14} className="text-[#8F2635] shrink-0" />
                <span>{t.previewWorksheet}</span>
              </button>

              {/* Print / Export Button */}
              <button
                type="button"
                onClick={onPrint}
                id="btn-cetak-worksheet-header"
                className={`flex items-center gap-1 sm:gap-1.5 ${isRokSederhana ? 'px-2 sm:px-2.5 md:px-3 py-0.5 md:py-1 text-[11px] md:text-xs' : 'px-3.5 py-1.5 text-xs'} rounded-lg bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-[#FCFAF7] font-semibold transition-all shadow-xs cursor-pointer whitespace-nowrap`}
                title={t.printHeaderTitle}
              >
                <Printer size={isRokSederhana ? 12 : 14} className="text-[#C9B49F] shrink-0" />
                <span>{t.printWorksheet}</span>
              </button>
            </div>

            {/* Admin Image Manager Access Button */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                id="btn-admin-image-manager"
                className={`flex items-center gap-1 sm:gap-1.5 ${isRokSederhana ? 'px-2 sm:px-2.5 py-0.5 md:py-1 text-[11px] md:text-xs' : 'px-2.5 sm:px-3 py-1.5 text-xs'} rounded-lg border border-[#DFD4CD] bg-[#332C29] hover:bg-[#4A423B] text-[#FCFAF7] font-semibold transition-all shadow-xs cursor-pointer whitespace-nowrap`}
                title="Buka Admin Image Manager (Penggantian Gambar Panduan)"
              >
                <Settings2 size={isRokSederhana ? 12 : 13} className="text-[#DFD4CD] shrink-0" />
                <span className="hidden md:inline">Admin Image Manager</span>
                <span className="md:hidden">Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

