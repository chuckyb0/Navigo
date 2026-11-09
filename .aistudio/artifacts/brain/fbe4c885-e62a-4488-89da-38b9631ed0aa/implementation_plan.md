# Navigo — Plataforma Inteligente de Turismo
> *“Conectando pontos, criando memórias.”*

Plano arquitetural e didático detalhado para o desenvolvimento do MVP da plataforma **Navigo**, estruturado para estudantes de Análise e Desenvolvimento de Sistemas (ADS), contemplando frontend mobile/web responsivo, API REST modular em Node.js com TypeScript e modelagem relacional completa para PostgreSQL.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas com o usuário na fase de alinhamento:**
> - **Visualização e Teste**: Experiência visual responsiva em tela cheia mobile e web, com suporte a viewport móvel nativo (touch ergonomics, bottom bar de 5 abas, safe areas) e expansão harmônica em telas maiores.
> - **Backend & Banco de Dados**: Backend Node.js com Express e TypeScript modular (Routes, Controllers, Services, Repositories), acompanhado de script DDL SQL completo para PostgreSQL com chaves estrangeiras, índices e integridade referencial.
> - **Geração de Roteiro no MVP**: Motor de itinerário por dias baseado nas restrições de orçamento, perfil de viajantes (Solo, Casal, Família, Amigos) e categorias de interesses (Natureza, Praia, Gastronomia, Cultura, Aventura, Vida Noturna), calculando timeline diária e estimativas.

---

## 1. Overview & Core Concept

### O que é o Navigo
O **Navigo** é uma plataforma digital que centraliza a descoberta de destinos turísticos, exploração de atrações e experiências gastronômicas/culturais, favoritos e geração de roteiros de viagem em uma interface unificada, evitando a fragmentação entre dezenas de sites e aplicativos.

### Público-Alvo e Contexto de Uso
- Viajantes em fase de inspiração (que ainda não decidiram o destino e buscam recomendações por categoria e popularidade).
- Viajantes com destino definido que precisam organizar cronogramas diários, horários, custos e visualização geográfica sem fricção.
- Estudantes e desenvolvedores que buscam um projeto modelo com arquitetura limpa em camadas (Clean Architecture / MVC-Service-Repository).

### Proposta de Valor
Eliminar o estresse do planejamento turístico ao unir:
1. Catálogo rico de destinos e atrações com fotos, filtros, avaliações e detalhes práticos.
2. Planejador inteligente de viagens com geração de roteiro cronológico por dias.
3. Mapa interativo com marcadores georreferenciados (latitude/longitude) preparado para integração de mapas externos.
4. Sistema de favoritos e perfil de viagem do usuário.

---

## 2. User Experience & Visual Design

### Fluxos Principais do Usuário
1. **Onboarding & Autenticação**:
   - Splash Screen com slogan e identidade visual.
   - Telas de Login e Cadastro com validação de campos, tokens JWT e recuperação de senha.
2. **Exploração (Home & Pesquisa)**:
   - Saudação personalizada (`"Olá, Viajante! 👋"`).
   - Busca em tempo real por cidades, países, atrações e categorias.
   - Categorias visuais: 🌿 Natureza, 🏖️ Praias, 🏛️ Cultura, 🍴 Gastronomia, 🧗 Aventura.
   - Carrossel de destinos em destaque e cards de atrações populares.
3. **Página de Detalhes do Destino / Atração**:
   - Imagens em alta definição, avaliação em estrelas, descrição informativa, atrações vinculadas e restaurantes próximos.
   - Ação rápida de favoritar (coração com feedback imediato) e botão principal *"Planejar Viagem"*.
4. **Planejador de Viagem**:
   - Seleção de destino, intervalo de datas (início/fim), número de viajantes, faixa de orçamento e perfil (Solo, Casal, Família, Amigos).
   - Seleção múltipla de interesses com tags táteis.
   - Ação: *"Criar meu roteiro"*.
5. **Roteiro & Timeline Diária**:
   - Visão em abas ou dias deslizantes (Dia 1, Dia 2, ...).
   - Timeline vertical com horários (Café da manhã, Atração 1, Almoço, Parque, Jantar).
   - Estimativas de transporte, tempo e custo médio.
6. **Mapa Interativo**:
   - Visualização dos pontos de interesse do destino ou do roteiro ativo com pins interativos e card inferior com detalhes rápidos.
7. **Favoritos e Perfil**:
   - Lista categorizada dos itens salvos e gerenciamento do perfil e histórico de viagens.

