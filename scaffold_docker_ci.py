import os

files = {
    "docker/Dockerfile": """# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src
RUN chmod +x mvnw
# Build
RUN ./mvnw package -DskipTests -B

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/glowcart-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
""",
    "docker-compose.yml": """version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: glowcart
      POSTGRES_USER: glowcart
      POSTGRES_PASSWORD: glowcart
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/glowcart
      SPRING_DATASOURCE_USERNAME: glowcart
      SPRING_DATASOURCE_PASSWORD: glowcart
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET:-dGhpcy1pcy1hLXZlcnktc2VjdXJlLWFuZC1sb25nLWp3dC1zZWNyZXQta2V5LXRoYXQtaXMtYXQtbGVhc3QtNjQtYnl0ZXMtbG9uZy1mb3ItaHM1MTI=}
    depends_on:
      - postgres
      - redis

volumes:
  pgdata:
""",
    ".github/workflows/ci.yml": """name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'maven'
      - name: Make mvnw executable
        run: chmod +x mvnw
      - name: Run tests
        run: ./mvnw verify -B

  build-and-push:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -f docker/Dockerfile -t glowcart:latest .
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Push to GHCR
        run: |
          docker tag glowcart:latest ghcr.io/${{ github.repository_owner }}/glowcart:latest
          docker tag glowcart:latest ghcr.io/${{ github.repository_owner }}/glowcart:${{ github.sha }}
          docker push ghcr.io/${{ github.repository_owner }}/glowcart:latest
          docker push ghcr.io/${{ github.repository_owner }}/glowcart:${{ github.sha }}
"""
}

for filepath, content in files.items():
    if os.path.dirname(filepath): os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
