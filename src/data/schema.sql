-- ====================================================================
-- NAVIGO — PLATAFORMA INTELIGENTE DE TURISMO
-- Script DDL de Definição do Banco de Dados Relacional (PostgreSQL)
-- Elaborado para fins acadêmicos e arquiteturais (Curso ADS)
-- ====================================================================

-- 0. Limpeza prévia (Opcional para recriação limpa)
-- DROP TABLE IF EXISTS itinerary_items CASCADE;
-- DROP TABLE IF EXISTS itineraries CASCADE;
-- DROP TABLE IF EXISTS trip_preferences CASCADE;
-- DROP TABLE IF EXISTS trips CASCADE;
-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS attractions CASCADE;
-- DROP TABLE IF EXISTS destinations CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabela de Usuários (Users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Destinos (Destinations)
CREATE TABLE IF NOT EXISTS destinations (
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

-- 3. Tabela de Pontos Turísticos e Atrações (Attractions)
CREATE TABLE IF NOT EXISTS attractions (
    id SERIAL PRIMARY KEY,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'nature', 'beach', 'culture', 'gastronomy', 'adventure', 'nightlife'
    price_level VARCHAR(10) NOT NULL DEFAULT '$$', -- '$', '$$', '$$$', '$$$$'
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

-- 4. Tabela de Favoritos (Favorites - Relacionamento Polimórfico Seguro N:M)
CREATE TABLE IF NOT EXISTS favorites (
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
CREATE TABLE IF NOT EXISTS trips (
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

-- 6. Tabela de Interesses/Preferências da Viagem (Trip Preferences)
CREATE TABLE IF NOT EXISTS trip_preferences (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_trip_category UNIQUE (trip_id, category)
);

-- 7. Tabela de Dias do Itinerário (Itineraries)
CREATE TABLE IF NOT EXISTS itineraries (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_trip_day_number UNIQUE (trip_id, day_number)
);

-- 8. Tabela de Atividades do Roteiro (Itinerary Items)
CREATE TABLE IF NOT EXISTS itinerary_items (
    id SERIAL PRIMARY KEY,
    itinerary_id INTEGER NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE SET NULL,
    custom_title VARCHAR(150) NOT NULL,
    time_slot VARCHAR(10) NOT NULL, -- '09:00', '13:00', '19:30'
    item_order INTEGER NOT NULL CHECK (item_order >= 1),
    item_type VARCHAR(40) NOT NULL DEFAULT 'attraction', -- 'breakfast', 'attraction', 'lunch', 'activity', 'dinner'
    notes TEXT,
    estimated_cost NUMERIC(10,2) DEFAULT 0.00,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Índices de Alta Performance (Foreign Keys e Buscas Frequentes)
CREATE INDEX IF NOT EXISTS idx_destinations_city ON destinations(city);
CREATE INDEX IF NOT EXISTS idx_attractions_destination ON attractions(destination_id);
CREATE INDEX IF NOT EXISTS idx_attractions_category ON attractions(category);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip ON itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);
