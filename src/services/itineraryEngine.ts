/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Motor de Geração de Roteiro Inteligente do Navigo
 * Aloca atrações por dia, calcula janelas de tempo, refeições típicas,
 * custos médios e notas práticas com base no perfil e orçamento.
 */

import { Destination, Attraction, Itinerary, ItineraryItem, BudgetRange, TravelProfile, CategoryType } from '../types';

interface GenerateItineraryParams {
  destination: Destination;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetRange: BudgetRange;
  travelProfile: TravelProfile;
  preferences: CategoryType[];
  availableAttractions: Attraction[];
}

export function generateSmartItinerary({
  destination,
  startDate,
  endDate,
  travelers,
  budgetRange,
  travelProfile,
  preferences,
  availableAttractions
}: GenerateItineraryParams): Itinerary[] {
  // 1. Calcular número de dias
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.min(10, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));

  // 2. Multiplicadores de orçamento para custos estimados
  const costMultiplier = budgetRange === 'economic' ? 0.75 : budgetRange === 'luxury' ? 1.6 : 1.0;

  // 3. Filtrar e classificar atrações
  // Priorizar atrações que correspondem aos interesses do viajante
  const prioritizedAttractions = [...availableAttractions].sort((a, b) => {
    const aMatch = preferences.includes(a.category) ? 2 : 0;
    const bMatch = preferences.includes(b.category) ? 2 : 0;
    return (bMatch + b.rating) - (aMatch + a.rating);
  });

  const itineraries: Itinerary[] = [];
  let attractionIndex = 0;

  // Refeições e pausas recomendadas de acordo com o destino
  const breakfastOptions = [
    { title: `Café da manhã tradicional em ${destination.city}`, cost: 35, note: 'Experimente frutas tropicais e pães de queijo artesanais.' },
    { title: 'Café matinal e padaria artesanal', cost: 40, note: 'Energia para começar a caminhada matinal.' },
    { title: 'Café especial com vista panorâmica', cost: 50, note: 'Ótima iluminação para fotos da manhã.' }
  ];

  const lunchOptions = [
    { title: `Almoço com gastronomia típica de ${destination.city}`, cost: 65, note: 'Prato tradicional com ingredientes locais frescos.' },
    { title: 'Almoço descontraído e culinária regional', cost: 55, note: 'Restaurante bem avaliado próximo às atrações do dia.' },
    { title: 'Bistrô charmoso no centro histórico', cost: 85, note: 'Opção aconchegante para recarregar as energias.' }
  ];

  const dinnerOptions = [
    { title: 'Jantar especial de boas-vindas', cost: 95, note: 'Ambiente acolhedor com música ambiente e drinks autorais.' },
    { title: 'Experiência gastronômica com chefs locais', cost: 120, note: 'Cardápio harmonizado perfeito para o encerramento do dia.' },
    { title: 'Jantar sob as estrelas e gastronomia de autor', cost: 110, note: 'Descontração e sabores marcantes da região.' }
  ];

  for (let dayNum = 1; dayNum <= diffDays; dayNum++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + (dayNum - 1));
    const dateStr = currentDate.toISOString().split('T')[0];

    const items: ItineraryItem[] = [];
    let order = 1;

    // Item 1: Café da Manhã (09:00)
    const bf = breakfastOptions[(dayNum - 1) % breakfastOptions.length];
    items.push({
      id: dayNum * 100 + order,
      itineraryId: dayNum,
      customTitle: bf.title,
      timeSlot: '09:00',
      itemOrder: order++,
      itemType: 'breakfast',
      estimatedCost: Math.round(bf.cost * costMultiplier * travelers),
      notes: bf.note,
      completed: false
    });

    // Item 2: Atração Principal da Manhã (10:30)
    if (prioritizedAttractions.length > 0) {
      const morningAttr = prioritizedAttractions[attractionIndex % prioritizedAttractions.length];
      attractionIndex++;

      items.push({
        id: dayNum * 100 + order,
        itineraryId: dayNum,
        attractionId: morningAttr.id,
        customTitle: morningAttr.name,
        timeSlot: '10:30',
        itemOrder: order++,
        itemType: 'attraction',
        estimatedCost: Math.round(morningAttr.estimatedCost * costMultiplier * travelers),
        notes: `Duração média: ${Math.round(morningAttr.estimatedDurationMin / 60)}h. Dica: Leve calçados confortáveis e água.`,
        completed: false,
        attraction: morningAttr
      });
    }

    // Item 3: Almoço (13:00)
    const lunch = lunchOptions[(dayNum - 1) % lunchOptions.length];
    items.push({
      id: dayNum * 100 + order,
      itineraryId: dayNum,
      customTitle: lunch.title,
      timeSlot: '13:00',
      itemOrder: order++,
      itemType: 'lunch',
      estimatedCost: Math.round(lunch.cost * costMultiplier * travelers),
      notes: lunch.note,
      completed: false
    });

    // Item 4: Atração da Tarde (15:00)
    if (prioritizedAttractions.length > 0) {
      const afternoonAttr = prioritizedAttractions[attractionIndex % prioritizedAttractions.length];
      attractionIndex++;

      items.push({
        id: dayNum * 100 + order,
        itineraryId: dayNum,
        attractionId: afternoonAttr.id,
        customTitle: afternoonAttr.name,
        timeSlot: '15:00',
        itemOrder: order++,
        itemType: 'attraction',
        estimatedCost: Math.round(afternoonAttr.estimatedCost * costMultiplier * travelers),
        notes: `Horário nobre de visitação. ${travelProfile === 'family' ? 'Excelente estrutura para famílias.' : 'Ótimo local para fotos e registros.'}`,
        completed: false,
        attraction: afternoonAttr
      });
    }

    // Item 5: Momento Pôr do Sol ou Lazer (17:30)
    items.push({
      id: dayNum * 100 + order,
      itineraryId: dayNum,
      customTitle: `Pôr do sol e contemplação em ${destination.name}`,
      timeSlot: '17:30',
      itemOrder: order++,
      itemType: 'leisure',
      estimatedCost: 0,
      notes: 'Momento de relaxamento, fotos do horizonte e pausa antes do jantar.',
      completed: false
    });

    // Item 6: Jantar ou Experiência Noturna (20:00)
    const dinner = dinnerOptions[(dayNum - 1) % dinnerOptions.length];
    items.push({
      id: dayNum * 100 + order,
      itineraryId: dayNum,
      customTitle: dinner.title,
      timeSlot: '20:00',
      itemOrder: order++,
      itemType: 'dinner',
      estimatedCost: Math.round(dinner.cost * costMultiplier * travelers),
      notes: dinner.note,
      completed: false
    });

    itineraries.push({
      id: dayNum,
      tripId: 1,
      dayNumber: dayNum,
      date: dateStr,
      items
    });
  }

  return itineraries;
}
