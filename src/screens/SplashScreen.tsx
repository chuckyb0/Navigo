/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, ArrowRight, MapPin, Database } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
  onOpenSqlModal: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss, onOpenSqlModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950 text-white animate-in fade-in duration-300">
      {/* Top Tag */}
      <div className="w-full flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-widest uppercase text-teal-400">
          Mobile Tourism Platform
        </div>
        <button
          onClick={onOpenSqlModal}
          className="text-xs text-slate-300 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-teal-400" />
          <span>Ver SQL & Arquitetura</span>
        </button>
      </div>

      {/* Central Brand Identity */}
      <div className="text-center space-y-4 max-w-sm my-auto">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-teal-500 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-teal-500/40 mx-auto">
            N
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shadow-md">
            <Compass className="w-4 h-4 animate-spin [animation-duration:8s]" />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Navigo
          </h1>
          <p className="text-sm sm:text-base font-medium text-teal-200/90 italic">
            “Conectando pontos, criando memórias.”
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          Descubra destinos fascinantes, encontre atrações e restaurantes e organize seu roteiro completo em uma única plataforma.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={onDismiss}
          className="w-full h-13 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30 transition-all"
        >
          <span>Começar a Explorar</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Versão MVP funcional · Projeto ADS 2026
        </p>
      </div>
    </div>
  );
};
