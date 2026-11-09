/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Camada de Acesso a Dados e API Client do Navigo
 * Gerencia persistência local reativa espelhando a API REST Node.js e banco relacional PostgreSQL.
 */

import { User, Destination, Attraction, Trip, Favorite, Itinerary, CategoryType, BudgetRange, TravelProfile } from '../types';
import { INITIAL_DESTINATIONS, INITIAL_ATTRACTIONS } from '../data/seedData';
import { generateSmartItinerary } from './itineraryEngine';

const STORAGE_KEYS = {
  USER: 'navigo_current_user',
  TOKEN: 'navigo_auth_token',
  FAVORITES: 'navigo_favorites',
  TRIPS: 'navigo_trips',
  SEARCH_HISTORY: 'navigo_search_history'
};

// Usuário padrão de demonstração para ADS
const DEFAULT_USER: User = {
  id: 1,
  name: 'Breno Domingues',
  email: 'dominguesbreno40@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  createdAt: '2026-10-30T06:00:00Z'
};

// Viagem de exemplo pré-carregada baseada na especificação do projeto
function createDefaultTrip(): Trip {
  const foz = INITIAL_DESTINATIONS.find(d => d.id === 2) || INITIAL_DESTINATIONS[1];
  const fozAttractions = INITIAL_ATTRACTIONS.filter(a => a.destinationId === 2);
  
  const itineraryDays = generateSmartItinerary({
    destination: foz,
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    travelers: 2,
    budgetRange: 'moderate',
    travelProfile: 'couple',
    preferences: ['nature', 'adventure', 'gastronomy'],
    availableAttractions: fozAttractions
  });

  return {
    id: 1,
    userId: 1,
    destinationId: 2,
    title: 'Aventura nas Cataratas & Selva',
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    travelers: 2,
    budgetRange: 'moderate',
    travelProfile: 'couple',
    preferences: ['nature', 'adventure', 'gastronomy'],
    createdAt: '2026-10-30T06:15:00Z',
    destination: foz,
    itineraryDays
  };
}

class ApiService {
  private destinations: Destination[] = INITIAL_DESTINATIONS;
  private attractions: Attraction[] = INITIAL_ATTRACTIONS;

  // --- AUTENTICAÇÃO ---
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      // Inicializar com usuário padrão para facilitar demonstração
      this.saveUserSession(DEFAULT_USER, 'navigo_jwt_sample_token_ads_2026');
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  saveUserSession(user: User, token: string) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  async login(email: string, _password: string): Promise<User> {
    // Simulação de chamada POST /api/auth/login
    await new Promise(r => setTimeout(r, 400));
    const user: User = {
      id: 1,
      name: email.split('@')[0].replace('.', ' '),
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString()
    };
    this.saveUserSession(user, `jwt_token_${Date.now()}`);
    return user;
  }

  async register(name: string, email: string, _password: string): Promise<User> {
    // Simulação de chamada POST /api/auth/register
    await new Promise(r => setTimeout(r, 500));
    const user: User = {
      id: Math.floor(Math.random() * 1000) + 2,
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };
    this.saveUserSession(user, `jwt_token_${Date.now()}`);
    return user;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // --- DESTINOS E ATRAÇÕES ---
  getDestinations(): Destination[] {
    return this.destinations;
  }

  getDestinationById(id: number): Destination | undefined {
    return this.destinations.find(d => d.id === id);
  }

  getAttractions(destinationId?: number): Attraction[] {
    if (destinationId) {
      return this.attractions.filter(a => a.destinationId === destinationId);
    }
    return this.attractions;
  }

  getAttractionById(id: number): Attraction | undefined {
    return this.attractions.find(a => a.id === id);
  }

  // --- HISTÓRICO DE BUSCAS ---
  getSearchHistory(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (!raw) return ['Cataratas do Iguaçu', 'Rio de Janeiro', 'Gastronomia', 'Praias'];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addSearchHistory(term: string) {
    if (!term.trim()) return;
    const history = this.getSearchHistory().filter(h => h.toLowerCase() !== term.toLowerCase());
    history.unshift(term.trim());
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history.slice(0, 8)));
  }

  // --- FAVORITOS ---
  getFavorites(): Favorite[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) {
      const initialFavs: Favorite[] = [
        { id: 1, userId: 1, destinationId: 2, createdAt: new Date().toISOString() },
        { id: 2, userId: 1, attractionId: 101, createdAt: new Date().toISOString() },
        { id: 3, userId: 1, attractionId: 201, createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(initialFavs));
      return initialFavs;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  toggleFavoriteDestination(destinationId: number): boolean {
    const favs = this.getFavorites();
    const existingIndex = favs.findIndex(f => f.destinationId === destinationId);
    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      return false; // removido
    } else {
      favs.push({
        id: Date.now(),
        userId: 1,
        destinationId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      return true; // adicionado
    }
  }

  toggleFavoriteAttraction(attractionId: number): boolean {
    const favs = this.getFavorites();
    const existingIndex = favs.findIndex(f => f.attractionId === attractionId);
    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      return false;
    } else {
      favs.push({
        id: Date.now(),
        userId: 1,
        attractionId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      return true;
    }
  }

  isDestinationFavorited(destinationId: number): boolean {
    return this.getFavorites().some(f => f.destinationId === destinationId);
  }

  isAttractionFavorited(attractionId: number): boolean {
    return this.getFavorites().some(f => f.attractionId === attractionId);
  }

  // --- VIAGENS E ITINERÁRIOS ---
  getTrips(): Trip[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (!raw) {
      const defaultTrip = createDefaultTrip();
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify([defaultTrip]));
      return [defaultTrip];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  getTripById(id: number): Trip | undefined {
    return this.getTrips().find(t => t.id === id);
  }

  createTrip(params: {
    destinationId: number;
    title: string;
    startDate: string;
    endDate: string;
    travelers: number;
    budgetRange: BudgetRange;
    travelProfile: TravelProfile;
    preferences: CategoryType[];
  }): Trip {
    const destination = this.getDestinationById(params.destinationId)!;
    const availableAttractions = this.getAttractions(params.destinationId);

    const itineraryDays = generateSmartItinerary({
      destination,
      startDate: params.startDate,
      endDate: params.endDate,
      travelers: params.travelers,
      budgetRange: params.budgetRange,
      travelProfile: params.travelProfile,
      preferences: params.preferences,
      availableAttractions
    });

    const newTrip: Trip = {
      id: Date.now(),
      userId: 1,
      destinationId: params.destinationId,
      title: params.title || `Viagem para ${destination.city}`,
      startDate: params.startDate,
      endDate: params.endDate,
      travelers: params.travelers,
      budgetRange: params.budgetRange,
      travelProfile: params.travelProfile,
      preferences: params.preferences,
      createdAt: new Date().toISOString(),
      destination,
      itineraryDays
    };

    const trips = this.getTrips();
    trips.unshift(newTrip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return newTrip;
  }

  deleteTrip(tripId: number) {
    const trips = this.getTrips().filter(t => t.id !== tripId);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  }

  toggleItemCompleted(tripId: number, dayNumber: number, itemId: number): boolean {
    const trips = this.getTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.itineraryDays) return false;

    const day = trip.itineraryDays.find(d => d.dayNumber === dayNumber);
    if (!day) return false;

    const item = day.items.find(i => i.id === itemId);
    if (!item) return false;

    item.completed = !item.completed;
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return item.completed;
  }
}

export const api = new ApiService();
