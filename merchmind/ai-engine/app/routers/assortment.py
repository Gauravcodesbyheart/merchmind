from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import numpy as np

router = APIRouter()

# ── Pydantic Models ──────────────────────────────────────────
class OptimizeRequest(BaseModel):
    region: Optional[str] = None
    category: Optional[str] = None
    min_score_threshold: Optional[int] = 50

class SKURecommendation(BaseModel):
    sku: str
    name: str
    category: str
    region: str
    score: int
    velocity: float
    stock: int
    action: str
    reason: str

# ── Simulated ML scoring function ───────────────────────────
def compute_assortment_score(sku_data: dict) -> int:
    """
    In production: uses XGBoost model trained on:
    - Historical sales velocity
    - Demand cluster assignments (K-means)
    - Seasonal trend coefficients (Prophet)
    - Price elasticity estimates
    - Competitor pricing signals
    """
    weights = {
        "sell_through": 0.30,
        "margin": 0.20,
        "velocity": 0.25,
        "availability": 0.15,
        "trend_fit": 0.10,
    }
    components = {
        "sell_through": random.uniform(40, 98),
        "margin": random.uniform(45, 95),
        "velocity": random.uniform(30, 99),
        "availability": random.uniform(55, 95),
        "trend_fit": random.uniform(40, 98),
    }
    score = sum(v * weights[k] for k, v in components.items())
    return int(score)

def get_action(score: int) -> tuple:
    if score >= 85:
        return "expand", "High velocity & strong margin. Increase depth to capture demand."
    elif score >= 70:
        return "hold", "Stable performance. Maintain current assortment depth."
    elif score >= 55:
        return "reduce", "Below-average velocity. Trim SKU count, focus on top variants."
    else:
        return "exit", "Poor sell-through & declining trend. Phase out this SKU."

SAMPLE_SKUS = [
    {"sku": "SKU-1023", "name": "Blue Denim Jacket L", "category": "Outerwear", "region": "North"},
    {"sku": "SKU-0774", "name": "White Sneakers US9", "category": "Footwear", "region": "South"},
    {"sku": "SKU-2201", "name": "Floral Midi Dress M", "category": "Apparel", "region": "East"},
    {"sku": "SKU-3340", "name": "Sports Joggers XL", "category": "Activewear", "region": "West"},
    {"sku": "SKU-0551", "name": "Linen Shirt S", "category": "Apparel", "region": "Online"},
    {"sku": "SKU-4412", "name": "Canvas Tote Bag", "category": "Accessories", "region": "North"},
    {"sku": "SKU-5501", "name": "Running Shorts M", "category": "Activewear", "region": "Online"},
    {"sku": "SKU-6678", "name": "Wool Cardigan L", "category": "Outerwear", "region": "South"},
]

@router.get("/recommendations")
async def get_recommendations(region: Optional[str] = None, category: Optional[str] = None):
    skus = SAMPLE_SKUS
    if region:
        skus = [s for s in skus if s["region"].lower() == region.lower()]
    if category:
        skus = [s for s in skus if s["category"].lower() == category.lower()]

    results = []
    for s in skus:
        score = compute_assortment_score(s)
        action, reason = get_action(score)
        results.append({
            **s,
            "score": score,
            "velocity": round(random.uniform(0.5, 6.5), 1),
            "stock": random.randint(15, 550),
            "action": action,
            "reason": reason,
        })
    results.sort(key=lambda x: x["score"], reverse=True)
    return {"recommendations": results, "total": len(results)}

@router.get("/score/{sku_id}")
async def get_sku_score(sku_id: str):
    sku = next((s for s in SAMPLE_SKUS if s["sku"] == sku_id), None)
    if not sku:
        raise HTTPException(status_code=404, detail=f"SKU {sku_id} not found")
    score = compute_assortment_score(sku)
    action, reason = get_action(score)
    components = {
        "sell_through": random.randint(50, 95),
        "margin": random.randint(45, 90),
        "velocity": random.randint(40, 99),
        "availability": random.randint(55, 95),
        "trend_fit": random.randint(45, 98),
    }
    return {**sku, "score": score, "action": action, "reason": reason, "components": components}

@router.post("/optimize")
async def run_optimizer(req: OptimizeRequest):
    """
    In production: triggers full XGBoost assortment optimization pipeline
    - Loads demand forecast from Prophet
    - Runs K-means cluster assignment per store region
    - Computes opportunity matrix
    - Returns ranked SKU action list
    """
    results = []
    for s in SAMPLE_SKUS:
        score = compute_assortment_score(s)
        if score >= req.min_score_threshold:
            action, reason = get_action(score)
            results.append({**s, "score": score, "action": action, "reason": reason})

    return {
        "status": "completed",
        "skus_analyzed": len(SAMPLE_SKUS),
        "recommendations": len(results),
        "results": results,
        "model": "XGBoost + Prophet Ensemble v1.0",
        "timestamp": "2026-04-22T10:00:00Z",
    }
