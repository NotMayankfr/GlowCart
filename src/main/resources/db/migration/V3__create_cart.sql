CREATE TABLE carts (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL UNIQUE REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
    id         BIGSERIAL PRIMARY KEY,
    cart_id    BIGINT  NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT  NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL CHECK (quantity >= 1),
    UNIQUE(cart_id, product_id)
);
