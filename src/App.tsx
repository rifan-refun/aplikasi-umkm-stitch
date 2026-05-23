/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calculator, Layers, BarChart3, Settings, 
  RotateCw, User, ClipboardList, CheckCircle2, RefreshCw, X, Info
} from 'lucide-react';
import { Transaction, DraftTransaction, Category } from './types';
import NumpadScreen from './components/NumpadScreen';
import TutupBukuScreen from './components/TutupBukuScreen';
import DraftsScreen from './components/DraftsScreen';
import InsightsScreen from './components/InsightsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'drafts' | 'insights' | 'close'>('close');
  const [morningCash, setMorningCash] = useState<number>(200000);
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Start with a default registered transaction today so the analytics start with rich visuals
    {
      id: 'init-1',
      note: 'Pembelian Plastik Kemasan Kg',
      amount: 120000,
      category: 'STOK',
      date: new Date().toISOString(),
      type: 'manual'
    }
  ]);
  
  const [drafts, setDrafts] = useState<DraftTransaction[]>([
    {
      id: 'draft-1',
      note: 'Beli Es Batu',
      amount: 15000,
      type: 'voice',
      date: new Date().toISOString(),
      duration: '0:02'
    },
    {
      id: 'draft-2',
      note: 'Bayar Listrik Toko',
      amount: 850000,
      type: 'manual',
      date: new Date().toISOString()
    },
    {
      id: 'draft-3',
      note: 'Transfer dari OVO - 0812...',
      amount: 122500,
      type: 'sms',
      date: new Date().toISOString()
    },
    {
      id: 'draft-4',
      note: 'Bensin motor kurir',
      amount: 45000,
      type: 'voice',
      date: new Date().toISOString(),
      duration: '0:04'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-fading toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncData = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast("Data SmartUMKM berhasil disinkronkan ke Cloud Server!");
    }, 1500);
  };

  // 1. Manual/Numpad Saver
  const handleSaveTransaction = (note: string, amount: number, category: Category) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      note,
      amount,
      category,
      date: new Date().toISOString(),
      type: 'manual'
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Berhasil menyimpan ${category}: Rp ${amount.toLocaleString('id-ID')}`);
  };

  // 2. Draft categorization pipeline
  const handleCategorizeDraft = (id: string, category: Category) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      note: draft.note,
      amount: draft.amount,
      category,
      date: new Date().toISOString(),
      type: draft.type
    };

    setTransactions((prev) => [newTx, ...prev]);
    setDrafts((prev) => prev.filter(d => d.id !== id));
    showToast(`Draf "${draft.note}" dipromosikan ke ${category}!`);
  };

  // 3. Delete Draft
  const handleDeleteDraft = (id: string) => {
    const draft = drafts.find(d => d.id === id);
    setDrafts((prev) => prev.filter(d => d.id !== id));
    if (draft) {
      showToast(`Draf "${draft.note}" dibuang.`);
    }
  };

  // 4. Bulk approvals
  const handleBulkApprove = () => {
    if (drafts.length === 0) return;

    // Smart semantic automatic categorizations based on text keywords
    const promoted: Transaction[] = drafts.map((draft, idx) => {
      let resolvedCategory: Category = 'LAINNYA';
      const text = draft.note.toLowerCase();

      if (text.includes('es') || text.includes('makan') || text.includes('beli')) {
        resolvedCategory = 'MAKANAN';
      } else if (text.includes('listrik') || text.includes('token') || text.includes('air')) {
        resolvedCategory = 'LISTRIK';
      } else if (text.includes('kurir') || text.includes('bensin') || text.includes('motor')) {
        resolvedCategory = 'TRANSPORTASI';
      } else if (text.includes('ovo') || text.includes('gopay') || text.includes('transfer')) {
        resolvedCategory = 'STOK';
      }

      return {
        id: `tx-bulk-${draft.id}-${idx}`,
        note: draft.note,
        amount: draft.amount,
        category: resolvedCategory,
        date: new Date().toISOString(),
        type: draft.type
      };
    });

    setTransactions((prev) => [...promoted, ...prev]);
    setDrafts([]);
    showToast(`Bulk Approval sukses! ${promoted.length} draf telah dikategorisasi otomatis.`);
  };

  // 5. Voice simulated captures from Insights Mic
  const handleAddSimulatedVoiceTransaction = (speechText: string, amount: number) => {
    const newDraft: DraftTransaction = {
      id: `draft-${Date.now()}`,
      note: speechText,
      amount,
      type: 'voice',
      date: new Date().toISOString(),
      duration: '0:03'
    };
    setDrafts((prev) => [newDraft, ...prev]);
    showToast(`🎤 Dikte Suara berhasil ditangkap: "${speechText}"`);
    setActiveTab('drafts'); // Direct focus user to approve screen
  };

  // 6. Tutup harian submission
  const handleCompleteDay = (actualCash: number) => {
    showToast(`Shift Harian Berhasil Dikunci! Sisa kas laci Rp ${actualCash.toLocaleString('id-ID')} telah tercatat.`);
  };

  return (
    <div className="bg-background text-on-surface min-h-[100dvh] pb-24 font-sans select-none flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant fixed top-0 w-full z-50 h-14 select-none px-4 transition-colors">
        <div className="max-w-xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-headline-md text-sm font-black text-primary tracking-tight leading-none">
                SmartUMKM
              </h1>
              <span className="text-[10px] text-on-surface-variant font-medium">Warung Pak Budi</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={handleSyncData}
              className={`p-2 rounded-full cursor-pointer hover:bg-surface-container transition-all active:scale-95 ${isSyncing ? 'text-primary' : 'text-on-surface-variant'}`}
              title="Sinkronisasi Berkas Kas"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Core View Area */}
      <main className="flex-1 pt-18 pb-6 px-4 max-w-xl w-full mx-auto select-text">
        {activeTab === 'close' && (
          <TutupBukuScreen 
            morningCash={morningCash}
            setMorningCash={setMorningCash}
            transactions={transactions}
            drafts={drafts}
            onNavigateToDrafts={() => setActiveTab('drafts')}
            onCompleteDay={handleCompleteDay}
          />
        )}
        {activeTab === 'home' && (
          <NumpadScreen 
            transactions={transactions}
            onSaveTransaction={handleSaveTransaction}
            onNavigateToInsights={() => setActiveTab('insights')}
          />
        )}
        {activeTab === 'drafts' && (
          <DraftsScreen 
            drafts={drafts}
            onDeleteDraft={handleDeleteDraft}
            onCategorizeDraft={handleCategorizeDraft}
            onBulkApprove={handleBulkApprove}
          />
        )}
        {activeTab === 'insights' && (
          <InsightsScreen 
            transactions={transactions}
            onNavigateToRecord={() => setActiveTab('home')}
            onAddSimulatedVoiceTransaction={handleAddSimulatedVoiceTransaction}
          />
        )}
      </main>

      {/* Bottom Navigation Panel */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant py-2 px-1 z-40 transition-colors shadow-lg select-none">
        <div className="max-w-xl mx-auto flex justify-around items-center">
          
          {/* Close Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('close')}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-150 scale-95 active:scale-90 cursor-pointer ${
              activeTab === 'close'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <ClipboardList className={`w-5 h-5 ${activeTab === 'close' ? 'fill-primary/5 stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-bold font-label-caps mt-1 tracking-wide">Tutup Buku</span>
          </button>

          {/* Home Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-150 scale-95 active:scale-90 cursor-pointer ${
              activeTab === 'home'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Calculator className={`w-5 h-5 ${activeTab === 'home' ? 'fill-primary/5 stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-bold font-label-caps mt-1 tracking-wide">Dialpad</span>
          </button>

          {/* Drafts Tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-150 scale-95 active:scale-90 relative cursor-pointer ${
              activeTab === 'drafts'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Layers className={`w-5 h-5 ${activeTab === 'drafts' ? 'fill-primary/5 stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-bold font-label-caps mt-1 tracking-wide">Draf Antrean</span>
            
            {drafts.length > 0 && (
              <span className="absolute top-0.5 right-6 w-4 h-4 bg-secondary text-on-secondary text-[8.5px] font-black rounded-full flex items-center justify-center ring-2 ring-surface animate-bounce">
                {drafts.length}
              </span>
            )}
          </button>

          {/* Insights tab */}
          <button 
            type="button"
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-all duration-150 scale-95 active:scale-90 cursor-pointer ${
              activeTab === 'insights'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <BarChart3 className={`w-5 h-5 ${activeTab === 'insights' ? 'fill-primary/5 stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-bold font-label-caps mt-1 tracking-wide">Analisis</span>
          </button>

        </div>
      </nav>

      {/* Floating Interactive Notification Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-sm w-full px-4 z-50 animate-in fade-in slide-in-from-bottom duration-200 pointer-events-none">
          <div className="bg-inverse-surface text-inverse-on-surface text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-xl gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary-fixed flex-shrink-0 animate-bounce" />
              <p className="leading-tight">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
