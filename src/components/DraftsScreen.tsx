/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, Trash2, CheckSquare, Layers, Mic, FileEdit, HelpCircle, 
  MessageSquare, Grid, Clipboard, Folder, Sparkles, CheckCircle2 
} from 'lucide-react';
import { DraftTransaction, Category } from '../types';

interface DraftsScreenProps {
  drafts: DraftTransaction[];
  onDeleteDraft: (id: string) => void;
  onCategorizeDraft: (id: string, category: Category) => void;
  onBulkApprove: () => void;
}

export default function DraftsScreen({
  drafts,
  onDeleteDraft,
  onCategorizeDraft,
  onBulkApprove,
}: DraftsScreenProps) {
  const [selectedDraft, setSelectedDraft] = useState<DraftTransaction | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const totalQueueAmount = drafts.reduce((sum, d) => sum + d.amount, 0);
  const voiceDraftsCount = drafts.filter(d => d.type === 'voice').length;

  const getSourceIcon = (type: 'voice' | 'manual' | 'sms') => {
    switch (type) {
      case 'voice':
        return <Mic className="w-4 h-4 text-secondary-container" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'manual':
        return <FileEdit className="w-4 h-4 text-amber-600" />;
    }
  };

  const getSourceLabel = (type: 'voice' | 'manual' | 'sms') => {
    switch (type) {
      case 'voice': return 'Pending • Voice';
      case 'sms': return 'Pending • SMS';
      case 'manual': return 'Pending • Manual';
    }
  };

  const triggerPlayVoice = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      // Simulate voice notes audio finishing after 2 seconds
      setTimeout(() => {
        setPlayingVoiceId(current => current === id ? null : current);
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end gap-2">
        <div>
          <span className="text-[10px] font-bold font-label-caps text-primary tracking-wider uppercase block mb-1">
            Queue Management
          </span>
          <h2 className="text-2xl font-bold font-headline-lg-mobile text-on-surface">
            Draft Pengeluaran ({drafts.length})
          </h2>
        </div>
        <button
          onClick={onBulkApprove}
          disabled={drafts.length === 0}
          className="bg-primary text-on-primary px-3 py-2 rounded-lg font-bold text-xs tracking-wider font-label-caps flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <CheckSquare className="w-4 h-4" />
          Bulk Approve
        </button>
      </div>

      {/* Progress Banner */}
      <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm flex-shrink-0">
          <Layers className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold font-label-caps text-on-surface-variant tracking-wider uppercase">
            Review Status
          </p>
          <div className="w-full bg-outline-variant h-2.5 rounded-full mt-1.5 overflow-hidden">
            {/* Hardcoded 40% when 4 drafts left, scaling down dynamically */}
            <div 
              className="bg-secondary h-full transition-all duration-500" 
              style={{ width: `${drafts.length === 0 ? 100 : Math.max(15, 100 - (drafts.length * 20))}%` }} 
            />
          </div>
          <p className="text-[10px] mt-1 text-outline font-medium">
            {drafts.length > 0 
              ? `${drafts.length} transaksi memerlukan klasifikasi kategori`
              : 'Semua draf selesai direview dan disinkronkan!'}
          </p>
        </div>
      </div>

      {/* No Drafts Placeholders */}
      {drafts.length === 0 && (
        <div className="border border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-lowest">
          <span className="text-4xl">🎉</span>
          <h4 className="text-sm font-semibold text-on-surface mt-2">Draf Transaksi Kosong</h4>
          <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
            Gunakan perekam suara atau tomboldialpad untuk mendaftarkan pengeluaran baru. Semua draf pengeluaran Anda sudah diproses dengan rapi.
          </p>
        </div>
      )}

      {/* Draft List */}
      <div className="space-y-4">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface group"
          >
            {/* Diagonal striped bg representing "Draft" status */}
            <div className="draft-diagonal-bg absolute inset-0 opacity-4 px-1 pointer-events-none" 
                 style={{ 
                   backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(109, 122, 119, 0.04) 10px, rgba(109, 122, 119, 0.04) 20px)` 
                 }} 
            />
            
            <div className="relative p-4 flex items-start gap-4">
              <div className="flex-shrink-0 w-1 bg-secondary-container rounded-full self-stretch" />
              
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded font-bold text-[9px] uppercase tracking-wide">
                      {getSourceIcon(draft.type)}
                      <span className="truncate">{getSourceLabel(draft.type)}</span>
                    </span>
                    {draft.type === 'voice' && (
                      <button 
                        onClick={() => triggerPlayVoice(draft.id)}
                        className={`text-[9.5px] px-1.5 py-0.5 rounded flex items-center gap-1 text-primary hover:bg-primary/10 transition-colors ${playingVoiceId === draft.id ? 'bg-primary/20 animate-pulse' : 'bg-primary/5'}`}
                      >
                        <Play className={`w-2.5 h-2.5 ${playingVoiceId === draft.id ? 'fill-primary animate-ping' : ''}`} />
                        {playingVoiceId === draft.id ? 'Pemutaran...' : draft.duration || '0:03'}
                      </button>
                    )}
                  </div>
                  <span className="font-bold font-data-mono text-sm text-on-surface flex-shrink-0">
                    {formatRupiah(draft.amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-on-surface-variant min-w-0">
                  <p className={`text-sm ${draft.type === 'voice' ? 'italic text-on-surface/80 font-medium' : 'font-medium'}`}>
                    {draft.type === 'voice' ? `"${draft.note}"` : draft.note}
                  </p>
                </div>

                {/* CTA Action Row */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedDraft(draft)}
                    className="flex-1 h-11 border-2 border-primary text-primary font-bold text-xs font-label-caps rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary/5 active:bg-primary active:text-on-primary transition-all cursor-pointer"
                  >
                    <Folder className="w-4 h-4" />
                    KATEGORISASI
                  </button>
                  <button
                    onClick={() => onDeleteDraft(draft.id)}
                    className="w-11 h-11 border border-outline-variant hover:border-error rounded-lg flex items-center justify-center text-error hover:bg-error-container transition-colors cursor-pointer"
                    title="Hapus draf"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Widget Cards */}
      {drafts.length > 0 && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-surface border border-outline-variant p-4 rounded-xl">
            <p className="text-[10px] font-bold font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
              TOTAL ANTRIAN DRAF
            </p>
            <p className="text-lg font-extrabold text-primary font-display-numpad">
              {formatRupiah(totalQueueAmount)}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-4 rounded-xl">
            <p className="text-[10px] font-bold font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
              CATATAN SUARA (VOICE)
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-lg font-extrabold text-secondary font-display-numpad">
                {voiceDraftsCount}
              </p>
              <Mic className="text-secondary w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Categorization Modal Overlay */}
      {selectedDraft && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-t-2xl sm:rounded-xl max-w-md w-full p-6 space-y-4 border border-outline-variant shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">
                  Draft Classification
                </span>
                <h3 className="text-base font-bold text-on-surface mt-1">
                  Pilih Kategori Transaksi
                </h3>
              </div>
              <p className="text-base font-bold font-data-mono text-primary">
                {formatRupiah(selectedDraft.amount)}
              </p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60">
              <p className="text-xs text-on-surface-variant">Deskripsi item:</p>
              <p className="text-sm font-semibold text-on-surface mt-0.5">
                {selectedDraft.type === 'voice' ? `"${selectedDraft.note}"` : selectedDraft.note}
              </p>
            </div>

            <p className="text-xs font-semibold text-on-surface-variant">
              KATEGORI RECEH UMKM:
            </p>

            {/* Grid of clean, highly visual category buttons */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { cat: 'MAKANAN', label: '🍟 Makanan', desc: 'Bahan baku/konsumsi' },
                { cat: 'STOK', label: '📦 Stok', desc: 'Sembako, plastik, dus' },
                { cat: 'LISTRIK', label: '⚡ Listrik', desc: 'Internet & utilitas' },
                { cat: 'TIPS', label: '🤝 Tips / Kurir', desc: 'Kurir, kebersihan' },
                { cat: 'PARKIR', label: '🅿️ Parkir', desc: 'Uang parkir kirim barang' },
                { cat: 'TRANSPORTASI', label: '🚚 Bensin', desc: 'Operational kurir' },
                { cat: 'LAINNYA', label: '📁 Lainnya', desc: 'Kegiatan mendadak' },
              ].map((item) => (
                <button
                  key={item.cat}
                  onClick={() => {
                    onCategorizeDraft(selectedDraft.id, item.cat as Category);
                    setSelectedDraft(null);
                  }}
                  className="p-3 bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-xl text-left transition-all active:scale-95 group text-sm font-semibold cursor-pointer"
                >
                  <p className="font-semibold text-on-surface group-hover:text-primary">
                    {item.label}
                  </p>
                  <p className="text-[10px] font-normal text-on-surface-variant mt-0.5">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setSelectedDraft(null)}
                className="w-full py-3 text-xs font-semibold bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface transition-colors cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
