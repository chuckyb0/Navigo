/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modelos de dados e tipos TypeScript do Navigo
 * Estruturados para corresponder exatamente às entidades relacionais do PostgreSQL
 */

export type CategoryType = 
  | 'nature' 
  | 'beach' 
  | 'culture' 
  | 'gastronomy' 
  | 'adventure' 
  | 'nightlife' 
  | 'shopping' 
  | 'history';

export type TravelProfile = 'solo' | 'couple' | 'family' | 'friends';

export type BudgetRange = 'economic' | 'moderate' | 'luxury';

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  state?: string;
  city: string;
  description: string;
  imageUrl: string;
  rating: number;
  latitude: number;
  longitude: number;
  highlights: string[];
  bestTimeToVisit: string;
  averageDailyCost: number; // em BRL
  attractionCount: number;
}

export interface Attraction {
  id: number;
  destinationId: number;
  name: string;
  description: string;
  category: CategoryType;
  priceLevel: PriceLevel;
  estimatedCost: number; // em BRL
  rating: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  estimatedDurationMin: number;
  address?: string;
  openingHours?: string;
}

export interface Favorite {
  id: number;
  userId: number;
  destinationId?: number;
  attractionId?: number;
  createdAt: string;
}

export interface TripPreference {
  id?: number;
  tripId?: number;
  category: CategoryType;
}

export interface Trip {
  id: number;
  userId: number;
  destinationId: number;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  travelers: number;
  budgetRange: BudgetRange;
  travelProfile: TravelProfile;
  preferences: CategoryType[];
  createdAt: string;
  destination?: Destination;
  itineraryDays?: Itinerary[];
}

export interface ItineraryItem {
  id: number;
  itineraryId: number;
  attractionId?: number;
  customTitle: string;
  timeSlot: string; // "09:00", "13:00", etc.
  itemOrder: number;
  itemType: 'breakfast' | 'attraction' | 'lunch' | 'activity' | 'dinner' | 'leisure';
  notes?: string;
  estimatedCost: number;
  completed?: boolean;
  attraction?: Attraction;
}

export interface Itinerary {
  id: number;
  tripId: number;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  items: ItineraryItem[];
}
