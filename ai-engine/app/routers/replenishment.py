from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import random
from datetime import datetime, timedelta

router = APIRouter()

class ApproveRequest(BaseModel):
    notes: Optional[str] = None

QUEUE = [
    {"id": "R001", "sku": "SKU-1023", "name": "Blue Denim Jacket L", "store": "Store 12",
     "currentStock": 3, "reorderPoint": 10, "suggestedQty": 45, "urgency": "critical",
     "confidence": 96, "expectedSales": 52, "leadTimeDays": 3},
    {"id": "R002", "sku": "SKU-0774", "name": "White Sneakers US9", "store": "Store 07",
     "currentStock": 8, "reorderPoint": 15, "suggestedQty": 30, "urgency": "high",
     "confidence": 91, "expectedSales": 38, "leadTimeDays": 5},
    {"id": "R003", "sku": "SKU-2201", "name": "Floral Midi Dress M", "store": "Store 03",
     "currentStock": 12, "reorderPoint": 20, "suggestedQty": 25, "urgency": "medium",
     "confidence": 87, "expectedSales": 29, "leadTimeDays": 4},
    {"id": "R004", "sku": "SKU-3340", "name": "Sports Joggers XL", "store": "Store 19",
     "currentStock": 6, "reorderPoint": 12, "suggestedQty": 40, "urgency": "high",
     "confidence": 93, "expectedSales": 44, "leadTimeDays": 2},
    {"id": "R005", "sku": "SKU-0551", "name": "Linen Shirt S", "store": "Store 05",
     "currentStock": 18, "reorderPoint": 25, "suggestedQty": 20, "urgency": "medium",
     "confidence": 82, "expectedSales": 24, "leadTimeDays": 6},
]

def prophet_xgboost_forecast(sku_id: str, store_id: str) -> dict:
    """
    In production:
    1. Load Prophet model: generates trend + seasonality forecast
    2. XGBoost residual correction using contextual features
       (weather, events, price, competitor data)
    3. Ensemble with auto-weights updated weekly
    """
    base_demand = random.randint(20, 60)
    return {
        "sku": sku_id,
        "store": store_id,
        "forecastHorizonDays": 14,
        "predictedDemand": base_demand,
        "confidenceInterval": {
            "lower": int(base_demand * 0.85),
            "upper": int(base_demand * 1.15),
        },
        "seasonalityFactor": round(random.uniform(0.8, 1.3), 2),
        "trendDirection": random.choice(["up", "flat", "down"]),
        "externalSignals": {
            "weatherImpact": round(random.uniform(-0.1, 0.2), 2),
            "eventBoost": round(random.uniform(0, 0.35), 2),
            "competitorPriceSignal": round(random.uniform(-0.05, 0.1), 2),
        },
        "model": "Prophet + XGBoost Ensemble v1.0",
    }

@router.get("/queue")
async def get_queue():
    return {"queue": QUEUE, "total": len(QUEUE)}

@router.get("/forecast")
async def get_forecast(sku: str, store: str):
    return prophet_xgboost_forecast(sku, store)

@router.post("/approve/{order_id}")
async def approve_order(order_id: str, req: ApproveRequest):
    order = next((o for o in QUEUE if o["id"] == order_id), None)
    if not order:
        raise HTTPException(404, f"Order {order_id} not found")
    return {
        "status": "approved",
        "orderId": order_id,
        "sku": order["sku"],
        "qty": order["suggestedQty"],
        "store": order["store"],
        "estimatedDelivery": (datetime.now() + timedelta(days=order["leadTimeDays"])).date().isoformat(),
        "wmsSyncStatus": "queued",
        "notes": req.notes,
    }

@router.post("/run")
async def run_engine():
    """Triggers full replenishment engine run across all stores and SKUs"""
    new_orders = []
    for i in range(random.randint(18, 28)):
        new_orders.append({
            "orderId": f"AUTO-{1000 + i}",
            "sku": f"SKU-{random.randint(1000, 9999)}",
            "store": f"Store {random.randint(1, 50):02d}",
            "suggestedQty": random.randint(10, 80),
            "urgency": random.choice(["critical", "high", "medium"]),
            "confidence": random.randint(78, 97),
        })
    return {
        "status": "completed",
        "skusAnalyzed": 12847,
        "storesScanned": 142,
        "ordersGenerated": len(new_orders),
        "orders": new_orders,
        "modelVersion": "Prophet+XGBoost v1.0",
        "timestamp": datetime.now().isoformat(),
    }
