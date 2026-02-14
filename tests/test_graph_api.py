from unittest.mock import AsyncMock, MagicMock, patch

from fastapi.testclient import TestClient

from misabio.core.api import app

client = TestClient(app)


@patch("misabio.core.api.get_graph_engine", new_callable=AsyncMock)
@patch("misabio.core.api.get_default_user", new_callable=AsyncMock)
@patch("misabio.core.api.get_datasets_by_name", new_callable=AsyncMock)
@patch("misabio.core.api.set_database_global_context_variables", new_callable=AsyncMock)
def test_get_graph_data(mock_set_globals, mock_get_datasets, mock_get_user, mock_get_graph_engine):
    # Mock user
    mock_user = MagicMock()
    mock_user.id = "user1"
    mock_get_user.return_value = mock_user

    # Mock dataset
    mock_dataset = MagicMock()
    mock_dataset.id = "dataset1"
    mock_get_datasets.return_value = [mock_dataset]

    # Mock engine
    mock_engine = AsyncMock()
    mock_get_graph_engine.return_value = mock_engine

    # Mock data
    mock_nodes = [
        ("node1", {"name": "Test Node 1", "type": "TestType", "custom_prop": "value1"}),
        ("node2", {"name": "Test Node 2", "type": "TestType"}),
    ]
    mock_edges = [("node1", "node2", "related_to")]
    mock_engine.get_graph_data.return_value = (mock_nodes, mock_edges)

    response = client.get("/api/graph/data")

    assert response.status_code == 200
    data = response.json()

    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) == 2
    assert len(data["edges"]) == 1

    # Verify context was set
    mock_get_user.assert_called_once()
    mock_get_datasets.assert_called_once_with("main_dataset", "user1")
    mock_set_globals.assert_called_once_with("dataset1", "user1")


@patch("misabio.core.api.get_graph_engine", new_callable=AsyncMock)
@patch("misabio.core.api.get_default_user", new_callable=AsyncMock)
@patch("misabio.core.api.get_datasets_by_name", new_callable=AsyncMock)
def test_get_graph_data_no_dataset(mock_get_datasets, mock_get_user, mock_get_graph_engine):
    mock_user = MagicMock()
    mock_user.id = "user1"
    mock_get_user.return_value = mock_user
    mock_get_datasets.return_value = []

    response = client.get("/api/graph/data")

    assert response.status_code == 200
    data = response.json()
    assert data["nodes"] == []
    assert data["edges"] == []


@patch("misabio.core.api.get_graph_engine", new_callable=AsyncMock)
@patch("misabio.core.api.get_default_user", new_callable=AsyncMock)
@patch("misabio.core.api.get_datasets_by_name", new_callable=AsyncMock)
@patch("misabio.core.api.set_database_global_context_variables", new_callable=AsyncMock)
def test_get_node_details(mock_set_globals, mock_get_datasets, mock_get_user, mock_get_graph_engine):
    mock_user = MagicMock()
    mock_user.id = "user1"
    mock_get_user.return_value = mock_user

    mock_dataset = MagicMock()
    mock_dataset.id = "dataset1"
    mock_get_datasets.return_value = [mock_dataset]

    mock_engine = AsyncMock()
    mock_get_graph_engine.return_value = mock_engine

    mock_node = {"id": "node1", "name": "Node 1"}
    mock_engine.get_node.return_value = mock_node

    response = client.get("/api/node/node1")

    assert response.status_code == 200
    assert response.json() == mock_node

    # Verify context was set
    mock_set_globals.assert_called_once_with("dataset1", "user1")
    mock_engine.get_node.assert_called_with("node1")


@patch("misabio.core.api.get_graph_engine", new_callable=AsyncMock)
@patch("misabio.core.api.get_default_user", new_callable=AsyncMock)
@patch("misabio.core.api.get_datasets_by_name", new_callable=AsyncMock)
def test_get_node_not_found(mock_get_datasets, mock_get_user, mock_get_graph_engine):
    mock_user = MagicMock()
    mock_get_user.return_value = mock_user
    mock_get_datasets.return_value = []  # Even if no dataset, it proceeds to check DB (which will likely be empty/fail, but here we mock engine)

    mock_engine = AsyncMock()
    mock_get_graph_engine.return_value = mock_engine
    mock_engine.get_node.return_value = None

    response = client.get("/api/node/nonexistent")

    assert response.status_code == 404
