CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brands (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    logo_url    VARCHAR(512),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255)   NOT NULL,
    slug            VARCHAR(255)   NOT NULL UNIQUE,
    description     TEXT,
    price           DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
    stock_quantity  INTEGER        NOT NULL CHECK (stock_quantity >= 0),
    image_url       VARCHAR(512),
    category_id     BIGINT NOT NULL REFERENCES categories(id),
    brand_id        BIGINT NOT NULL REFERENCES brands(id),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    version         BIGINT  NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
