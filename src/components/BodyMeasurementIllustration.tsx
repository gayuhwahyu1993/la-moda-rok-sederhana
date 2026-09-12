import React, { useState } from 'react';
import { Ruler, Sparkles, Check, Image as ImageIcon, X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { BodyMeasurement } from '../types/pattern';
import { useLanguage } from '../i18n';
import skirtMeasurementGuideImg from '../assets/images/skirt_measurement_restored_1787486044371.jpg';
import { isTwoMeasurementSkirtCalculator, DEFAULT_CALCULATOR_IMAGES } from '../services/firebase';

interface BodyMeasurementIllustrationProps {
  measurements: BodyMeasurement[];
  activeMeasurementNumber: number | null;
  onSelectMeasurementNumber: (num: number | null) => void;
  imageUrl?: string | null;
  calculatorId?: string;
  isGuideOpen?: boolean;
  onToggleGuide?: () => void;
  compact?: boolean;
}

export const BodyMeasurementIllustration: React.FC<BodyMeasurementIllustrationProps> = ({
  measurements,
  activeMeasurementNumber,
  onSelectMeasurementNumber,
  imageUrl,
  calculatorId,
  isGuideOpen = true,
  onToggleGuide,
}) => {
  const { t, language } = useLanguage();
  const [hasImageError, setHasImageError] = useState(false);

  // Display-only visual zoom level (Default 1.15x to cleanly trim empty margins on-screen)
  const [zoomScale, setZoomScale] = useState<number>(1.15);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(2.0, Number((prev + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.85, Number((prev - 0.15).toFixed(2))));
  const handleResetZoom = () => setZoomScale(1.15);

  // Check if current calculator is Bodice or Pants
  const isBodice = calculatorId?.includes('badan') || calculatorId?.includes('bodice');
  const isPants = calculatorId?.includes('kulot') || calculatorId?.includes('celana') || calculatorId?.includes('piyama');
  const isTwoMeasurementSkirt = isTwoMeasurementSkirtCalculator(calculatorId || '');

  // Determine display image source: Prefer custom uploaded Firebase URL if present and valid; otherwise fallback to bundled static asset for skirts
  const isCustomUploadedUrl = Boolean(imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')));
  const activeImageSrc = (isBodice || isPants)
    ? (imageUrl || '')
    : isTwoMeasurementSkirt
    ? (imageUrl || DEFAULT_CALCULATOR_IMAGES['rok-lipit-searah']?.measurementGuideImage || '')
    : (isCustomUploadedUrl ? (imageUrl as string) : (skirtMeasurementGuideImg || imageUrl || '/assets/skirt_measurement_guide.jpg'));

  // Find current active measurement object
  const activeItem = measurements.find((m) => m.number === activeMeasurementNumber);
  const activeItemTrans = activeItem ? t.measurements[activeItem.fieldKey as keyof typeof t.measurements] : null;
  const activeItemDisplayName = activeItemTrans?.name || activeItem?.name;
  const activeItemDisplayDesc = activeItemTrans?.description || activeItem?.description;

  const guideTitle = t.measurementGuideTitle || (language === 'en' ? 'Measurement Guide' : 'Panduan Pengukuran');

  if (!isGuideOpen) {
    return null;
  }

  return (
    <div 
      id="section-panduan-pengukuran"
      className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden h-full flex flex-col transition-all duration-200"
    >
      {/* Header bar with title, active preview, zoom controls, and close button */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#E8DED8]/40 border-b border-[#E8DED8] flex items-center justify-between gap-2">
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg bg-[#E8DED8] text-[#8F2635] flex items-center justify-center font-medium shadow-xs shrink-0">
            <Ruler size={13} className="sm:size-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-xs xs:text-sm sm:text-base font-bold text-[#332C29] tracking-wide truncate">
              {guideTitle}
            </h3>
          </div>
        </div>

        {/* Right: Display Zoom Toolbar & Close Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Active measurement preview badge on wide screens */}
          {activeItem && (
            <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 bg-[#E8DED8] border border-[#DFD4CD] rounded-full text-[10.5px] font-medium text-[#8F2635] mr-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8F2635] text-white flex items-center justify-center text-[8.5px] font-bold">
                {activeItem.number}
              </span>
              <span className="font-semibold truncate max-w-[90px]">{activeItemDisplayName}:</span> {activeItem.value} cm
            </div>
          )}

          {/* Display-only Visual Zoom Controls */}
          <div className="flex items-center bg-[#FCFAF7] border border-[#DFD4CD] rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.85}
              title={language === 'en' ? 'Zoom Out' : 'Perkecil Tampilan'}
              className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#6B5E57] hover:text-[#8F2635] hover:bg-[#E8DED8] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ZoomOut size={12} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title={language === 'en' ? 'Reset Fit' : 'Atur Ulang Tampilan'}
              className="px-1 text-[10px] sm:text-[11px] font-mono font-semibold text-[#6B5E57] hover:text-[#8F2635] cursor-pointer"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 2.0}
              title={language === 'en' ? 'Zoom In' : 'Perbesar Tampilan'}
              className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#6B5E57] hover:text-[#8F2635] hover:bg-[#E8DED8] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          {/* Close button */}
          {onToggleGuide && (
            <button
              type="button"
              id="close-measurement-guide-btn"
              onClick={onToggleGuide}
              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[#8F2635] bg-[#FCFAF7] hover:bg-[#E8DED8] border border-[#DFD4CD] transition-colors cursor-pointer ml-0.5"
              title={t.hideMeasurementGuide}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Illustration Display Area with Overflow Clipping */}
      <div className="relative p-1.5 sm:p-2.5 bg-white flex-1 flex flex-col items-center justify-center min-h-[300px] xs:min-h-[360px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[600px] overflow-hidden select-none">
        {/* Active item floating banner */}
        {activeItem && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 bg-[#332C29] text-[#FCFAF7] px-3 py-1 rounded-full shadow-lg text-[11px] font-medium flex items-center gap-1.5 border border-[#4A423B] transition-all max-w-[94%] truncate pointer-events-none">
            <span className="w-4 h-4 rounded-full bg-[#8F2635] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
              {activeItem.number}
            </span>
            <span className="truncate">
              <strong>{activeItemDisplayName}</strong>
              {activeItemDisplayDesc ? `: ${activeItemDisplayDesc}` : ''}
            </span>
          </div>
        )}

        {/* Display-only Container with Controlled Visual Zoom, Object Positioning & Clipping */}
        <div className="relative w-full h-[320px] xs:h-[380px] sm:h-[480px] md:h-[580px] lg:h-[680px] max-h-[740px] flex items-center justify-center overflow-hidden py-1">
          {(!hasImageError && activeImageSrc) ? (
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out origin-center"
              style={{
                transform: `scale(${zoomScale})`,
              }}
            >
              <img
                src={activeImageSrc}
                onError={(e) => {
                  if (isTwoMeasurementSkirt) {
                    const defaultShared = DEFAULT_CALCULATOR_IMAGES['rok-lipit-searah']?.measurementGuideImage;
                    if (defaultShared && e.currentTarget.src !== defaultShared) {
                      e.currentTarget.src = defaultShared;
                    } else {
                      setHasImageError(true);
                    }
                  } else if (!isBodice && !isPants && skirtMeasurementGuideImg && e.currentTarget.src !== skirtMeasurementGuideImg) {
                    e.currentTarget.src = skirtMeasurementGuideImg;
                  } else {
                    setHasImageError(true);
                  }
                }}
                alt="La Moda Measurement Illustration"
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[740px] object-contain object-center filter contrast-[1.04] drop-shadow-xs pointer-events-none"
              />

              {/* Interactive Clickable Hotspots overlay: for 2-measurement skirts (Rok Lipit Searah & Rok Lingkaran) */}
              {!isBodice && !isPants && isTwoMeasurementSkirt && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-full h-full max-w-[560px] max-h-[740px]">
                    {/* Hotspot 1: Lingkar Pinggang (Waist center badge) */}
                    <button
                      type="button"
                      onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === 1 ? null : 1)}
                      aria-label="1. Lingkar Pinggang"
                      className={`absolute top-[32%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 w-12 h-9 rounded-full cursor-pointer pointer-events-auto transition-all ${
                        activeMeasurementNumber === 1
                          ? 'ring-3 ring-[#8F2635]/50 bg-[#8F2635]/20 scale-110'
                          : 'hover:ring-2 hover:ring-[#8F2635]/30 hover:bg-[#8F2635]/10'
                      }`}
                      title="1. Lingkar Pinggang"
                    />

                    {/* Hotspot 2: Panjang Rok (Left side vertical line) */}
                    <button
                      type="button"
                      onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === 2 ? null : 2)}
                      aria-label="2. Panjang Rok"
                      className={`absolute top-[55%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 w-10 h-48 rounded-full cursor-pointer pointer-events-auto transition-all ${
                        activeMeasurementNumber === 2
                          ? 'ring-3 ring-[#5B7E38]/50 bg-[#5B7E38]/20 scale-105'
                          : 'hover:ring-2 hover:ring-[#5B7E38]/30 hover:bg-[#5B7E38]/10'
                      }`}
                      title="2. Panjang Rok"
                    />
                  </div>
                </div>
              )}

              {/* Interactive Clickable Hotspots overlay: for 4-measurement skirt calculators (scales in sync with visual zoom) */}
              {!isBodice && !isPants && !isTwoMeasurementSkirt && measurements.length === 4 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-full h-full max-w-[560px] max-h-[740px]">
                    {/* Hotspot 1: Lingkar Pinggang (Waist center badge) */}
                    <button
                      type="button"
                      onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === 1 ? null : 1)}
                      aria-label="1. Lingkar Pinggang"
                      className={`absolute top-[32%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 w-12 h-9 rounded-full cursor-pointer pointer-events-auto transition-all ${
                        activeMeasurementNumber === 1
                          ? 'ring-3 ring-[#8F2635]/50 bg-[#8F2635]/20 scale-110'
                          : 'hover:ring-2 hover:ring-[#8F2635]/30 hover:bg-[#8F2635]/10'
                      }`}
                      title="1. Lingkar Pinggang"
                    />

                    {/* Hotspot 2: Tinggi Panggul (Right hip vertical double arrow) */}
                    <button
                      type="button"
                      onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === 2 ? null : 2)}
                      aria-label="2. Tinggi Panggul"
                      className={`absolute top-[37.5%] left-[58%] transform -translate-x-1/2 -translate-y-1/2 w-10 h-16 rounded-full cursor-pointer pointer-events-auto transition-all ${
                        activeMeasurementNumber === 2
                          ? 'ring-3 ring-[#5B7E38]/50 bg-[#5B7E38]/20 scale-105'
                          : 'hover:ring-2 hover:ring-[#5B7E38]/30 hover:bg-[#5B7E38]/10'
                      }`}
                      title="2. Tinggi Panggul"
                    />

                    {/* Hotspot 3: Lingkar Panggul (Hip horizontal tape badge) */}
                    <button
                      type="button"
                      onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === 3 ? null : 3)}
                      aria-label="3. Lingkar Panggul"
                      className={`absolute top-[44%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-9 rounded-full cursor-pointer pointer-events-auto transition-all ${
                        activeMeasurementNumber === 3
                          ? 'ring-3 ring-[#8F2635]/50 bg-[#8F2635]/20 scale-110'
                          : 'hover:ring-2 hover:ring-[#8F2635]/30 hover:bg-[#8F2635]/10'
                      }`}
                      title="3. Lingkar Panggul"
                    />

                    {/* Hotspot 4: Panjang Rok (Left side vertical line) */}
                    <button
                      type="button"
                      onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === 4 ? null : 4)}
                      aria-label="4. Panjang Rok"
                      className={`absolute top-[55%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 w-10 h-48 rounded-full cursor-pointer pointer-events-auto transition-all ${
                        activeMeasurementNumber === 4
                          ? 'ring-3 ring-[#5B7E38]/50 bg-[#5B7E38]/20 scale-105'
                          : 'hover:ring-2 hover:ring-[#5B7E38]/30 hover:bg-[#5B7E38]/10'
                      }`}
                      title="4. Panjang Rok"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#8C7D76] bg-[#FCFAF7] rounded-xl border border-dashed border-[#DFD4CD] p-4 text-center">
              <ImageIcon size={28} className="mb-1.5 text-[#DFD4CD]" />
              <p className="font-medium text-[#6B5E57] text-xs">
                {language === 'en' ? 'Measurement guide illustration is not yet available.' : 'Gambar panduan belum tersedia.'}
              </p>
            </div>
          )}
        </div>

        {/* Technical Legend Badges for 2-measurement Skirt calculators (Rok Lipit Searah & Rok Lingkaran) */}
        {!isBodice && !isPants && isTwoMeasurementSkirt && (
          <div className="w-full mt-1.5 pt-2 border-t border-[#E8DED8] grid grid-cols-2 gap-1.5 text-xs z-10 bg-white">
            {[
              { num: 1, label: t.measurements.lingkarPinggang.name, color: '#8F2635' },
              { num: 2, label: t.measurements.panjangRok.name, color: '#5B7E38' },
            ].map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === item.num ? null : item.num)}
                className={`px-2 py-1 rounded-lg text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMeasurementNumber === item.num
                    ? 'bg-[#8F2635] text-[#FCFAF7] font-semibold shadow-xs ring-1 ring-[#8F2635]/30'
                    : 'bg-[#FCFAF7] border border-[#E8DED8] hover:bg-[#E8DED8]/60 text-[#332C29]'
                }`}
              >
                <span 
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                    activeMeasurementNumber === item.num 
                      ? 'bg-white text-[#8F2635]' 
                      : item.color === '#8F2635' 
                        ? 'bg-[#8F2635] text-white' 
                        : 'bg-[#5B7E38] text-white'
                  }`}
                >
                  {item.num}
                </span>
                <span className="truncate text-[11px] leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Technical Legend Badges (1, 2, 3, 4) - for 4-measurement Skirt calculators */}
        {!isBodice && !isPants && !isTwoMeasurementSkirt && measurements.length === 4 && (
          <div className="w-full mt-1.5 pt-2 border-t border-[#E8DED8] grid grid-cols-2 gap-1.5 text-xs z-10 bg-white">
            {[
              { num: 1, label: t.measurements.lingkarPinggang.name, color: '#8F2635' },
              { num: 2, label: t.measurements.tinggiPanggul.name, color: '#5B7E38' },
              { num: 3, label: t.measurements.lingkarPanggul.name, color: '#8F2635' },
              { num: 4, label: t.measurements.panjangRok.name, color: '#5B7E38' },
            ].map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => onSelectMeasurementNumber(activeMeasurementNumber === item.num ? null : item.num)}
                className={`px-2 py-1 rounded-lg text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMeasurementNumber === item.num
                    ? 'bg-[#8F2635] text-[#FCFAF7] font-semibold shadow-xs ring-1 ring-[#8F2635]/30'
                    : 'bg-[#FCFAF7] border border-[#E8DED8] hover:bg-[#E8DED8]/60 text-[#332C29]'
                }`}
              >
                <span 
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                    activeMeasurementNumber === item.num 
                      ? 'bg-white text-[#8F2635]' 
                      : item.color === '#8F2635' 
                        ? 'bg-[#8F2635] text-white' 
                        : 'bg-[#5B7E38] text-white'
                  }`}
                >
                  {item.num}
                </span>
                <span className="truncate text-[11px] leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Instructional caption footer */}
      <div className="px-3.5 sm:px-4 py-2 bg-[#FCFAF7] border-t border-[#E8DED8] text-center hidden xs:block">
        <p className="text-[11px] text-[#7A6B63] flex items-center justify-center gap-1.5 truncate">
          <Check size={12} className="text-[#5B7E38] shrink-0" />
          <span className="truncate">{t.measurementHint}</span>
        </p>
      </div>
    </div>
  );
};


