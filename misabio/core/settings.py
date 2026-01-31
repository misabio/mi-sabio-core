import os

import yaml
from pydantic import BaseModel


class StartupSettings(BaseModel):
    wipe_data: bool = False


class StorageSettings(BaseModel):
    data_dir: str = "./.cognee"
    upload_dir: str = "./uploads"


class Settings(BaseModel):
    startup: StartupSettings = StartupSettings()
    storage: StorageSettings = StorageSettings()


def load_settings(config_path: str = "config.yaml") -> Settings:
    if os.path.exists(config_path):
        with open(config_path) as f:
            config_data = yaml.safe_load(f) or {}
        return Settings(**config_data)
    return Settings()


settings = load_settings()
