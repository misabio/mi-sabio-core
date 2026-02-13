# mi-sabio-core

The core application for the **Mi Sabio** knowledge management ecosystem. This repository contains the open-source single-user version of the platform, featuring a powerful Graph RAG engine and a modern web interface.

## Features

- **Knowledge Graph RAG**: Advanced retrieval-augmented generation powered by [Cognee](https://github.com/topoteretes/cognee).
- **Modern UI**: A responsive and accessible interface built with React, TypeScript, Tailwind CSS, and shadcn/ui.
- **FastAPI Backend**: High-performance Python backend using `uv` for dependency management.
- **Containerized**: Ready for deployment with Docker.

## Tech Stack

- **Backend**: Python 3.10+, FastAPI, Cognee, UV
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Infrastructure**: Docker

## Prerequisites

- [Python 3.10+](https://www.python.org/)
- [Node.js 20+](https://nodejs.org/)
- [uv](https://github.com/astral-sh/uv) (Python package manager)

## Getting Started

### 1. Installation

Initialize the backend environment and install frontend dependencies:

```bash
# Backend setup
make install

# Frontend setup
cd frontend
npm install
```

### 2. Development

To run the application locally, you will need two terminal sessions:

**Backend (Terminal 1):**
Starts the FastAPI server on `http://localhost:8000`
```bash
make backend
```

**Frontend (Terminal 2):**
Starts the Vite development server
```bash
make frontend
```

### 3. Docker

Build and run the full application (backend serving the frontend build):

```bash
# Build the image
docker build -t misabio-core .

# Run the container
docker run -p 8000:8000 misabio-core
```

Access the application at `http://localhost:8000`.

## Documentation

- **API Documentation**: Available at `/docs` (Swagger UI) when running the backend.
- **Project Documentation**: Run `make docs` to serve the MkDocs site.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the terms of the LICENSE file.
