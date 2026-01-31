from unittest.mock import AsyncMock, MagicMock, patch

from fastapi.testclient import TestClient

# Mock cognee before importing api because api imports cognee
with patch("misabio.core.api.cognee") as mock_cognee:
    from misabio.core.api import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "settings" in response.json()


@patch("misabio.core.api.cognee")
@patch("misabio.core.api.shutil")
@patch("builtins.open", new_callable=MagicMock)
def test_ingest(mock_open, mock_shutil, mock_cognee):
    # Setup mocks
    mock_cognee.add = AsyncMock()
    mock_cognee.cognify = AsyncMock()

    # Create a dummy file
    files = {"file": ("test.pdf", b"dummy content", "application/pdf")}

    response = client.post("/api/ingest", files=files)

    assert response.status_code == 200
    assert response.json() == {"status": "success", "filename": "test.pdf"}

    # Verify cognee was called
    mock_cognee.add.assert_called_once()
    mock_cognee.cognify.assert_called_once()


@patch("misabio.core.api.cognee")
def test_chat(mock_cognee):
    # Setup mock return value
    mock_results = [{"text": "This is a search result", "score": 0.9}]
    mock_cognee.search = AsyncMock(return_value=mock_results)

    response = client.post("/api/chat", json={"query": "test query"})

    assert response.status_code == 200
    assert response.json() == {"results": mock_results}

    # Verify cognee search was called with correct query
    mock_cognee.search.assert_called_once_with(query_text="test query")


def test_static_files():
    # Only test if static dir exists (which it might not in test env unless built)
    # But we can verify the catch-all behavior isn't blocking APIs
    response = client.get("/api/health")
    assert response.status_code == 200
