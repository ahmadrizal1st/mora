from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "AI Service"
    API_KEY: str = "your-secret-api-key"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
