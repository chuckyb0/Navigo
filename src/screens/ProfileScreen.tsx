/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Trip, Favorite } from '../types';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Settings, 
  Bell, 
  HelpCircle, 
  Info, 
  LogOut, 
  Database, 
  ChevronRight, 
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';

interface ProfileScreenProps {
  user: User | null;
  trips: Trip[];
  favoritesCount: number;
  onOpenTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: number) => void;
  onOpenNewTrip: () => void;
  onOpenSqlModal: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  trips,
  favoritesCount,
  onOpenTrip,
  onDeleteTrip,
  onOpenNewTrip,
  onOpenSqlModal,
  onOpenAuth,
  onLogout
}) => {
  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header do Usuário */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-500/30" 
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-black text-xl flex items-center justify-center">
                {user?.name?.[0] || 'V'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {user?.name || 'Viajante Navigo'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'viajante@navigo.app'}
            </p>
            <div className="text-[11px] font-medium text-teal-600 dark:text-teal-400 mt-1">
              Membro desde 2026 · ADS Edition
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
              {trips.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Viagens Planejadas</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
              {favoritesCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Itens Favoritados</div>
          </div>
        </div>
      </section>

      {/* 2. Minhas Viagens Cadastradas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-teal-600" />
            Minhas Viagens ({trips.length})
          </h2>
          <button
            onClick={onOpenNewTrip}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Viagem</span>
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500">
            Você ainda não criou viagens. Crie uma para começar a planejar seu roteiro!
          </div>
        ) : (
          <div className="space-y-2.5">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onOpenTrip(trip)}
                className="group p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 cursor-pointer hover:border-teal-500/50 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 transition-colors">
                      {trip.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{trip.startDate} a {trip.endDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{trip.travelers} {trip.travelers === 1 ? 'pessoa' : 'pessoas'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 active:scale-95 transition-all"
                    title="Excluir viagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Hub Acadêmico ADS — Banco & Arquitetura */}
      <section className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-teal-950 dark:text-teal-100">
              Banco Relacional & Arquitetura (ADS)
            </div>
            <div className="text-[11px] text-teal-800 dark:text-teal-300 mt-0.5">
              Visualize o script SQL PostgreSQL e o diagrama da API Node.js
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSqlModal}
          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0 transition-colors"
        >
          Visualizar
        </button>
      </section>

      {/* 4. Menu de Opções do Sistema */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <Bell className="w-4 h-4 text-slate-400" />
            <span>Notificações & Alertas de Viagem</span>
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Ativadas</span>
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Preferências de Viagem & Moeda (BRL)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Central de Ajuda & Dúvidas Frequentes</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Sobre o Navigo — Versão 1.0 (MVP)</span>
          </div>
          <span className="text-slate-400">v1.0.0</span>
        </div>
      </section>

      {/* 5. Ação de Logout ou Troca de Conta */}
      <section className="flex flex-col gap-2 pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta (Logout)</span>
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-2">
          Navigo · “Conectando pontos, criando memórias.”
        </p>
      </section>
    </div>
  );
};
