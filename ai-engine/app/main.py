"""
MerchMind AI Engine — FastAPI
Microservices: Assortment, Replenishment, Markdown AI
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn
import logging

from app.routers import assortment, replenishment, markdown, dashboard, inventory, analytics
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("merchmind")

app = FastAPI(
    title="MerchMind AI Engine",
    description="AI-powered merchandising intelligence: assortment, replenishment & markdown optimization",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ─── Routers ────────────────────────────────────────────────────
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(assortment.router, prefix="/api/assortment", tags=["Assortment"])
app.include_router(replenishment.router, prefix="/api/replenishment", tags=["Replenishment"])
app.include_router(markdown.router, prefix="/api/markdown", tags=["Markdown"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "merchmind-ai-engine", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
