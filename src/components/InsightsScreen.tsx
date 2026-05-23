/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, PlusCircle, Mic, 
  HelpCircle, PiggyBank, ListCollapse, ListFilter, Play, ArrowRight, X 
} from 'lucide-react';
import { Transaction } from '../types';

interface InsightsScreenProps {
  transactions: Transaction[];
  onNavigateToRecord: () => void;
  onAddSimulatedVoiceTransaction: (speechText: string, amount: number) => void;
}

export default function InsightsScreen({
  transactions,
  onNavigateToRecord,
  onAddSimulatedVoiceTransaction,
}: InsightsScreenProps) {
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pulseScale, setPulseScale] = useState(false);
  const [selectedPresetVoice, setSelectedPresetVoice] = useState<string | null>(null);

  // Default hardcoded starting amounts + any recorded user transactions
  const recordedAmount = transactions.reduce((sum, t) => sum + t.amount, 0) || 450000;
  const estimatedLeakage = Math.max(120000, 450000 - Math.round(recordedAmount * 0.1));

  // Visual percentages
  const totalBoth = recordedAmount + estimatedLeakage;
  const recordedPct = Math.round((recordedAmount / totalBoth) * 100) || 75;
  const leakagePct = 100 - recordedPct;

  // Setara piring jualan simulation (Assuming average SME portion costs Rp 20.000)
  const portionPrice = 20000;
  const equivalentPortions = Math.round(estimatedLeakage / portionPrice);

  // Pre-made speech simulation scripts representing extreme Indonesian UMKM convenience
  const simulatedSpeechPresets = [
    { text: "Beli es batu lima belas ribu rupiah", amount: 15000 },
    { text: "Bayar uang parkir suplier dua ribu", amount: 2000 },
    { text: "Beli kopi joni buat tim delapan belas ribu", amount: 18000 },
    { text: "Isi bensin kurir motor empat puluh ribu", amount: 40000 },
    { text: "Bayar galon air minum isi ulang tiga puluh ribu", amount: 30000 },
  ];

  const triggerVoiceSimulation = (text: string, amount: number) => {
    setIsRecording(true);
    setSelectedPresetVoice(text);
    
    // Simulate speech-to-text processing steps
    setTimeout(() => {
      setIsRecording(false);
      onAddSimulatedVoiceTransaction(text, amount);
      setShowVoiceRecorder(false);
      setSelectedPresetVoice(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Leakage Potential Warning Card */}
      <section className="p-5 bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary shadow-sm rounded-r-xl">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold font-label-caps text-secondary uppercase tracking-widest block">
            Peringatan Kebocoran
          </span>
          <AlertTriangle className="text-secondary w-5 h-5 flex-shrink-0 animate-bounce" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold font-headline-lg-mobile text-on-surface mb-2">
          Potensi Bocor Kas Bulan Ini:{' '}
          <span className="text-secondary font-extrabold">
            Rp {estimatedLeakage.toLocaleString('id-ID')}
          </span>
        </h2>
        <p className="text-xs font-body-md text-on-surface-variant leading-relaxed">
          Uang kecil yang terabaikan (seperti parkir, tips kurir, dan es tim) sering kali memangkas profit bersih warung Anda hingga 15% jika tidak dicatat secara disiplin.
        </p>
      </section>

      {/* Visualization Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Chart Container */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col h-72 rounded-xl">
          <h3 className="text-xs font-semibold font-label-caps text-on-surface-variant tracking-wider uppercase mb-5">
            REKAM VS TAK TEREKAM (LEAKAGE)
          </h3>
          
          <div className="flex-grow flex items-end justify-around gap-4 pb-2">
            <div className="w-full flex flex-col items-center group">
              <div className="w-14 bg-primary-container rounded-t-lg transition-all duration-500 relative flex items-end justify-center" style={{ height: `${recordedPct}%` }}>
                <span className="absolute -top-6 text-xs font-bold text-primary font-data-mono">
                  {recordedPct}%
                </span>
              </div>
              <span className="text-xs font-medium font-data-mono mt-3 text-on-surface-variant">
                Recorded
              </span>
            </div>
            
            <div className="w-full flex flex-col items-center group">
              <div className="w-14 bg-secondary-container rounded-t-lg transition-all duration-500 relative flex items-end justify-center" style={{ height: `${leakagePct}%` }}>
                <span className="absolute -top-6 text-xs font-bold text-secondary font-data-mono">
                  {leakagePct}%
                </span>
              </div>
              <span className="text-xs font-medium font-data-mono mt-3 text-on-surface-variant">
                Leakage
              </span>
            </div>
          </div>
          
          <p className="text-xs font-bold text-secondary mt-2 bg-secondary/5 p-2 rounded text-center">
            ⚠️ +12% kebocoran dari bulan sebelumnya
          </p>
        </div>

        {/* Summary equivalence Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col justify-center items-center text-center rounded-xl min-h-72">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 border border-outline-variant/60 shadow-inner">
            <PiggyBank className="text-primary w-8 h-8" />
          </div>
          <p className="text-sm font-body-lg text-on-surface-variant max-w-xs leading-relaxed">
            Potensi kebocoran kas Anda setara dengan modal{' '}
            <strong className="text-primary text-base font-extrabold px-1 block underline my-1 decoration-secondary decoration-2 underline-offset-4">
              {equivalentPortions} porsi
            </strong>{' '}
            piring dagangan utama jualan Anda malam ini.
          </p>
        </div>
      </div>

      {/* Top Receh Categories */}
      <section>
        <h3 className="text-base font-bold font-headline-md text-on-surface mb-3 flex items-center gap-2">
          <ListFilter className="text-primary w-5 h-5" />
          Kategori 'Top Receh' Terdeteksi
        </h3>
        
        <div className="space-y-2">
          {/* Item: Parking */}
          <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-all duration-200 cursor-pointer rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg text-on-surface-variant font-black text-sm">
                🅿️
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Parking Supporter</h4>
                <p className="text-xs text-on-surface-variant">Karcis belanja gudang & kurir</p>
              </div>
            </div>
            <span className="font-extrabold font-data-mono text-xs text-secondary bg-secondary/5 px-2 py-1 rounded">
              Rp 120.000
            </span>
          </div>

          {/* Item: Tips */}
          <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-all duration-200 cursor-pointer rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg text-on-surface-variant text-sm">
                🤝
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Tips & Kebersihan</h4>
                <p className="text-xs text-on-surface-variant">Keamanan, sampah & ojol kurir </p>
              </div>
            </div>
            <span className="font-extrabold font-data-mono text-xs text-secondary bg-secondary/5 px-2 py-1 rounded">
              Rp 210.000
            </span>
          </div>

          {/* Item: Ice/Drink */}
          <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-all duration-200 cursor-pointer rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg text-on-surface-variant text-sm">
                🥤
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Ice & Air Minum</h4>
                <p className="text-xs text-on-surface-variant">Galon & es batu balok darurat</p>
              </div>
            </div>
            <span className="font-extrabold font-data-mono text-xs text-secondary bg-secondary/5 px-2 py-1 rounded">
              Rp 120.000
            </span>
          </div>

          {/* Draft Indicator Item */}
          <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl opacity-80"
               style={{ 
                 backgroundImage: `repeating-linear-gradient(45deg, #f1f5f9, #f1f5f9 10px, #ffffff 10px, #ffffff 20px)` 
               }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-dashed border-outline rounded-lg text-sm text-outline">
                ❓
              </div>
              <div>
                <h4 className="text-sm font-bold text-outline">Pengeluaran Lain-lain</h4>
                <p className="text-xs text-outline">Menunggu verifikasi draft</p>
              </div>
            </div>
            <span className="font-bold font-label-caps text-[9px] px-2 py-0.5 bg-outline-variant text-on-surface-variant rounded block">
              DRAF INTERN
            </span>
          </div>
        </div>
      </section>

      {/* CTA Action */}
      <div className="pt-2">
        <button
          onClick={onNavigateToRecord}
          className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          Catat Pengeluaran Sekarang
        </button>
      </div>

      {/* FAB Floating Mic for Speech Simulation */}
      <button
        onClick={() => {
          setShowVoiceRecorder(true);
          setIsRecording(false);
        }}
        className="fixed right-6 bottom-24 w-15 h-15 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-40 cursor-pointer"
        title="Catat pakai suara AI"
      >
        <Mic className="w-6 h-6" />
        <div className="absolute inset-0 rounded-full border-2 border-primary-fixed opacity-30 animate-ping pointer-events-none" />
      </button>

      {/* Voice Recorder Simulation Overlay Modal */}
      {showVoiceRecorder && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-t-2xl sm:rounded-xl max-w-md w-full p-6 space-y-5 border border-outline-variant shadow-2xl animate-in slide-in-from-bottom duration-250">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mic className="text-secondary w-5 h-5" />
                <h4 className="font-bold text-on-surface">Simulasi Voice Input AI</h4>
              </div>
              <button 
                onClick={() => setShowVoiceRecorder(false)} 
                className="text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-surface-container-high p-5 rounded-xl border border-outline-variant/60 flex flex-col items-center text-center justify-center aspect-video relative overflow-hidden">
              {isRecording ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container animate-pulse mb-3">
                    <Mic className="w-8 h-8 text-secondary animate-bounce" />
                  </div>
                  <p className="text-xs font-bold text-secondary animate-pulse uppercase tracking-wider">
                    Asisten AI sedang mendengarkan...
                  </p>
                  <p className="text-sm font-semibold italic mt-2 text-on-surface max-w-xs truncate">
                    "{selectedPresetVoice}"
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center mb-3">
                    <Mic className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Siap Merekam
                  </p>
                  <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                    Cukup diktekan transaksi belanja harian Anda. Pilih salah satu skrip ucapan di bawah untuk dicoba:
                  </p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                Skrip Ucapan (Bahasa Indonesia):
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto no-scrollbar">
                {simulatedSpeechPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    disabled={isRecording}
                    onClick={() => triggerVoiceSimulation(preset.text, preset.amount)}
                    className="p-3 bg-surface hover:bg-primary/5 hover:border-primary border border-outline-variant text-sm font-medium rounded-xl text-left transition-all active:scale-95 flex items-center justify-between cursor-pointer group"
                  >
                    <span className="italic text-on-surface-variant group-hover:text-primary leading-tight">
                      "{preset.text}"
                    </span>
                    <span className="text-[11px] font-bold font-data-mono bg-surface-container-high px-2 py-0.5 rounded text-primary block flex-shrink-0">
                      Rp {preset.amount / 1000}k
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-justify text-on-surface-variant bg-surface-container-low p-2 rounded leading-normal border border-outline-variant/40">
              💡 <strong>Cara Kerja:</strong> AI akan mentranskripsikan ucapan lisan ke teks Bahasa Indonesia, mengekstrak angka Rupiah, dan memetakan deskripsi menjadi draf antrean transaksi di halaman draf.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
