/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hub Didático de Arquitetura e Banco de Dados (ADS)
 * Apresenta o script DDL PostgreSQL completo, modelo entidade-relacionamento
 * e o fluxo de comunicação entre React Native, API Node.js e PostgreSQL.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Database, Server, Smartphone, BookOpen, Layers } from 'lucide-react';

interface SqlSchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POSTGRES_DDL = `-- ====================================================================
-- NAVIGO — PLATAFORMA INTELIGENTE DE TURISMO
-- Script DDL de Definição do Banco de Dados Relacional (PostgreSQL)
-- Disciplina: Banco de Dados / Análise e Desenvolvimento de Sistemas (ADS)
-- ====================================================================

-- 1. Tabela de Usuários (Users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Destinos (Destinations)
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    country VARCHAR(80) NOT NULL DEFAULT 'Brasil',
    state VARCHAR(80),
    city VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.80 CHECK (rating >= 0 AND rating <= 5.0),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    average_daily_cost NUMERIC(10,2) DEFAULT 250.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Atrações e Experiências (Attractions)
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'nature', 'beach', 'culture', 'gastronomy', 'adventure'
    price_level VARCHAR(10) NOT NULL DEFAULT '$$',
    estimated_cost NUMERIC(10,2) DEFAULT 0.00,
    rating NUMERIC(3,2) DEFAULT 4.70 CHECK (rating >= 0 AND rating <= 5.0),
    image_url TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    estimated_duration_min INTEGER DEFAULT 120,
    address TEXT,
    opening_hours VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Favoritos (Favorites - Relacionamento Polimórfico Seguro)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_single_favorite_target CHECK (
        (destination_id IS NOT NULL AND attraction_id IS NULL) OR
        (destination_id IS NULL AND attraction_id IS NOT NULL)
    ),
    CONSTRAINT unique_user_fav_destination UNIQUE (user_id, destination_id),
    CONSTRAINT unique_user_fav_attraction UNIQUE (user_id, attraction_id)
);

-- 5. Tabela de Viagens (Trips)
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INTEGER NOT NULL DEFAULT 1 CHECK (travelers >= 1),
    budget_range VARCHAR(50) NOT NULL, -- 'economic', 'moderate', 'luxury'
    travel_profile VARCHAR(50) NOT NULL, -- 'solo', 'couple', 'family', 'friends'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_trip_dates CHECK (end_date >= start_date)
);

-- 6. Tabela de Preferências da Viagem (Trip Preferences)
CREATE TABLE trip_preferences (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_trip_category UNIQUE (trip_id, category)
);

-- 7. Tabela de Dias do Itinerário (Itineraries)
CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_trip_day_number UNIQUE (trip_id, day_number)
);

-- 8. Tabela de Atividades do Roteiro (Itinerary Items)
CREATE TABLE itinerary_items (
    id SERIAL PRIMARY KEY,
    itinerary_id INTEGER NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE SET NULL,
    custom_title VARCHAR(150) NOT NULL,
    time_slot VARCHAR(10) NOT NULL,
    item_order INTEGER NOT NULL CHECK (item_order >= 1),
    item_type VARCHAR(40) NOT NULL DEFAULT 'attraction',
    notes TEXT,
    estimated_cost NUMERIC(10,2) DEFAULT 0.00,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Alta Performance
CREATE INDEX idx_destinations_city ON destinations(city);
CREATE INDEX idx_attractions_destination ON attractions(destination_id);
CREATE INDEX idx_attractions_category ON attractions(category);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_itineraries_trip ON itineraries(trip_id);
CREATE INDEX idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);`;

