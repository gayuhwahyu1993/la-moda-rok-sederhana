import React from 'react';
import { 
  Printer, 
  Eye, 
  X, 
  Check, 
  Sliders, 
  User, 
  Phone, 
  Calendar,
  Ruler,
  Image as ImageIcon,
  FileText,
  Calculator,
  ListOrdered
} from 'lucide-react';
import { ClientInfo, WorksheetPrintOptions } from '../types/pattern';
import { useLanguage } from '../i18n';

interface PrintOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientInfo: ClientInfo;
  onChangeClientInfo: (field: keyof ClientInfo, value: string) => void;
  printOptions: WorksheetPrintOptions;
  onChangePrintOptions: (options: WorksheetPrintOptions) => void;
  onConfirmPrint: () => void;
  onOpenPreview: () => void;
}

export const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
  isOpen,
  onClose,
  clientInfo,
  onChangeClientInfo,
  printOptions,
  onChangePrintOptions,
  onConfirmPrint,
  onOpenPreview,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const toggleOption = (key: keyof WorksheetPrintOptions) => {
    onChangePrintOptions({
      ...printOptions,
      [key]: !printOptions[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div 
        id="modal-print-options"
        className="bg-[#FCFAF7] border border-[#E8DED8] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] transition-all"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#E8DED8]/40 border-b border-[#E8DED8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8F2635] text-white flex items-center justify-center font-medium shadow-xs">
              <Sliders size={16} />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29] tracking-wide">
                {t.printOptionsTitle}
              </h2>
              <p className="text-xs text-[#6B5E57]">
                {t.printOptionsSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C7D76] hover:text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Client Information Quick Review */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] flex items-center gap-1.5">
                <User size={13} className="text-[#8F2635]" />
                {t.clientDataTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Nama Klien */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6B5E57] block">
                  {t.clientNameLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientInfo.clientName}
                    onChange={(e) => onChangeClientInfo('clientName', e.target.value)}
                    placeholder={t.clientNamePlaceholder}
                    className="w-full pl-7 pr-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#DFD4CD] bg-white text-[#332C29] focus:border-[#8F2635] focus:ring-1 focus:ring-[#8F2635]/20 outline-none"
                  />
                  <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A85C68] pointer-events-none" />
                </div>
              </div>

              {/* No. HP */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6B5E57] block">
                  {t.phoneNumberLabel}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={clientInfo.phoneNumber}
                    onChange={(e) => onChangeClientInfo('phoneNumber', e.target.value)}
                    placeholder={t.phoneNumberPlaceholder}
                    className="w-full pl-7 pr-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border border-[#DFD4CD] bg-white text-[#332C29] focus:border-[#8F2635] focus:ring-1 focus:ring-[#8F2635]/20 outline-none"
                  />
                  <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A85C68] pointer-events-none" />
                </div>
              </div>

              {/* Tanggal */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6B5E57] block">
                  {t.dateLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientInfo.date}
                    onChange={(e) => onChangeClientInfo('date', e.target.value)}
                    placeholder={t.datePlaceholder}
                    className="w-full pl-7 pr-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#DFD4CD] bg-white text-[#332C29] focus:border-[#8F2635] focus:ring-1 focus:ring-[#8F2635]/20 outline-none"
                  />
                  <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A85C68] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Section Options Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E57]">
                Bagian Lembar Kerja yang Dicetak
              </span>
              <span className="text-[11px] font-mono text-[#8C7D76]">
                Pilih untuk menyertakan
              </span>
            </div>

            <div className="space-y-2.5">
              
              {/* Option 1: Data Pengukuran */}
              <div
                onClick={() => toggleOption('includeMeasurements')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  printOptions.includeMeasurements
                    ? 'bg-white border-[#8F2635] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#DFD4CD] opacity-75 hover:opacity-100 hover:border-[#C9B49F]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      printOptions.includeMeasurements
                        ? 'bg-[#8F2635] border-[#8F2635] text-white'
                        : 'border-[#A89A92] bg-white'
                    }`}
                  >
                    {printOptions.includeMeasurements && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Ruler size={14} className={printOptions.includeMeasurements ? 'text-[#8F2635]' : 'text-[#8C7D76]'} />
                    <span className="font-semibold text-xs sm:text-sm text-[#332C29]">
                      {t.optMeasurements}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E57] mt-0.5 leading-relaxed">
                    {t.optMeasurementsDesc}
                  </p>
                </div>
              </div>

              {/* Option 2: Hasil Ukuran Pola */}
              <div
                onClick={() => toggleOption('includeCalculations')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  printOptions.includeCalculations
                    ? 'bg-white border-[#8F2635] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#DFD4CD] opacity-75 hover:opacity-100 hover:border-[#C9B49F]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      printOptions.includeCalculations
                        ? 'bg-[#8F2635] border-[#8F2635] text-white'
                        : 'border-[#A89A92] bg-white'
                    }`}
                  >
                    {printOptions.includeCalculations && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <ListOrdered size={14} className={printOptions.includeCalculations ? 'text-[#8F2635]' : 'text-[#8C7D76]'} />
                    <span className="font-semibold text-xs sm:text-sm text-[#332C29]">
                      {t.optCalculations}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E57] mt-0.5 leading-relaxed">
                    {t.optCalculationsDesc}
                  </p>
                </div>
              </div>

              {/* Option 3: Gambar Pola */}
              <div
                onClick={() => toggleOption('includePatternImage')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  printOptions.includePatternImage
                    ? 'bg-white border-[#8F2635] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#DFD4CD] opacity-75 hover:opacity-100 hover:border-[#C9B49F]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      printOptions.includePatternImage
                        ? 'bg-[#8F2635] border-[#8F2635] text-white'
                        : 'border-[#A89A92] bg-white'
                    }`}
                  >
                    {printOptions.includePatternImage && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className={printOptions.includePatternImage ? 'text-[#8F2635]' : 'text-[#8C7D76]'} />
                    <span className="font-semibold text-xs sm:text-sm text-[#332C29]">
                      {t.optPatternImage}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E57] mt-0.5 leading-relaxed">
                    {t.optPatternImageDesc}
                  </p>
                </div>
              </div>

              {/* Option 4A: Cara Pembuatan Pola — Pola Depan */}
              <div
                onClick={() => toggleOption('includeFrontPatternDescription')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  printOptions.includeFrontPatternDescription
                    ? 'bg-white border-[#8F2635] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#DFD4CD] opacity-75 hover:opacity-100 hover:border-[#C9B49F]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      printOptions.includeFrontPatternDescription
                        ? 'bg-[#8F2635] border-[#8F2635] text-white'
                        : 'border-[#A89A92] bg-white'
                    }`}
                  >
                    {printOptions.includeFrontPatternDescription && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className={printOptions.includeFrontPatternDescription ? 'text-[#8F2635]' : 'text-[#8C7D76]'} />
                    <span className="font-semibold text-xs sm:text-sm text-[#332C29]">
                      {t.optFrontPatternDescription}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E57] mt-0.5 leading-relaxed">
                    {t.optFrontPatternDescriptionDesc}
                  </p>
                </div>
              </div>

              {/* Option 4B: Cara Pembuatan Pola — Pola Belakang */}
              <div
                onClick={() => toggleOption('includeBackPatternDescription')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  printOptions.includeBackPatternDescription
                    ? 'bg-white border-[#332C29] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#DFD4CD] opacity-75 hover:opacity-100 hover:border-[#C9B49F]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      printOptions.includeBackPatternDescription
                        ? 'bg-[#332C29] border-[#332C29] text-white'
                        : 'border-[#A89A92] bg-white'
                    }`}
                  >
                    {printOptions.includeBackPatternDescription && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className={printOptions.includeBackPatternDescription ? 'text-[#332C29]' : 'text-[#8C7D76]'} />
                    <span className="font-semibold text-xs sm:text-sm text-[#332C29]">
                      {t.optBackPatternDescription}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E57] mt-0.5 leading-relaxed">
                    {t.optBackPatternDescriptionDesc}
                  </p>
                </div>
              </div>

              {/* Option 5: Perhitungan Rumus Lengkap (Default: OFF) */}
              <div
                onClick={() => toggleOption('includeFormulaCalculations')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  printOptions.includeFormulaCalculations
                    ? 'bg-white border-[#8F2635] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#DFD4CD] opacity-75 hover:opacity-100 hover:border-[#C9B49F]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      printOptions.includeFormulaCalculations
                        ? 'bg-[#8F2635] border-[#8F2635] text-white'
                        : 'border-[#A89A92] bg-white'
                    }`}
                  >
                    {printOptions.includeFormulaCalculations && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Calculator size={14} className={printOptions.includeFormulaCalculations ? 'text-[#8F2635]' : 'text-[#8C7D76]'} />
                    <span className="font-semibold text-xs sm:text-sm text-[#332C29]">
                      {t.optFormulaCalculations}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5E57] mt-0.5 leading-relaxed">
                    {t.optFormulaCalculationsDesc}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#E8DED8]/40 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] text-xs font-semibold transition-colors cursor-pointer"
          >
            {t.cancelBtn}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#A85C68] bg-white hover:bg-[#F3E7E7] text-[#8F2635] text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Eye size={14} />
              <span>{t.previewFirstBtn}</span>
            </button>

            <button
              type="button"
              onClick={onConfirmPrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Printer size={14} />
              <span>{t.printNowBtn}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
