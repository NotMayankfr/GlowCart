# 🛒 GlowCart

A production-ready beauty e-commerce backend modeled after real-world scale problems, built with Java 21 and Spring Boot 3.

## Features
- **Auth**: JWT-based stateless authentication with `CUSTOMER` and `ADMIN` roles.
- **Catalog**: Products, categories, and brands. Filtered search and pagination.
- **Cart & Orders**: Shopping cart management. Single-transaction order placement with stock deduction.
- **Oversell Protection**: `@Version` optimistic locking in JPA ensures 0 negative stock during high-concurrency sale events.
- **Idempotency**: UUID-based idempotency keys prevent duplicate order creation on retries.
- **Order Lifecycle**: State machine (`CREATED` -> `PAID` -> `SHIPPED` / `CANCELLED`) with webhook simulation.
- **Caching & Rate Limiting**: Redis cache for product pages. Redis sliding-window rate limiter for order placement.
- **Quality**: OpenAPI/Swagger docs, global exception handling, Testcontainers for integration tests.

## Stack
- **Core**: Java 21, Spring Boot 3.2, Spring Data JPA
- **Database**: PostgreSQL (Neon.tech)
- **Cache/Limiting**: Redis (Upstash)
- **Delivery**: Docker, Docker Compose, GitHub Actions
- **Testing**: JUnit 5, Mockito, Testcontainers, k6

## Setup & Run Locally
1. Clone the repo.
2. `make up` to start PostgreSQL and Redis via Docker.
3. `./mvnw spring-boot:run` to start the app.
4. Visit `http://localhost:8080/swagger-ui.html` for API docs.

## The Oversell Concurrency Test
We simulate 200 concurrent buyers trying to purchase a product with only 10 units in stock.
- Exactly 10 orders succeed (Status: `CREATED`).
- 190 requests fail cleanly with HTTP 409 Conflict.
- Final stock is exactly `0`.
Run the test: `./mvnw test -Dtest=OversellIntegrationTest` (Or use the k6 script `k6/oversell-test.js`).

## Benchmarks (k6 Load Test)
(To be updated after running the load test)

| Metric              | Without Cache | With Cache |
|---------------------|---------------|------------|
| RPS (req/sec)       | ???           | ???        |
| p95 Latency         | ???           | ???        |
