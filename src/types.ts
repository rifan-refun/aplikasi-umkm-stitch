/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  note: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  type: 'manual' | 'voice' | 'sms';
}

export interface DraftTransaction {
  id: string;
  note: string;
  amount: number;
  type: 'voice' | 'manual' | 'sms';
  date: string;
  voiceUrl?: string;
  duration?: string;
}

export type Category = 'MAKANAN' | 'LISTRIK' | 'STOK' | 'LAINNYA' | 'TIPS' | 'PARKIR' | 'TRANSPORTASI' | 'LAIN_LAIN';

export interface SMEConfig {
  morningCash: number;
  businessName: string;
  ownerName: string;
}