### Identidade Visual & Design System
- **Paleta de Cores**:
  - *Neutro dominante (60%)*: Fundo limpo em branco suave (`#FAFAFA`) e modo escuro em ardósia profunda (`#0B0F17`).
  - *Superfícies estruturais (30%)*: Cards em branco puro (`#FFFFFF`) / ardósia (`#151C28`), divisores de 1px sutis sem sombras pesadas.
  - *Acento intencional (10%)*: Azul Oceano e Laranja Terracota do viajante (`#0D9488` / `#0284C7` e acentos quentes `#F97316`) nos CTAs primários e marcadores ativos.
- **Tipografia**:
  - Títulos: *Plus Jakarta Sans* (moderna, geométrica, com alta legibilidade).
  - Corpo de texto: *Plus Jakarta Sans* / *DM Sans* com entrelinha relaxada (1.5–1.6) e números tabulares para custos e horários (`tabular-nums`).
- **Navegação & Ergonomia Mobile**:
  - Barra de navegação inferior fixa com 5 destinos: **Início | Explorar | Mapa | Salvos | Perfil**.
  - Hitbox mínima para toque de 44x44px.
  - Safe area para navegação móvel e suporte a layout expandido em desktop.

---

## 3. Escopo: MVP vs. Versões Futuras

| Módulo / Funcionalidade | MVP (Fase Atual) | Versões Futuras (Pós-MVP) |
| :--- | :--- | :--- |
| **Autenticação** | Login, Cadastro, Logout, Perfil do Usuário e persistência de sessão JWT | Login Social (Google/Apple), 2FA e biometria nativa |
| **Destinos e Atrações** | Consulta paginada, busca por texto, filtros por categoria e detalhes completos | Avaliações escritas por usuários e upload de fotos da comunidade |
| **Favoritos** | Salvar e remover destinos/atrações, visualização em abas | Criação de pastas/coleções personalizadas de favoritos |
| **Planejamento & Roteiro** | Criação de viagens, configuração de perfil/orçamento/interesses e geração de itinerário por dia | Reordenação via drag-and-drop de atrações e cálculo de rota viária em tempo real |
| **Mapa** | Visualização interativa com marcadores de atrações, cards contextuais e coordenadas reais | Integração de navegação GPS passo a passo (turn-by-turn) e rotas de transporte público |
| **Inteligência Artificial** | Algoritmo determinístico de alocação de roteiro por perfil, interesse e horários | Agente IA com Gemini API para consultoria personalizada em linguagem natural |
| **Exportação & Compartilhamento** | Resumo em texto/cópia de itinerário e salvamento local/nuvem | Exportação em PDF do roteiro completo e link de colaboração multiusuário |

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Comunicação do Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CAMADA DE CLIENTE (FRONTEND)                         │
│                                                                        │
│   React / React Native Mobile Architecture                             │
│   ├── Componentes Modulares (Views, Cards, Buttons, FormInputs)         │
│   ├── Context / Store (AuthContext, TripContext, FavoritesContext)     │
│   └── API Client Axios/Fetch com Interceptors de Token JWT             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Requisições HTTP REST (JSON)
                                    │ Headers: Authorization: Bearer <jwt>
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CAMADA DE SERVIDOR (BACKEND NODE.JS)                 │
│                                                                        │
│   Express REST API (TypeScript)                                        │
│   ├── Middlewares (Auth JWT, CORS, JSON Parser, Error Handler)         │
│   ├── Routes (/api/auth, /api/destinations, /api/trips, /api/itinerary)│
│   ├── Controllers (Extração de parâmetros, HTTP status, respostas)     │
│   ├── Services (Regras de negócio: geração de roteiro, hashes, regras) │
│   └── Repositories / Data Access Layer (Consultas e persistência)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Driver SQL (pg / pool)
                                    │ Queries parametrizadas ($1, $2)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CAMADA DE DADOS (POSTGRESQL RELACIONAL)              │
