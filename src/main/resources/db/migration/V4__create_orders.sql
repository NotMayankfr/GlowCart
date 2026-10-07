CREATE TABLE orders (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT         NOT NULL REFERENCES users(id),
    status           VARCHAR(20)    NOT NULL DEFAULT 'CREATED',
    total_amount     DECIMAL(10,2)  NOT NULL,
    idempotency_key  VARCHAR(255)   NOT NULL UNIQUE,
    payment_id       VARCHAR(255),
    shipping_address TEXT           NOT NULL,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_idemp  ON orders(idempotency_key);

CREATE TABLE order_items (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT        NOT NULL REFERENCES orders(id),
    product_id   BIGINT        NOT NULL REFERENCES products(id),
    product_name VARCHAR(255)  NOT NULL,
    quantity     INTEGER       NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);
