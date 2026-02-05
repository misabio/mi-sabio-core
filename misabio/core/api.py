import os
import shutil
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import cognee  # type: ignore[import-untyped]
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .settings import settings

# Ensure directories exist
os.makedirs(settings.storage.upload_dir, exist_ok=True)
os.makedirs(settings.storage.data_dir, exist_ok=True)

# TODO: Configure cognee storage path if supported via API or Env
# os.environ["COGNEE_ROOT_DIR"] = settings.storage.data_dir


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Startup logic
    if settings.startup.wipe_data:
        print("Wiping cognee data...")
        await cognee.prune.prune_data()
        await cognee.prune.prune_system(metadata=True)
    yield
    # Shutdown logic (if any)


app = FastAPI(lifespan=lifespan)

# CORS config
origins = [
    "http://localhost:3000",  # Vite dev server (default)
    "http://localhost:3001",  # Vite dev server (alt port)
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


class SearchResponse(BaseModel):
    answer: str


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {"status": "ok", "settings": settings.model_dump()}


@app.post("/api/ingest")
async def ingest_file(file: UploadFile = File(...)) -> dict[str, str]:  # noqa: B008
    try:
        filename = file.filename or "uploaded_file"
        file_path = os.path.join(settings.storage.upload_dir, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"Ingesting file: {file_path}")
        await cognee.add(file_path)
        await cognee.cognify()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    return {"status": "success", "filename": filename}


@app.post("/api/search")
async def search(request: SearchRequest) -> dict[str, Any]:
    try:
        print(f"Searching for: {request.query}")
        results = await cognee.search(query_text=request.query)
        # Cognee search results structure depends on the version/adapter.
        # Assuming list of results or similar.
        # For MVP returning the raw results or first result.

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    # Simple formatting if results is a list of objects/text
    return {"results": results}


# Static Files - Mount /ui to serve frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")


@app.get("/")
async def root() -> RedirectResponse:
    return RedirectResponse(url="/ui/")


if os.path.exists(static_dir):
    app.mount("/ui", StaticFiles(directory=static_dir, html=True), name="static")
