.PHONY: up down build test

up:
	docker compose up -d

down:
	docker compose down

build:
	./mvnw clean package -DskipTests

test:
	./mvnw verify
