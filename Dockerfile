# Stage 1: Build Frontend
FROM node:20-slim AS build-frontend
WORKDIR /app/frontend

# Copy frontend source
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/packages ./packages

# Install dependencies
RUN npm install

# Create output directory structure (so Vite has somewhere to write)
RUN mkdir -p /app/misabio/core/static

# Build
RUN npm run build

# Stage 2: Final Python Image
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copy python dependency definitions
COPY uv.lock pyproject.toml ./

# Install dependencies (without project)
RUN uv sync --frozen --no-install-project

# Copy python source code
COPY misabio ./misabio
COPY config.yaml.example ./config.yaml
COPY README.md .

# Copy built frontend assets from Stage 1
# They were output to /app/misabio/core/static in the previous stage
COPY --from=build-frontend /app/misabio/core/static ./misabio/core/static

# Install project
RUN uv sync --frozen

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV COGNEE_ROOT_DIR=/app/.cognee

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["uv", "run", "uvicorn", "misabio.core.api:app", "--host", "0.0.0.0", "--port", "8000"]
