import pytest
from unittest.mock import MagicMock, patch
from app.main import execute

@patch("app.main.SessionLocal")
@patch("app.main.exec_on_rail")
def test_execute_flow(mock_exec, mock_db_cls):
    # Mock DB
    mock_db = MagicMock()
    mock_db_cls.return_value = mock_db
    
    # Mock Execution
    mock_exec.return_value = {"success": True, "rail": "TEST_RAIL", "fees": 10, "backend_ref": "REF123"}
    
    tx = {"amount": 100, "currency": "USD", "type": "PAYMENT", "receiver": "user-1"}
    res = execute(tx, key="test-key", risk_score=95)
    
    assert res["tx_id"] is not None
    assert res["routed_rail"] == "TEST_RAIL"
    
    # Verify DB insert called
    # Note: Checking exact SQL alchemy call is complex, just checking commit is good enough for now
    mock_db.commit.assert_called_once()
    mock_db.close.assert_called_once()

@patch("app.main.SessionLocal")
@patch("app.main.exec_on_rail")
def test_execute_failure(mock_exec, mock_db_cls):
    mock_db = MagicMock()
    mock_db_cls.return_value = mock_db
    
    mock_exec.return_value = {"success": False, "error": "Rail down"}
    
    tx = {"amount": 100, "currency": "USD", "type": "PAYMENT"}
    res = execute(tx, key="test-key", risk_score=95)
    
    assert res["routed_rail"] is None
    mock_db.commit.assert_called_once()
