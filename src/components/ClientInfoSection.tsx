import React from 'react';
import { User, Phone, Calendar } from 'lucide-react';
import { ClientInfo } from '../types/pattern';
import { formatLocalizedDate } from '../utils/storage';
import { useLanguage } from '../i18n';

interface ClientInfoSectionProps {
  clientInfo: ClientInfo;
  onChangeClientInfo: (field: keyof ClientInfo, value: string) => void;
}

export const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  clientInfo,
  onChangeClientInfo,
}) => {
  const { t, language } = useLanguage();

  return (
    <section 
      id="section-data-klien"
      className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all"
    >
      {/* Header Bar */}
      <div className="px-6 py-3.5 bg-[#E8DED8]/40 border-b border-[#E8DED8] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E8DED8] text-[#8F2635] flex items-center justify-center font-medium shadow-xs">
            <User size={16} />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29] tracking-wide">
              {t.clientDataTitle}
            </h2>
            <p className="text-xs text-[#6B5E57]">
              {t.clientDataSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Input Fields Grid */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          
          {/* 1. Nama Klien */}
          <div className="space-y-1.5">
            <label 
              htmlFor="input-client-name"
              className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider"
            >
              {t.clientNameLabel}
            </label>
            <div className="relative">
              <input
                id="input-client-name"
                type="text"
                value={clientInfo.clientName}
                onChange={(e) => onChangeClientInfo('clientName', e.target.value)}
                placeholder={t.clientNamePlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm font-medium rounded-xl border border-[#DFD4CD] bg-[#FCFAF7] text-[#332C29] placeholder-[#A89C8F] focus:bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 outline-none transition-all"
              />
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A85C68] pointer-events-none" />
            </div>
          </div>

          {/* 2. No. HP */}
          <div className="space-y-1.5">
            <label 
              htmlFor="input-phone-number"
              className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider"
            >
              {t.phoneNumberLabel}
            </label>
            <div className="relative">
              <input
                id="input-phone-number"
                type="tel"
                value={clientInfo.phoneNumber}
                onChange={(e) => onChangeClientInfo('phoneNumber', e.target.value)}
                placeholder={t.phoneNumberPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm font-mono font-medium rounded-xl border border-[#DFD4CD] bg-[#FCFAF7] text-[#332C29] placeholder-[#A89C8F] focus:bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 outline-none transition-all"
              />
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A85C68] pointer-events-none" />
            </div>
          </div>

          {/* 3. Tanggal */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="input-project-date"
                className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider"
              >
                {t.dateLabel}
              </label>
              {clientInfo.date ? (
                <span className="text-[11px] text-[#8C7D76] font-mono">
                  {formatLocalizedDate(clientInfo.date, language)}
                </span>
              ) : null}
            </div>
            <div className="relative">
              <input
                id="input-project-date"
                type="text"
                value={clientInfo.date}
                onChange={(e) => onChangeClientInfo('date', e.target.value)}
                placeholder={t.datePlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm font-medium rounded-xl border border-[#DFD4CD] bg-[#FCFAF7] text-[#332C29] placeholder-[#A89C8F] focus:bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 outline-none transition-all"
              />
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A85C68] pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