│                                                                        │
│   Tabelas Normalizadas:                                                │
│   ├── users (credenciais, perfis, timestamps)                          │
│   ├── destinations (cidades, países, imagens, coordenadas)             │
│   ├── attractions (pontos turísticos, categorias, preços, horários)    │
│   ├── favorites (relacionamento N:M usuário x destino/atração)         │
│   ├── trips (viagens criadas com datas, viajantes e orçamentos)        │
│   ├── trip_preferences (interesses selecionados da viagem)             │
│   └── itineraries & itinerary_items (dias e itens cronológicos)        │
└────────────────────────────────────────────────────────────────────────┘
```

### Explicação Didática da Comunicação (React Native ↔ Node.js ↔ PostgreSQL)

1. **Do Aplicativo (Frontend) para a API (Node.js)**:
   - O aplicativo dispara uma requisição HTTP assíncrona (usando `fetch` ou `axios`) para o servidor.
   - Exemplo: Ao salvar uma viagem, o frontend envia `POST /api/trips` com um corpo JSON e o token JWT no cabeçalho `Authorization: Bearer <token>`.
2. **Dentro do Backend Node.js**:
   - O **Middleware de Autenticação** valida a assinatura do JWT. Se válido, injeta o ID do usuário em `req.user`.
   - A **Rota** direciona para o **Controller**, que valida os dados recebidos (datas, números positivos, categorias válidas).
   - O **Service** executa a lógica de negócios: calcula quantos dias tem a viagem e aciona o gerador de itinerário.
   - O **Repository** conecta-se ao PostgreSQL através de um Pool de conexões.
3. **Do Backend para o PostgreSQL**:
   - O Node.js executa comandos SQL preparados como:
     `INSERT INTO trips (user_id, destination_id, start_date, end_date, travelers, budget, profile) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`
   - O PostgreSQL valida chaves estrangeiras (`FOREIGN KEY (destination_id) REFERENCES destinations(id)`), garantindo que não existam dados órfãos.
   - O banco devolve a linha recém-criada, o Node.js empacota em um JSON `{ success: true, data: trip }` com status HTTP 201 (Created), e o aplicativo atualiza a tela instantaneamente.

---

## 5. Modelo Relacional do Banco de Dados (PostgreSQL DDL)

```sql
-- 1. Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Destinos
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    country VARCHAR(80) NOT NULL,
    state VARCHAR(80),
    city VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.80,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Atrações e Experiências
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'nature', 'beach', 'culture', 'gastronomy', 'adventure', 'nightlife'
    price_level VARCHAR(10) NOT NULL DEFAULT '$$', -- '$', '$$', '$$$', '$$$$'
    estimated_cost NUMERIC(10,2) DEFAULT 0.00,
    rating NUMERIC(3,2) DEFAULT 4.70,
    image_url TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    estimated_duration_min INTEGER DEFAULT 120,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Favoritos (N:M)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_favorite_target CHECK (
        (destination_id IS NOT NULL AND attraction_id IS NULL) OR
        (destination_id IS NULL AND attraction_id IS NOT NULL)
    ),
    CONSTRAINT unique_user_destination UNIQUE (user_id, destination_id),
    CONSTRAINT unique_user_attraction UNIQUE (user_id, attraction_id)
);

-- 5. Tabela de Viagens
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
    title VARCHAR(150),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INTEGER NOT NULL DEFAULT 1,
    budget_range VARCHAR(50) NOT NULL, -- 'economic', 'moderate', 'luxury'
    travel_profile VARCHAR(50) NOT NULL, -- 'solo', 'couple', 'family', 'friends'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (end_date >= start_date)
);

-- 6. Tabela de Preferências da Viagem
CREATE TABLE trip_preferences (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela de Dias do Itinerário
CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_trip_day UNIQUE (trip_id, day_number)
);

