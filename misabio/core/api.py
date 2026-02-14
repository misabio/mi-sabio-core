import os
import shutil
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import cognee  # type: ignore[import-untyped]
from cognee.context_global_variables import set_database_global_context_variables  # type: ignore[import-untyped]
from cognee.infrastructure.databases.graph import get_graph_engine  # type: ignore[import-untyped]
from cognee.modules.data.methods import get_datasets_by_name  # type: ignore[import-untyped]
from cognee.modules.users.methods import get_default_user  # type: ignore[import-untyped]
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


@app.get("/api/graph/data")
async def get_graph_data() -> dict[str, Any]:
    try:
        # Setup context for the default user and main_dataset
        user = await get_default_user()
        datasets = await get_datasets_by_name("main_dataset", user.id)

        if not datasets:
            return {"nodes": [], "edges": []}

        dataset = datasets[0]
        await set_database_global_context_variables(dataset.id, user.id)

        graph_engine = await get_graph_engine()
        graph_data = await graph_engine.get_graph_data()

        # Check if graph_data is empty or None
        if not graph_data:
            return {"nodes": [], "edges": []}

        nodes, edges = graph_data

        formatted_nodes = []
        for node in nodes:
            # node is typically (id, properties_dict)
            node_id = str(node[0])
            props = node[1] if len(node) > 1 else {}

            # Extract label/name if available, fallback to ID/Type
            label = props.get("name", props.get("label", node_id))
            node_type = props.get("type", "Unknown")

            formatted_nodes.append({
                "id": node_id,
                "label": label,
                "type": node_type,
                "properties": {k: v for k, v in props.items() if k not in ["id", "type", "name", "label"]},
            })

        formatted_edges = []
        for edge in edges:
            # edge is typically (source_id, target_id, relationship_type, properties)
            # Adjust based on actual cognee return structure observed in exploration: (source, target, label)
            source = str(edge[0])
            target = str(edge[1])
            label = str(edge[2]) if len(edge) > 2 else "related"

            formatted_edges.append({"source": source, "target": target, "label": label})

    except Exception as e:
        print(f"Error fetching graph data: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e

    return {"nodes": formatted_nodes, "edges": formatted_edges}


@app.get("/api/node/{node_id}")
async def get_node_details(node_id: str) -> dict[str, Any]:
    try:
        # Setup context for the default user and main_dataset
        user = await get_default_user()
        datasets = await get_datasets_by_name("main_dataset", user.id)

        if datasets:
            dataset = datasets[0]
            await set_database_global_context_variables(dataset.id, user.id)

        graph_engine = await get_graph_engine()
        node = await graph_engine.get_node(node_id)

    except Exception as e:
        print(f"Error fetching node details: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e

    if not node:
        raise HTTPException(status_code=404, detail="Node not found")

    return node  # type: ignore[no-any-return]


# Static Files - Mount /ui to serve frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")


@app.get("/")
async def root() -> RedirectResponse:
    return RedirectResponse(url="/ui/")


if os.path.exists(static_dir):
    app.mount("/ui", StaticFiles(directory=static_dir, html=True), name="static")
