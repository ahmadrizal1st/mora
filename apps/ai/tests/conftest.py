import pytest
from fastapi.testclient import TestClient
import os
import sys

# Add the apps/ocr directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from utils.config import settings

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def api_key():
    return settings.API_KEY

@pytest.fixture
def sample_path():
    return os.path.join(os.path.dirname(__file__), "samples")
