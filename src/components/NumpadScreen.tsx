/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Mic, Save, HelpCircle, 
  ChevronRight, RefreshCw, Smartphone, ClipboardCheck 
} from 'lucide-react';
import { Category, Transaction } from '../types';

interface NumpadScreenProps {
  transactions: Transaction[];
  onSaveTransaction: (note: string, amount: number, category: Category) => void;
  onNavigateToInsights: () => void;
}

export default function NumpadScreen({
  transactions,
  onSaveTransaction,
  onNavigateToInsights,
}: NumpadScreenProps) {
  const [amount, setAmount] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<Category>('MAKANAN');
  const [noteText, setNoteText] = useState<string>('');
  const [showAutoSavedIndicator, setShowAutoSavedIndicator] = useState(false);
  const [activeVoicePrompt, setActiveVoicePrompt] = useState(false);

  // Sum of transactions categorized today
  const spentToday = transactions.reduce((sum, t) => sum + t.amount, 0);

  const formatNumber = (numStr: string) => {
    if (numStr === '0') return '0';
    return parseInt(numStr).toLocaleString('id-ID');
  };

  const appendNum = (val: string) => {
    if (amount === '0') {
      if (val === '000') return;
      setAmount(val);
    } else {
      setAmount((prev) => {
        const next = prev + val;
        // Limit to 100 billion IDR for UI safety
        if (next.length > 11) return prev;
        return next;
      });
    }
  };

  const backspace = () => {
    setAmount((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const clear = () => {
    setAmount('0');
  };

  // Trigger auto-saved drafts feedback
  useEffect(() => {
    if (amount !== '0') {
      setShowAutoSavedIndicator(true);
      const t = setTimeout(() => setShowAutoSavedIndicator(false), 2000);
      return () => clearTimeout(t);
    }
  }, [amount]);

  const handleSave = () => {
    const val = parseInt(amount) || 0;
    if (val <= 0) return;

    // Use placeholder descriptions matching the category if no note is typed
    const defaultNote = noteText.trim() || getDefaultNoteForCategory(selectedCategory);
    onSaveTransaction(defaultNote, val, selectedCategory);
    
    // Clear display state
    setAmount('0');
    setNoteText('');
  };

  const getDefaultNoteForCategory = (cat: Category) => {
    switch (cat) {
      case 'MAKANAN': return 'Belian Makan Tim Kantor';
      case 'LISTRIK': return 'Bayar Token Listrik Ruko';
      case 'STOK': return 'Peralatan & Stok Sembako';
      case 'TIPS': return 'Kebersihan & Uang Tips Ojol';
      case 'PARKIR': return 'Karcis Parkir Ekspedisi';
      case 'TRANSPORTASI': return 'Pengisian Bensin Kurir';
      default: return 'Pengeluaran Toko';
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto overflow-hidden">
      {/* Summary Strip (Mobile Only) */}
      <div className="px-5 py-2.5 bg-surface-container-highest flex justify-between items-center rounded-xl border border-outline-variant/60 mb-1">
        <span className="text-[10px] font-bold font-label-caps text-on-surface-variant uppercase tracking-wider">
          Total Terpakai Hari Ini
        </span>
        <span className="text-sm font-bold font-data-mono text-primary animate-pulse">
          Rp {spentToday.toLocaleString('id-ID')}
        </span>
      </div>

      {/* Current Entry Display */}
      <section className="flex-none py-5 px-6 flex flex-col items-center justify-center space-y-1 bg-surface-container-lowest border border-outline-variant rounded-xl mb-4 shadow-inner">
        <div className="flex items-center text-on-surface-variant font-bold font-label-caps text-[10px] tracking-widest uppercase">
          Input Transaksi Pengeluaran
        </div>
        
        <div className="flex items-baseline space-x-1.5 pt-1">
          <span className="text-xl font-bold text-outline">Rp</span>
          <span id="display-amount" className="text-4xl sm:text-5xl font-black text-on-surface font-display-numpad tracking-tight select-none">
            {formatNumber(amount)}
          </span>
        </div>

        {/* Input for custom notes */}
        <div className="w-full max-w-xs mt-3 relative">
          <input
            type="text"
            className="w-full text-center px-3 py-1.5 text-xs font-semibold bg-surface border border-outline-variant rounded-md text-on-surface placeholder:text-outline outline-none"
            placeholder="Tambah Catatan (opsional)"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </div>

        {/* Draft/Auto-save Status */}
        <div className={`flex items-center space-x-1 px-3 py-1 mt-2.5 rounded-full bg-surface-container-low border border-outline-variant transition-all duration-300 ${showAutoSavedIndicator ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="w-1.5 h-1.5 bg-primary-container rounded-full animate-ping" />
          <span className="text-[9.5px] font-medium text-on-surface-variant font-label-caps">
            Simulasi draf disimpan otomatis
          </span>
        </div>
      </section>

      {/* Functional Actions (Quick Category Tags Pills) */}
      <div className="pb-4 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { cat: 'MAKANAN', label: '🍟 MAKANAN' },
          { cat: 'LISTRIK', label: '⚡ LISTRIK' },
          { cat: 'STOK', label: '📦 STOK' },
          { cat: 'TIPS', label: '🤝 TIPS' },
          { cat: 'PARKIR', label: '🅿️ PARKIR' },
          { cat: 'TRANSPORTASI', label: '🚚 BENSIN' },
          { cat: 'LAINNYA', label: '📁 LAINNYA' },
        ].map((pill) => (
          <button
            key={pill.cat}
            onClick={() => setSelectedCategory(pill.cat as Category)}
            className={`flex-none px-4 py-1.5 rounded-full text-xs font-bold font-label-caps tracking-wider border transition-all cursor-pointer ${
              selectedCategory === pill.cat
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Numpad Container Grid */}
      <section className="flex-1 min-h-[300px] grid grid-cols-3 gap-0.5 bg-outline-variant/60 rounded-xl overflow-hidden border border-outline-variant/80">
        {[
          { label: '1', act: () => appendNum('1') },
          { label: '2', act: () => appendNum('2') },
          { label: '3', act: () => appendNum('3') },
          { label: '4', act: () => appendNum('4') },
          { label: '5', act: () => appendNum('5') },
          { label: '6', act: () => appendNum('6') },
          { label: '7', act: () => appendNum('7') },
          { label: '8', act: () => appendNum('8') },
          { label: '9', act: () => appendNum('9') },
        ].map((key) => (
          <button
            key={key.label}
            onClick={key.act}
            type="button"
            className="bg-surface flex items-center justify-center text-2xl font-bold font-display-numpad text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer select-none"
          >
            {key.label}
          </button>
        ))}
        
        {/* Backspace Button */}
        <button
          onClick={backspace}
          onDoubleClick={clear}
          type="button"
          className="bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer select-none"
          title="Ketuk untuk backspace, ketuk ganda untuk reset"
        >
          <svg
            className="w-7 h-7 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
        </button>

        {/* 0 Button */}
        <button
          onClick={() => appendNum('0')}
          type="button"
          className="bg-surface flex items-center justify-center text-2xl font-bold font-display-numpad text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer select-none"
        >
          0
        </button>

        {/* .000 Thousands multiplier */}
        <button
          onClick={() => appendNum('000')}
          type="button"
          className="bg-surface-container-low flex items-center justify-center text-sm font-extrabold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer select-none"
        >
          .000
        </button>
      </section>

      {/* Save Action Row */}
      <div className="py-4 bg-transparent flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={amount === '0'}
          className={`flex-1 h-14 font-extrabold text-base tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer ${
            amount === '0'
              ? 'bg-surface-container text-outline border border-outline-variant cursor-not-allowed'
              : 'bg-primary text-on-primary hover:bg-opacity-95'
          }`}
        >
          <Save className="w-5 h-5" />
          <span>SIMPAN PENGELUARAN</span>
        </button>
      </div>
    </div>
  );
}
