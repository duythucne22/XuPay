# XuPay User Service - Makefile
# All common development commands in one place
# Usage: make <target>

.PHONY: help build test run clean docker-build docker-run api-test

# Default target - show help
help:
	@echo "=========================================="
	@echo "XuPay User Service - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Build & Compile:"
	@echo "  make compile        - Compile source code only"
	@echo "  make build          - Full build (compile + package JAR)"
	@echo "  make clean          - Clean target directory"
	@echo "  make rebuild        - Clean + build"
	@echo ""
	@echo "Testing:"
	@echo "  make test           - Run all unit tests"
	@echo "  make test-unit      - Run unit tests only"
	@echo "  make test-coverage  - Run tests with coverage report"
	@echo "  make api-test       - Run API integration tests (PowerShell)"
	@echo ""
	@echo "Run:"
	@echo "  make run            - Run application (port 8081)"
	@echo "  make run-jar        - Run packaged JAR file"
	@echo "  make run-debug      - Run with debug mode (port 5005)"
	@echo ""
	@echo "Database:"
	@echo "  make db-start       - Start PostgreSQL container"
	@echo "  make db-stop        - Stop PostgreSQL container"
	@echo "  make db-reset       - Reset database (drop + recreate)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make docker-stop    - Stop Docker container"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs           - Open Swagger UI in browser"
	@echo "  make health         - Check service health"
	@echo ""

# ==================== BUILD TARGETS ====================

compile:
	@echo "🔨 Compiling source code..."
	mvn compile -DskipTests

build:
	@echo "📦 Building JAR package..."
	mvn clean package -DskipTests

clean:
	@echo "🧹 Cleaning target directory..."
	mvn clean

rebuild: clean build
	@echo "✅ Rebuild complete!"

# ==================== TEST TARGETS ====================

test:
	@echo "🧪 Running all tests..."
	mvn test

test-unit:
	@echo "🧪 Running unit tests..."
	mvn test -Dtest="*Test"

test-coverage:
	@echo "📊 Running tests with coverage..."
	mvn clean test jacoco:report
	@echo "Coverage report: target/site/jacoco/index.html"

api-test:
	@echo "🌐 Running API integration tests..."
	@powershell -ExecutionPolicy Bypass -File test-user-api.ps1

# ==================== RUN TARGETS ====================

run:
	@echo "🚀 Starting User Service on port 8081..."
	mvn spring-boot:run

run-jar:
	@echo "🚀 Running JAR file..."
	java -jar target/user-service-1.0.0.jar

run-debug:
	@echo "🐛 Starting with debug mode (port 5005)..."
	mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# ==================== DATABASE TARGETS ====================

db-start:
	@echo "🐘 Starting PostgreSQL..."
	cd ../../../ && docker-compose up -d postgres

db-stop:
	@echo "🛑 Stopping PostgreSQL..."
	cd ../../../ && docker-compose stop postgres

db-reset:
	@echo "♻️ Resetting database..."
	@powershell -ExecutionPolicy Bypass -File reset-db.ps1

# ==================== DOCKER TARGETS ====================

docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t xupay/user-service:latest .

docker-run:
	@echo "🐳 Running Docker container..."
	docker run -d -p 8081:8081 -p 9091:9091 \
		--name user-service \
		-e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/user_db \
		-e SPRING_DATASOURCE_USERNAME=xupay_user \
		-e SPRING_DATASOURCE_PASSWORD=xupay_password \
		xupay/user-service:latest

docker-stop:
	@echo "🛑 Stopping Docker container..."
	docker stop user-service
	docker rm user-service

# ==================== DOCUMENTATION TARGETS ====================

docs:
	@echo "📚 Opening Swagger UI..."
	@powershell -Command "Start-Process 'http://localhost:8081/swagger-ui.html'"

health:
	@echo "💓 Checking service health..."
	@curl -s http://localhost:8081/health | jq . || echo "Service not running or jq not installed"

# ==================== UTILITY TARGETS ====================

logs:
	@echo "📜 Tailing application logs..."
	@tail -f logs/user-service.log

install-deps:
	@echo "📥 Installing dependencies..."
	mvn dependency:resolve

update-deps:
	@echo "🔄 Updating dependencies..."
	mvn versions:display-dependency-updates

format:
	@echo "✨ Formatting code..."
	mvn spotless:apply

check-style:
	@echo "🔍 Checking code style..."
	mvn checkstyle:check

# ==================== QUICK COMMANDS ====================

# Quick development workflow
dev: db-start build run
	@echo "🚀 Development environment ready!"

# Full test cycle
verify: clean build test api-test
	@echo "✅ All verifications passed!"

# Production readiness check
prod-ready: clean test-coverage docker-build
	@echo "🎯 Production-ready build complete!"
