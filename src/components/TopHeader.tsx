/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Database, Plus } from 'lucide-react';
import { User } from '../types';

interface TopHeaderProps {
  user: User | null;
  onOpenPlan: () => void;
  onOpenSqlModal: () => void;
  onOpenProfile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  onOpenPlan,
  onOpenSqlModal,
  onOpenProfile
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-4 h-14">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-base shadow-sm shadow-teal-600/30">
            N
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Navigo
            </span>
          </div>
        </div>

        {/* Zone 2: ADS Info Badge & Hub */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="italic text-slate-400">“Conectando pontos, criando memórias.”</span>
          <span aria-hidden="true">·</span>
          <button 
            onClick={onOpenSqlModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            title="Ver Script SQL e Arquitetura ADS"
          >
            <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Banco & Arquitetura (ADS)</span>
          </button>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSqlModal}
            className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Ver Script SQL e Arquitetura ADS"
          >
            <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </button>

          <button
            onClick={onOpenPlan}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg shadow-sm shadow-teal-600/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nova Viagem</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-teal-500 transition-all active:scale-95"
            title="Meu Perfil"
          >
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                {user?.name?.[0] || 'V'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
