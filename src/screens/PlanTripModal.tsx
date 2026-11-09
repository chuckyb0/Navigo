/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Users, DollarSign, Compass, ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Destination, BudgetRange, TravelProfile, CategoryType } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  initialDestinationId?: number;
  onCreateTrip: (params: {
    destinationId: number;
    title: string;
    startDate: string;
    endDate: string;
    travelers: number;
    budgetRange: BudgetRange;
    travelProfile: TravelProfile;
    preferences: CategoryType[];
  }) => void;
}

export const PlanTripModal: React.FC<PlanTripModalProps> = ({
  isOpen,
  onClose,
  destinations,
  initialDestinationId,
  onCreateTrip
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number>(
    initialDestinationId || destinations[0]?.id || 1
  );
  const [tripTitle, setTripTitle] = useState('');
  
  // Datas padrão para testes amigáveis
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-14');
  const [travelers, setTravelers] = useState<number>(2);
  const [travelProfile, setTravelProfile] = useState<TravelProfile>('couple');
  const [budgetRange, setBudgetRange] = useState<BudgetRange>('moderate');
  const [selectedPreferences, setSelectedPreferences] = useState<CategoryType[]>([
    'nature',
    'gastronomy',
    'culture'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const currentDestination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];

  const profileOptions: { key: TravelProfile; label: string; desc: string; icon: string }[] = [
    { key: 'solo', label: 'Sozinho', desc: 'Liberdade total e autodescoberta', icon: '🎒' },
    { key: 'couple', label: 'Casal', desc: 'Romance, boa gastronomia e memórias', icon: '🥂' },
    { key: 'family', label: 'Família', desc: 'Atrações acessíveis para todas as idades', icon: '👨‍👩‍👧' },
    { key: 'friends', label: 'Amigos', desc: 'Aventura, agito e passeios em grupo', icon: '🎉' }
  ];

  const budgetOptions: { key: BudgetRange; label: string; desc: string; icon: string }[] = [
    { key: 'economic', label: 'Econômico', desc: 'Passeios gratuitos, transporte público e refeições acessíveis', icon: '🪙' },
    { key: 'moderate', label: 'Moderado', desc: 'Equilíbrio confortável entre experiências e atrações pagas', icon: '💳' },
    { key: 'luxury', label: 'Luxo', desc: 'Restaurantes de ponta, passeios exclusivos e máximo conforto', icon: '✨' }
  ];

  const interestOptions: { key: CategoryType; label: string; icon: string }[] = [
    { key: 'nature', label: 'Natureza', icon: '🌿' },
    { key: 'beach', label: 'Praia', icon: '🏖️' },
    { key: 'culture', label: 'Cultura', icon: '🏛️' },
    { key: 'gastronomy', label: 'Gastronomia', icon: '🍴' },
    { key: 'adventure', label: 'Aventura', icon: '🧗' },
    { key: 'nightlife', label: 'Vida Noturna', icon: '🌙' },
    { key: 'shopping', label: 'Compras', icon: '🛍️' },
    { key: 'history', label: 'História', icon: '📜' }
  ];

  const toggleInterest = (category: CategoryType) => {
    if (selectedPreferences.includes(category)) {
      if (selectedPreferences.length > 1) {
        setSelectedPreferences(selectedPreferences.filter(c => c !== category));
      }
    } else {
      setSelectedPreferences([...selectedPreferences, category]);
    }
  };

  const handleFinish = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onCreateTrip({
        destinationId: selectedDestinationId,
        title: tripTitle.trim() || `Roteiro ${currentDestination.city}`,
        startDate,
        endDate,
        travelers,
        budgetRange,
        travelProfile,
        preferences: selectedPreferences
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        {/* Header do Wizard */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Passo {step} de 3
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {step === 1 && 'Destino e Datas'}
              {step === 2 && 'Viajantes e Perfil'}
              {step === 3 && 'Orçamento e Interesses'}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div 
            className="bg-teal-600 h-1 transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Conteúdo dos Passos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* PASSO 1: Destino e Datas */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Seletor de Destino */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Para onde você vai viajar?
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {destinations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDestinationId(d.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedDestinationId === d.id
                          ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100 ring-1 ring-teal-600'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img 
                        src={d.imageUrl} 
                        alt={d.name} 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{d.city}</div>
                        <div className="text-[10px] text-slate-400 truncate">{d.state || d.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Título opcional da Viagem */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nome da Viagem (Opcional)
                </label>
                <input
                  type="text"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  placeholder={`Ex: Minha viagem inesquecível para ${currentDestination.city}`}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Datas de Início e Fim */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Data de Término
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: Viajantes e Perfil */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Quantidade de Viajantes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    Quantidade de Viajantes
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Impacta nas estimativas de custos de ingressos e refeições
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900 dark:text-white tabular-nums min-w-[20px] text-center">
                    {travelers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Perfil da Viagem */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Com quem você vai viajar?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {profileOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setTravelProfile(opt.key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        travelProfile === opt.key
                          ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100 ring-1 ring-teal-600'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{opt.icon}</div>
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: Orçamento e Interesses */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Faixa de Orçamento */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Faixa de Orçamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {budgetOptions.map((b) => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setBudgetRange(b.key)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        budgetRange === b.key
                          ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100 ring-1 ring-teal-600'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-base mb-0.5">{b.icon}</div>
                      <div className="text-xs font-bold">{b.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interesses Múltiplos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-teal-600" />
                    Interesses Principais
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {selectedPreferences.length} selecionados
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {interestOptions.map((opt) => {
                    const isSelected = selectedPreferences.includes(opt.key);
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleInterest(opt.key)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-1.5 transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-teal-500/50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resumo visual do Roteiro a ser criado */}
              <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  O Navigo vai cruzar as atrações de <strong>{currentDestination.city}</strong> com seus interesses ({selectedPreferences.join(', ')}), organizando horários matinais, pausas para almoço e passeios da tarde.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer do Wizard */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Avançar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isGenerating}
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Montando Roteiro...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Criar meu roteiro</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