export const SqlSchemaViewerModal: React.FC<SqlSchemaViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'architecture' | 'tables'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRES_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Arquitetura & Banco de Dados (ADS)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modelo Relacional PostgreSQL e Comunicação da Aplicação Navigo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Script SQL (PostgreSQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Fluxo de Comunicação</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Entidades & Relacionamentos</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm">
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Script DDL compatível com PostgreSQL 14+, pgAdmin, DBeaver e Supabase.</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-100 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
                <pre>{POSTGRES_DDL}</pre>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
                <h4 className="font-bold text-teal-900 dark:text-teal-200 mb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Como o React Native, o Node.js e o PostgreSQL se comunicam?
                </h4>
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  Esta é a arquitetura padrão da indústria para sistemas web/mobile desacoplados (Client-Server Architecture).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 text-xs">
                    <Smartphone className="w-4 h-4 text-teal-600" />
                    1. Aplicativo Mobile
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Construído em <strong>React Native</strong> com TypeScript. Dispara requisições HTTP REST (GET, POST, PUT, DELETE) com cabeçalho <code>Authorization: Bearer &lt;JWT&gt;</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 text-xs">
                    <Server className="w-4 h-4 text-amber-600" />
                    2. API REST Node.js
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Servidor <strong>Express</strong> modular. Valida token JWT via Middleware, trata regras de negócio em Services e sanitiza entradas para evitar SQL Injection.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 text-xs">
                    <Database className="w-4 h-4 text-blue-600" />
                    3. Banco PostgreSQL
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Banco relacional ACID. Garante integridade referencial via <code>FOREIGN KEY</code> e <code>ON DELETE CASCADE</code>, executando consultas através de um Connection Pool.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
                <h5 className="font-bold text-slate-900 dark:text-white mb-2 text-xs">
                  Exemplo de Ciclo de Vida: Criação de Viagem com Roteiro
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>O usuário preenche o formulário: Destino, 2 viajantes, perfil Casal, orçamento moderado.</li>
                  <li>O React Native faz: <code>POST /api/trips</code> com payload JSON.</li>
                  <li>O Node.js valida o JWT e chama o <code>itineraryEngine.ts</code> para calcular os horários por dia.</li>
                  <li>O Repository executa uma transação SQL: insere em <code>trips</code>, <code>itineraries</code> e <code>itinerary_items</code>.</li>
                  <li>O banco confirma o commit e o Node.js responde com status <code>201 Created</code> com o objeto completo.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-3">
              {[
                { name: 'users', desc: 'Usuários cadastrados, credenciais com hash bcrypt e data de criação.', pk: 'id', fks: 'Nenhuma' },
                { name: 'destinations', desc: 'Cidades turísticas, coordenadas geográficas (lat/lng), média de custos diários e fotos.', pk: 'id', fks: 'Nenhuma' },
                { name: 'attractions', desc: 'Pontos turísticos, parques, praias e restaurantes vinculados a um destino com categoria e preço.', pk: 'id', fks: 'destination_id -> destinations(id)' },
                { name: 'favorites', desc: 'Tabela associativa N:M que armazena destinos ou atrações favoritados por cada usuário.', pk: 'id', fks: 'user_id, destination_id, attraction_id' },
                { name: 'trips', desc: 'Viagens planejadas com intervalo de datas, quantidade de viajantes, faixa de orçamento e perfil.', pk: 'id', fks: 'user_id -> users(id), destination_id -> destinations(id)' },
                { name: 'trip_preferences', desc: 'Categorias de interesse selecionadas para a viagem (Natureza, Praia, Gastronomia, etc.).', pk: 'id', fks: 'trip_id -> trips(id)' },
                { name: 'itineraries', desc: 'Dias individuais que compõem o cronograma de uma viagem (Dia 1, Dia 2, ...).', pk: 'id', fks: 'trip_id -> trips(id)' },
                { name: 'itinerary_items', desc: 'Atividades agendadas em cada dia (horário, tipo de atividade, notas e custo estimado).', pk: 'id', fks: 'itinerary_id -> itineraries(id), attraction_id -> attractions(id)' }
              ].map((tbl) => (
                <div key={tbl.name} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs">
                      TABLE {tbl.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">PK: {tbl.pk}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-1.5">{tbl.desc}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Chaves Estrangeiras: <span className="text-slate-700 dark:text-slate-300">{tbl.fks}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Navigo · Material Educacional ADS</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
