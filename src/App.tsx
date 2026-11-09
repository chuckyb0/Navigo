/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Navigo — Plataforma Inteligente de Turismo
 * “Conectando pontos, criando memórias.”
 */

import React, { useState, useEffect } from 'react';
import { api } from './services/apiClient';
import { User, Destination, Attraction, Trip, Favorite, CategoryType } from './types';
import { TopHeader } from './components/TopHeader';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { MapScreen } from './screens/MapScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ItineraryScreen } from './screens/ItineraryScreen';
import { DestinationDetailModal } from './screens/DestinationDetailModal';
import { PlanTripModal } from './screens/PlanTripModal';
import { AuthModal } from './screens/AuthModal';
import { SplashScreen } from './screens/SplashScreen';
import { SqlSchemaViewerModal } from './components/SqlSchemaViewerModal';
import { Calendar, Compass } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [viewingItinerary, setViewingItinerary] = useState<boolean>(false);

  // Dados centrais
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Parâmetros de pesquisa cruzada
  const [exploreQuery, setExploreQuery] = useState<string>('');
  const [exploreCategory, setExploreCategory] = useState<CategoryType | undefined>(undefined);

  // Estados dos Modais
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);
  const [planInitialDestId, setPlanInitialDestId] = useState<number | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Inicializar dados do cliente
  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);

    const dests = api.getDestinations();
    setDestinations(dests);

    const attrs = api.getAttractions();
    setAttractions(attrs);

    const userTrips = api.getTrips();
    setTrips(userTrips);
    if (userTrips.length > 0) {
      setActiveTrip(userTrips[0]);
    }

    const favs = api.getFavorites();
    setFavorites(favs);
  }, []);

  // Handlers de Favoritos
  const handleToggleFavoriteDestination = (destinationId: number) => {
    api.toggleFavoriteDestination(destinationId);
    setFavorites(api.getFavorites());
  };

  const handleToggleFavoriteAttraction = (attractionId: number) => {
    api.toggleFavoriteAttraction(attractionId);
    setFavorites(api.getFavorites());
  };

  const isDestinationFavorited = (id: number) => {
    return favorites.some(f => f.destinationId === id);
  };

  const isAttractionFavorited = (id: number) => {
    return favorites.some(f => f.attractionId === id);
  };

  // Handler de Criação de Viagem
  const handleCreateTrip = (params: any) => {
    const newTrip = api.createTrip(params);
    const updated = api.getTrips();
    setTrips(updated);
    setActiveTrip(newTrip);
    setViewingItinerary(true);
  };

  // Handler de Exclusão de Viagem
  const handleDeleteTrip = (tripId: number) => {
    api.deleteTrip(tripId);
    const updated = api.getTrips();
    setTrips(updated);
    if (activeTrip?.id === tripId) {
      setActiveTrip(updated[0] || null);
    }
  };

  // Handler de Item Concluído no Roteiro
  const handleToggleItemCompleted = (tripId: number, dayNumber: number, itemId: number) => {
    api.toggleItemCompleted(tripId, dayNumber, itemId);
    const updated = api.getTrips();
    setTrips(updated);
    if (activeTrip?.id === tripId) {
      const refreshed = updated.find(t => t.id === tripId);
      if (refreshed) setActiveTrip(refreshed);
    }
  };

  // Navegar para Explorar com termo pré-definido
  const handleOpenExploreWithFilter = (query?: string, category?: CategoryType) => {
    setExploreQuery(query || '');
    setExploreCategory(category);
    setViewingItinerary(false);
    setCurrentTab('explore');
  };

  const handleOpenPlanTripWithDest = (destinationId?: number) => {
    setPlanInitialDestId(destinationId);
    setIsPlanTripOpen(true);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-teal-500 selection:text-white">
      {/* Splash Screen (Primeira inicialização ou sob demanda) */}
      {showSplash && (
        <SplashScreen 
          onDismiss={() => setShowSplash(false)} 
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />
      )}

      {/* Top Bar Contract (Wordmark, ADS Hub, CTA) */}
      <TopHeader
        user={currentUser}
        onOpenPlan={() => handleOpenPlanTripWithDest()}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenProfile={() => {
          setViewingItinerary(false);
          setCurrentTab('profile');
        }}
      />

      {/* Barra de Acesso Rápido ao Roteiro Ativo (se houver) */}
      {activeTrip && (
        <div className="bg-teal-600 text-white text-xs px-4 py-2 border-b border-teal-700/60 transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-teal-200 animate-ping" />
              <span className="font-semibold truncate">
                Roteiro Ativo: {activeTrip.destination?.city} ({activeTrip.startDate})
              </span>
            </div>

            <button
              onClick={() => setViewingItinerary(!viewingItinerary)}
              className="px-2.5 py-1 rounded-lg bg-teal-800/80 hover:bg-teal-900 text-white font-bold text-[11px] whitespace-nowrap active:scale-95 transition-all"
            >
              {viewingItinerary ? 'Voltar para Navegação' : 'Abrir Linha do Tempo'}
            </button>
          </div>
        </div>
      )}

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        {viewingItinerary ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewingItinerary(false)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                ← Voltar às Abas Principais
              </button>
            </div>
            <ItineraryScreen
              trip={activeTrip}
              allTrips={trips}
              onSelectTrip={(t) => setActiveTrip(t)}
              onOpenNewTrip={() => handleOpenPlanTripWithDest()}
              onOpenMap={() => {
                setViewingItinerary(false);
                setCurrentTab('map');
              }}
              onToggleItemCompleted={handleToggleItemCompleted}
            />
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                user={currentUser}
                destinations={destinations}
                attractions={attractions}
                onSelectDestination={(d) => setSelectedDestination(d)}
                onSelectAttraction={(a) => setSelectedAttraction(a)}
                onOpenPlanTrip={handleOpenPlanTripWithDest}
                onOpenExplore={handleOpenExploreWithFilter}
                isDestinationFavorited={isDestinationFavorited}
                isAttractionFavorited={isAttractionFavorited}
                onToggleFavoriteDestination={handleToggleFavoriteDestination}
                onToggleFavoriteAttraction={handleToggleFavoriteAttraction}
              />
            )}

            {currentTab === 'explore' && (
              <ExploreScreen
                destinations={destinations}
                attractions={attractions}
                initialQuery={exploreQuery}
                initialCategory={exploreCategory}
                onSelectDestination={(d) => setSelectedDestination(d)}
                onSelectAttraction={(a) => setSelectedAttraction(a)}
                isDestinationFavorited={isDestinationFavorited}
                isAttractionFavorited={isAttractionFavorited}
                onToggleFavoriteDestination={handleToggleFavoriteDestination}
                onToggleFavoriteAttraction={handleToggleFavoriteAttraction}
              />
            )}

            {currentTab === 'map' && (
              <MapScreen
                destinations={destinations}
                attractions={attractions}
                activeTrip={activeTrip}
                onOpenAttraction={(a) => setSelectedAttraction(a)}
                onPlanTrip={handleOpenPlanTripWithDest}
              />
            )}

            {currentTab === 'saved' && (
              <SavedScreen
                destinations={destinations}
                attractions={attractions}
                favorites={favorites}
                onSelectDestination={(d) => setSelectedDestination(d)}
                onSelectAttraction={(a) => setSelectedAttraction(a)}
                onToggleFavoriteDestination={handleToggleFavoriteDestination}
                onToggleFavoriteAttraction={handleToggleFavoriteAttraction}
                onExploreMore={() => setCurrentTab('explore')}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                user={currentUser}
                trips={trips}
                favoritesCount={favorites.length}
                onOpenTrip={(t) => {
                  setActiveTrip(t);
                  setViewingItinerary(true);
                }}
                onDeleteTrip={handleDeleteTrip}
                onOpenNewTrip={() => handleOpenPlanTripWithDest()}
                onOpenSqlModal={() => setIsSqlModalOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar (5 abas mobile-first) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setViewingItinerary(false);
          setCurrentTab(tab);
        }}
        savedCount={favorites.length}
      />

      {/* Modal de Detalhes do Destino */}
      <DestinationDetailModal
        destination={selectedDestination}
        attractions={attractions}
        isOpen={!!selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onPlanTrip={handleOpenPlanTripWithDest}
        isFavorited={selectedDestination ? isDestinationFavorited(selectedDestination.id) : false}
        onToggleFavorite={() => selectedDestination && handleToggleFavoriteDestination(selectedDestination.id)}
        isAttractionFavorited={isAttractionFavorited}
        onToggleFavoriteAttraction={handleToggleFavoriteAttraction}
        onSelectAttraction={(attr) => setSelectedAttraction(attr)}
      />

      {/* Modal de Planejamento de Viagem (Wizard em 3 etapas) */}
      <PlanTripModal
        isOpen={isPlanTripOpen}
        onClose={() => setIsPlanTripOpen(false)}
        destinations={destinations}
        initialDestinationId={planInitialDestId}
        onCreateTrip={handleCreateTrip}
      />

      {/* Modal de Autenticação (Login / Cadastro / Recuperação) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* Modal Didático de Arquitetura & Banco PostgreSQL (ADS) */}
      <SqlSchemaViewerModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
