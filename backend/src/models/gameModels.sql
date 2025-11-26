-- Script SQL pour créer les tables du système Défi éducatif
-- À exécuter dans PostgreSQL si la synchronisation automatique ne fonctionne pas

-- Table des jeux
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) CHECK (status IN ('waiting', 'active', 'paused', 'finished')) NOT NULL DEFAULT 'waiting',
    current_player_turn VARCHAR(20),
    current_cycle INTEGER NOT NULL DEFAULT 1,
    deposit_amount DECIMAL(10, 2) NOT NULL DEFAULT 50000.00,
    jury_numero_h VARCHAR(20),
    created_by VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jury FOREIGN KEY (jury_numero_h) REFERENCES users(numero_h)
);

CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_jury ON games(jury_numero_h);

-- Table des joueurs
CREATE TABLE IF NOT EXISTS game_players (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    numero_h VARCHAR(20) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('player1', 'player2', 'guest')) NOT NULL DEFAULT 'guest',
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    debt_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_player_user FOREIGN KEY (numero_h) REFERENCES users(numero_h),
    CONSTRAINT unique_game_player UNIQUE (game_id, numero_h)
);

CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_players_numero_h ON game_players(numero_h);

-- Table des questions
CREATE TABLE IF NOT EXISTS game_questions (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    asked_by VARCHAR(20) NOT NULL,
    question_type VARCHAR(20) CHECK (question_type IN ('text', 'audio', 'video')) NOT NULL DEFAULT 'text',
    question_content TEXT NOT NULL,
    question_media_url VARCHAR(500),
    cycle_number INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'answered', 'validated', 'closed')) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_question_asker FOREIGN KEY (asked_by) REFERENCES users(numero_h)
);

CREATE INDEX IF NOT EXISTS idx_game_questions_game_id ON game_questions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_questions_asked_by ON game_questions(asked_by);
CREATE INDEX IF NOT EXISTS idx_game_questions_status ON game_questions(status);

-- Table des réponses
CREATE TABLE IF NOT EXISTS game_answers (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    numero_h VARCHAR(20) NOT NULL,
    answer_content TEXT,
    answer_type VARCHAR(20) CHECK (answer_type IN ('text', 'audio', 'video')),
    answer_media_url VARCHAR(500),
    is_voluntary_refusal BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) CHECK (status IN ('pending', 'validated_correct', 'validated_wrong', 'refused')) NOT NULL DEFAULT 'pending',
    points_earned DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    validated_at TIMESTAMP,
    validated_by VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES game_questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_player FOREIGN KEY (player_id) REFERENCES game_players(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_user FOREIGN KEY (numero_h) REFERENCES users(numero_h)
);

CREATE INDEX IF NOT EXISTS idx_game_answers_game_id ON game_answers(game_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_question_id ON game_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_player_id ON game_answers(player_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_status ON game_answers(status);

-- Table des dépôts
CREATE TABLE IF NOT EXISTS game_deposits (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL UNIQUE,
    initial_amount DECIMAL(10, 2) NOT NULL DEFAULT 50000.00,
    current_amount DECIMAL(10, 2) NOT NULL DEFAULT 50000.00,
    total_gains_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_penalties_received DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    last_recharge_by VARCHAR(20),
    last_recharge_date TIMESTAMP,
    last_recharge_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_deposit_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_deposit_recharger FOREIGN KEY (last_recharge_by) REFERENCES users(numero_h)
);

CREATE INDEX IF NOT EXISTS idx_game_deposits_game_id ON game_deposits(game_id);

-- Table des transactions
CREATE TABLE IF NOT EXISTS game_transactions (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    player_id INTEGER,
    answer_id INTEGER,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('gain', 'penalty', 'deposit_recharge', 'deposit_payment', 'voluntary_refusal')) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    player_balance_before DECIMAL(10, 2),
    player_balance_after DECIMAL(10, 2),
    deposit_amount_before DECIMAL(10, 2),
    deposit_amount_after DECIMAL(10, 2),
    description TEXT,
    validated_by VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_player FOREIGN KEY (player_id) REFERENCES game_players(id) ON DELETE SET NULL,
    CONSTRAINT fk_transaction_answer FOREIGN KEY (answer_id) REFERENCES game_answers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_game_transactions_game_id ON game_transactions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_transactions_player_id ON game_transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_game_transactions_type ON game_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_game_transactions_created_at ON game_transactions(created_at);

