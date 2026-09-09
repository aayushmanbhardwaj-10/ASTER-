from fastapi import FastAPI

app = FastAPI(title="ASTER Intelligence API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "intelligence-api"}
