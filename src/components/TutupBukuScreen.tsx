/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, FileText, ArrowRight, Save, Coins, Landmark } from 'lucide-react';
import { DraftTransaction, Transaction } from '../types';

interface TutupBukuScreenProps {
  morningCash: number;
  setMorningCash: (val: number) => void;
  transactions: Transaction[];
  drafts: DraftTransaction[];
  onNavigateToDrafts: () => void;
  onCompleteDay: (actualCash: number) => void;
}

export default function TutupBukuScreen({
  morningCash,
  setMorningCash,
  transactions,
  drafts,
  onNavigateToDrafts,
  onCompleteDay,
}: TutupBukuScreenProps) {
  const [laciInput, setLaciInput] = useState<string>('0');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editingModal, setEditingModal] = useState(false);
  const [newMorningCash, setNewMorningCash] = useState(morningCash.toString());

  // Income total is sum of all "manual" or categorized transactions that are positive (or simulated revenue).
  // By default let's assume we has Rp 1.450.000 as simulated sales income for demonstration,
  // plus any additional recorded transactions of positive/negative sums.
  const recordedSales = 1450000;
  
  // Expenses are transactions with negative or spent amounts
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  const expectedTotal = morningCash + recordedSales;
  const targetLaci = expectedTotal - totalExpenses; // What should remain in the drawer

  const laciValue = parseInt(laciInput) || 0;
  const calculatedExpense = expectedTotal - laciValue;
  const difference = laciValue - targetLaci;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleSubmit = () => {
    setIsSubmitLoading(true);
    setTimeout(() => {
      setIsSubmitLoading(false);
      setIsSubmitted(true);
      onCompleteDay(laciValue);
      setTimeout(() => {
        setIsSubmitted(false);
        setLaciInput('0');
      }, 3000);
    }, 1500);
  };

  // Keyboard helper for adding money values
  const addQuickAmount = (val: number) => {
    const current = parseInt(laciInput) || 0;
    setLaciInput((current + val).toString());
  };

  return (
    <div className="space-y-6">
      {/* Header Text */}
      <section className="mb-4">
        <h2 className="text-2xl font-bold font-headline-lg tracking-tight text-on-surface mb-2">
          Tutup Buku Harian
        </h2>
        <p className="text-sm font-body-md text-on-surface-variant">
          Lakukan pengecekan sisa uang tunai sebelum menutup toko malam ini.
        </p>
      </section>

      {/* Main Form Box */}
      <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-label-caps tracking-wider text-on-surface-variant block uppercase" htmlFor="laci_input">
            BERAPA SISA UANG DI LACI MALAM INI?
          </label>
          <button 
            type="button" 
            onClick={() => setLaciInput('0')} 
            className="text-xs text-secondary hover:underline cursor-pointer font-medium"
          >
            Reset
          </button>
        </div>

        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
            Rp
          </span>
          <input
            className="w-full pl-16 pr-4 py-5 bg-surface-container-low border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-lg text-3xl font-bold text-on-surface transition-all outline-none"
            id="laci_input"
            type="text"
            pattern="[0-9]*"
            value={laciInput === '0' ? '' : formatRupiah(laciValue).replace('Rp', '').trim()}
            onChange={(e) => {
              const pureDigits = e.target.value.replace(/\D/g, '');
              setLaciInput(pureDigits || '0');
            }}
            placeholder="0"
          />
        </div>

        {/* Quick Denomination Buttons */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
          {[5000, 10000, 20000, 50000, 100000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => addQuickAmount(amount)}
              className="flex-none px-3 py-1.5 bg-surface-container text-xs font-medium text-on-surface hover:bg-surface-container-high border border-outline-variant rounded-md active:scale-95 transition-all"
            >
              +{amount / 1000}k
            </button>
          ))}
        </div>
      </div>

      {/* Logic Breakdown Section */}
      <section className="space-y-4">
        {/* Row 1: System Projection */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setEditingModal(true)}
            className="bg-surface-container p-4 border-l-4 border-tertiary rounded-r-lg cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-label-caps text-on-surface-variant tracking-wider uppercase">MODAL PAGI</p>
              <span className="text-[10px] text-primary underline">Ubah</span>
            </div>
            <p className="text-base font-semibold font-data-mono mt-1">{formatRupiah(morningCash)}</p>
          </div>
          <div className="bg-surface-container p-4 border-l-4 border-primary-container rounded-r-lg">
            <p className="text-[10px] font-label-caps text-on-surface-variant tracking-wider uppercase">PEMASUKAN</p>
            <p className="text-base font-semibold font-data-mono text-primary-container mt-1">{formatRupiah(recordedSales)}</p>
          </div>
        </div>

        {/* Row 2: Calculation Card */}
        <div className="bg-surface-container-highest p-5 rounded-xl border border-outline-variant">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-body-md text-on-surface-variant">Total Uang Seharusnya</span>
            <span className="text-sm font-semibold font-data-mono text-on-surface">{formatRupiah(expectedTotal)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-body-md text-on-surface-variant">Belanja/Pengeluaran Terbayar</span>
            <span className="text-sm font-semibold font-data-mono text-error">-{formatRupiah(totalExpenses)}</span>
          </div>
          <div className="flex justify-between items-center mb-4 border-b border-outline pb-3">
            <span className="text-sm font-body-md text-on-surface-variant">Uang Laci Teoretis</span>
            <span className="text-sm font-bold font-data-mono text-primary">{formatRupiah(targetLaci)}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-body-md text-on-surface-variant font-medium">Sisa Laci Terinput</span>
            <span className="text-sm font-bold font-data-mono text-on-surface">{formatRupiah(laciValue)}</span>
          </div>

          <div className="flex justify-between items-end bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/60">
            <div>
              <p className="text-[10px] font-label-caps text-on-surface-variant tracking-wider uppercase">SISA OPERASIONAL TERHITUNG</p>
              <p className="text-2xl font-black font-display-numpad text-on-surface mt-1">
                {formatRupiah(calculatedExpense)}
              </p>
            </div>
            <FileText className="text-primary w-7 h-7 opacity-50" />
          </div>
        </div>

        {/* Difference / Alert Box */}
        {difference !== 0 && laciValue > 0 && (
          <div className="bg-error-container p-4 rounded-xl border-l-4 border-error flex items-start gap-3 shadow-sm animate-pulse">
            <AlertTriangle className="text-error w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-headline-md text-on-error-container font-semibold">
                Selisih: {difference < 0 ? '-' : '+'}{formatRupiah(Math.abs(difference))}
              </p>
              <p className="text-xs font-body-md text-on-error-container mt-1">
                {difference < 0 
                  ? 'Kas laci kurang dari hitungan sistem. Apakah ada pengeluaran receh yang lupa dicatat, atau kembalian salah?'
                  : 'Kas laci lebih dari hitungan sistem. Mungkin ada pemasukan penjualan yang belum terinput di aplikasi.'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Final Action */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitLoading}
          className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
            isSubmitted
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-primary text-on-primary hover:bg-opacity-90'
          }`}
        >
          {isSubmitLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memproses Penutupan...
            </>
          ) : isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Buku Harian Berhasil Ditutup
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Selesaikan Hari Ini
            </>
          )}
        </button>
      </div>

      {/* Secondary Info Cards */}
      <div 
        onClick={onNavigateToDrafts}
        className="flex items-center gap-4 p-4 bg-surface-bright border border-dashed border-outline rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors"
      >
        <img
          alt="Cash Register"
          className="w-16 h-16 rounded-lg object-cover border border-outline-variant"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaazurjJNC8OVIcfswsCYcv4yxIq12L3sfDWK3twnJkyDXuG8lWRkbGKYump3zVd-0qG3dleh4MMHc7L8f8jfg7aphu8vmu4yc7CXHa5DSbvO7P5kDeWpBZ0PAEuDehQspWybmCxLQmmkWO1uo1E2Vx_dq6XleFICCot3jwp9B9XCs2wi4M0KJN6bR9ZSZYNlwzHQkyUb41GrDkWu7Dr2UPjX3dWsNY9E8_L2qDLpqftJ78OqcS3YBByeHlkYFkHZb2o-5g1qwxVyG"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">Review Draft</p>
          <p className="text-xs text-on-surface-variant">
            {drafts.length > 0 
              ? `Ada ${drafts.length} nota draft yang belum selesai dikategorisasi.`
              : 'Semua draft transaksi telah bersih dikategorisasi!'}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-outline ml-auto" />
      </div>

      {/* Modal Edit Modal Pagi */}
      {editingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full p-6 space-y-4 border border-outline-variant shadow-xl">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Landmark className="text-primary w-5 h-5" /> Adjust Modal Pagi
            </h3>
            <p className="text-xs text-on-surface-variant">
              Tentukan saldo awal kas laci yang standby pagi hari untuk kembalian pembeli.
            </p>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">Rp</span>
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline focus:border-primary focus:ring-0 rounded-lg text-base font-semibold"
                value={newMorningCash === '0' ? '' : formatRupiah(parseInt(newMorningCash) || 0).replace('Rp', '').trim()}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setNewMorningCash(val || '0');
                }}
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setEditingModal(false)}
                className="px-4 py-2 text-xs font-medium bg-surface-container hover:bg-surface-container-high rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setMorningCash(parseInt(newMorningCash) || 0);
                  setEditingModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-primary text-on-primary rounded-md flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3 w-3" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