-- 8. Tabela de Itens do Itinerário
CREATE TABLE itinerary_items (
    id SERIAL PRIMARY KEY,
    itinerary_id INTEGER NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE SET NULL,
    custom_title VARCHAR(150),
    time_slot TIME NOT NULL,
    item_order INTEGER NOT NULL,
    item_type VARCHAR(40) NOT NULL DEFAULT 'attraction', -- 'breakfast', 'attraction', 'lunch', 'activity', 'dinner'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de consultas comuns
CREATE INDEX idx_attractions_destination ON attractions(destination_id);
CREATE INDEX idx_attractions_category ON attractions(category);
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_itineraries_trip ON itineraries(trip_id);
CREATE INDEX idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);
```

---

## 6. Estrutura de Pastas Sugerida para o Projeto

```
navigo/
├── server/                        # Backend REST API em Node.js / Express
│   ├── src/
│   │   ├── config/                # Conexão com banco e variáveis de ambiente
│   │   │   └── database.ts
│   │   ├── controllers/           # Manipuladores de requisição e resposta HTTP
│   │   │   ├── authController.ts
│   │   │   ├── destinationController.ts
│   │   │   ├── tripController.ts
│   │   │   └── favoriteController.ts
│   │   ├── services/              # Regras de negócio e motor de roteiro
│   │   │   ├── authService.ts
│   │   │   ├── itineraryGeneratorService.ts
│   │   │   └── tripService.ts
│   │   ├── repositories/          # Comunicação com PostgreSQL / queries
│   │   │   ├── destinationRepository.ts
│   │   │   ├── tripRepository.ts
│   │   │   └── userRepository.ts
│   │   ├── middlewares/           # Autenticação JWT e tratamento de erros
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/                # Definição dos endpoints REST
│   │   │   ├── authRoutes.ts
│   │   │   ├── destinationRoutes.ts
│   │   │   ├── tripRoutes.ts
│   │   │   └── favoriteRoutes.ts
│   │   ├── data/                  # Script DDL SQL e dados semente (seed)
│   │   │   ├── schema.sql
│   │   │   └── seedData.ts
│   │   └── server.ts              # Ponto de entrada do servidor Express
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                        # Frontend React Native (ou React Web App Mobile-First)
│   ├── src/
│   │   ├── assets/                # Imagens de alta definição e ícones
│   │   ├── components/            # Componentes reutilizáveis
│   │   │   ├── BottomNav.tsx      # Barra inferior de 5 abas
│   │   │   ├── DestinationCard.tsx# Card com imagem, notas e local
│   │   │   ├── AttractionCard.tsx # Card de atração com preço e tempo
│   │   │   ├── TimelineItem.tsx   # Item da linha do tempo do roteiro
│   │   │   ├── InteractiveMap.tsx # Mapa com pins e coordenadas
│   │   │   └── SearchBar.tsx      # Barra de busca com filtros rápidos
│   │   ├── screens/               # Telas principais do fluxo
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── AuthScreen.tsx     # Login e Cadastro
│   │   │   ├── HomeScreen.tsx     # Destaques, categorias e atalhos
│   │   │   ├── ExploreScreen.tsx  # Busca e listagem com filtros
│   │   │   ├── DestinationDetailScreen.tsx
│   │   │   ├── PlanTripScreen.tsx # Wizard de planejamento da viagem
│   │   │   ├── ItineraryScreen.tsx# Visualização do roteiro cronológico
│   │   │   ├── MapScreen.tsx      # Tela de mapa completa
│   │   │   ├── SavedScreen.tsx    # Favoritos categorizados
│   │   │   └── ProfileScreen.tsx  # Perfil e histórico do usuário
│   │   ├── services/              # Cliente HTTP para a API Node.js
│   │   │   └── api.ts
│   │   ├── context/               # Gerenciamento de estado global
│   │   │   ├── AuthContext.tsx
│   │   │   └── TripContext.tsx
│   │   └── types/                 # Interfaces e tipagens TypeScript
│   │       └── index.ts
│   └── package.json
└── README.md                      # Documentação do projeto para ADS
```

---

## 7. Roadmap de Desenvolvimento Passo a Passo

1. **Etapa 1 — Fundações e Banco de Dados**:
   - Criação da estrutura de dados semente com destinos renomados (ex: Rio de Janeiro, Foz do Iguaçu, Salvador, Gramado, Florianópolis, São Paulo), atrações ricas em detalhes (Natureza, Praia, Gastronomia, Cultura, Aventura) e coordenadas geográficas reais.
   - Configuração do backend Express com endpoints REST completos e tipagem TypeScript.
2. **Etapa 2 — Motor de Itinerário & Negócios**:
   - Implementação do serviço de roteiro inteligente: calcula a duração em dias, distribui refeições típicas e atrações conforme os interesses selecionados e perfil da viagem, gerando horários realistas.
3. **Etapa 3 — Interface Visual & Navegação Mobile**:
   - Implementação da barra de navegação com 5 abas (**Início**, **Explorar**, **Mapa**, **Salvos**, **Perfil**).
   - Telas de Autenticação, Home vibrante e busca com filtros rápidos de categoria.
4. **Etapa 4 — Detalhes, Planejador & Timeline**:
   - Tela de destino detalhado com lista de atrações associadas.
   - Formulário de planejamento interativo em etapas amigáveis.
   - Visualização de itinerário com timeline dinâmica por dias, estimativas de custo e transporte.
5. **Etapa 5 — Mapa Interativo & Favoritos**:
   - Renderização dos marcadores geográficos das atrações com zoom contextual e card deslizante ao selecionar um ponto.
   - Gerenciamento de favoritos com persistência.
6. **Etapa 6 — Documentação Didática ADS & Validação**:
   - Fornecimento do script SQL exportável para uso no PostgreSQL local (pgAdmin / DBeaver) e guia de execução para apresentação acadêmica.
