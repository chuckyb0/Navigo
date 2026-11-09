/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Servidor Express e API REST do Navigo (Node.js + TypeScript)
 * Implementa as rotas REST especificadas para a plataforma turística
 * e monta o middleware do Vite para o frontend React no ambiente de desenvolvimento.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// ==========================================
// DADOS EM MEMÓRIA (ESPELHO DO BANCO POSTGRESQL)
// ==========================================

const destinations = [
  {
    id: 1,
    name: 'Rio de Janeiro',
    country: 'Brasil',
    state: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    description: 'A Cidade Maravilhosa une praias icônicas e florestas tropicais.',
    rating: 4.9,
    latitude: -22.9068,
    longitude: -43.1729,
    averageDailyCost: 280
  },
  {
    id: 2,
    name: 'Foz do Iguaçu',
    country: 'Brasil',
    state: 'Paraná',
    city: 'Foz do Iguaçu',
    description: 'Lar de mais de 270 quedas d’água impressionantes.',
    rating: 4.95,
    latitude: -25.5469,
    longitude: -54.5882,
    averageDailyCost: 220
  },
  {
    id: 3,
    name: 'Salvador',
    country: 'Brasil',
    state: 'Bahia',
    city: 'Salvador',
    description: 'Centro histórico colonial barroco, tambores e culinária marcante.',
    rating: 4.82,
    latitude: -12.9777,
    longitude: -38.5016,
    averageDailyCost: 190
  },
  {
    id: 4,
    name: 'Gramado & Canela',
    country: 'Brasil',
    state: 'Rio Grande do Sul',
    city: 'Gramado',
    description: 'Charme alpino na Serra Gaúcha, fondues e chocolates artesanais.',
    rating: 4.88,
    latitude: -29.3788,
    longitude: -50.8735,
    averageDailyCost: 310
  }
];

const attractions = [
  {
    id: 101,
    destinationId: 1,
    name: 'Cristo Redentor',
    category: 'culture',
    priceLevel: '$$$',
    estimatedCost: 110,
    rating: 4.95,
    latitude: -22.9519,
    longitude: -43.2105
  },
  {
    id: 201,
    destinationId: 2,
    name: 'Cataratas do Iguaçu',
    category: 'nature',
    priceLevel: '$$$',
    estimatedCost: 95,
    rating: 4.98,
    latitude: -25.6953,
    longitude: -54.4367
  }
];

let favorites = [
  { id: 1, userId: 1, destinationId: 2 },
  { id: 2, userId: 1, attractionId: 201 }
];

let trips: any[] = [
  {
    id: 1,
    userId: 1,
    destinationId: 2,
    title: 'Aventura nas Cataratas & Selva',
    startDate: '2026-11-10',
    endDate: '2026-11-14',
    travelers: 2,
    budgetRange: 'moderate',
    travelProfile: 'couple',
    preferences: ['nature', 'adventure', 'gastronomy']
  }
];

// ==========================================
// ROTAS REST DA API NAVIGO
// ==========================================

// 1. Autenticação
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = {
    id: Date.now(),
    name: name || 'Novo Usuário',
    email: email || 'usuario@navigo.app',
    createdAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, token: `jwt_${Date.now()}`, user });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = {
    id: 1,
    name: 'Breno Domingues',
    email: email || 'dominguesbreno40@gmail.com',
    createdAt: new Date().toISOString()
  };
  res.json({ success: true, token: `jwt_${Date.now()}`, user });
});

// 2. Usuários
app.get('/api/users/me', (_req: Request, res: Response) => {
  res.json({
    id: 1,
    name: 'Breno Domingues',
    email: 'dominguesbreno40@gmail.com'
  });
});

app.put('/api/users/me', (req: Request, res: Response) => {
  const { name, email } = req.body;
  res.json({
    id: 1,
    name: name || 'Breno Domingues',
    email: email || 'dominguesbreno40@gmail.com',
    updatedAt: new Date().toISOString()
  });
});

// 3. Destinos
app.get('/api/destinations', (_req: Request, res: Response) => {
  res.json(destinations);
});

app.get('/api/destinations/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const dest = destinations.find(d => d.id === id);
  if (!dest) return res.status(404).json({ error: 'Destino não encontrado' });
  res.json(dest);
});

// 4. Atrações
app.get('/api/attractions', (req: Request, res: Response) => {
  const destId = req.query.destinationId ? parseInt(req.query.destinationId as string, 10) : undefined;
  if (destId) {
    return res.json(attractions.filter(a => a.destinationId === destId));
  }
  res.json(attractions);
});

app.get('/api/attractions/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const attr = attractions.find(a => a.id === id);
  if (!attr) return res.status(404).json({ error: 'Atração não encontrada' });
  res.json(attr);
});

// 5. Favoritos
app.get('/api/favorites', (_req: Request, res: Response) => {
  res.json(favorites);
});

app.post('/api/favorites', (req: Request, res: Response) => {
  const { destinationId, attractionId } = req.body;
  const newFav = {
    id: Date.now(),
    userId: 1,
    destinationId,
    attractionId
  };
  favorites.push(newFav);
  res.status(201).json(newFav);
});

app.delete('/api/favorites/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  favorites = favorites.filter(f => f.id !== id);
  res.json({ success: true, message: 'Favorito removido' });
});

// 6. Viagens
app.get('/api/trips', (_req: Request, res: Response) => {
  res.json(trips);
});

app.post('/api/trips', (req: Request, res: Response) => {
  const newTrip = {
    id: Date.now(),
    userId: 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  trips.push(newTrip);
  res.status(201).json(newTrip);
});

app.get('/api/trips/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const trip = trips.find(t => t.id === id);
  if (!trip) return res.status(404).json({ error: 'Viagem não encontrada' });
  res.json(trip);
});

app.delete('/api/trips/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  trips = trips.filter(t => t.id !== id);
  res.json({ success: true, message: 'Viagem excluída' });
});

// ==========================================
// INICIALIZAÇÃO VITE / EXPRESS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Navigo API & Frontend ativos na porta ${PORT}`);
  });
}

startServer();
