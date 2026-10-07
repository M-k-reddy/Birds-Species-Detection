# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package descriptors and install
COPY package*.json ./
RUN npm install

# Copy source and build static bundle
COPY public/ ./public/
COPY src/ ./src/
ENV PUBLIC_URL=/
RUN npm run build

# ==========================================
# Stage 2: Production Python Container
# ==========================================
FROM python:3.10-slim
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install CPU PyTorch & Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ ./backend/

# Copy compiled React frontend from Stage 1
COPY --from=frontend-builder /app/build ./build

# Pre-cache the AI models into container so runtime starts and detects instantly
RUN python -c "import sys; sys.path.append('backend'); from detect_bird_species import download_local_assets, get_local_classifier; download_local_assets(); get_local_classifier()"

# Set environment variables
ENV PORT=8080
ENV FRONTEND_DIR=/app/build
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

# Run Gunicorn with dynamic PORT expansion
CMD exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 4 --timeout 120 --chdir backend app:app
