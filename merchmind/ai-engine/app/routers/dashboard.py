from fastapi import APIRouter, Query
from typing import Optional
import random, math
from datetime import datetime, timedelta

router = APIRouter()

def gen_demand_trend(months: int = 12):
    base = 65000
    data = []
    for i in range(months):
        month = (datetime.now() - timedelta(days=30*(months-i))).strftime("%b")
        actual = int(base + random.gauss(0, 8000) + i * 1200)
        forecast = int(actual * random.uniform(0.95, 1.05))
        data.append({"month": month, "actual": actual, "forecast": forecast, "target": 80000})
    return data

@router.get("/kpis")
async def get_kpis():
    return {
        "wasteReduction": 30,
        "revenueLift": 25,
        "markdownAccuracy": 40,
        "marginImprovement": 18,
        "plannerTimeSaved": 60,
        "roiMonths": 18,
        "totalSavings": 5.7,
        "deadstockRate": round(random.uniform(7.5, 9.5), 1),
        "stockoutRate": round(random.uniform(4.5, 6.0), 1),
        "fullPriceSellThrough": random.randint(68, 76),
        "activeSKUs": 12847,
        "activeStores": 142,
        "lastUpdated": datetime.now().isoformat(),
    }

@router.get("/alerts")
async def get_alerts():
    return {
        "alerts": [
            {
                "id": "1", "type": "replenishment", "severity": "high",
                "sku": "SKU-902", "store": "Hub B", "confidence": 88,
                "message": "Stock aging exceeds 90-day threshold. Liquidation will free 12% capacity.",
                "action": "Approve 15% markdown",
            },
            {
                "id": "2", "type": "assortment", "severity": "medium",
                "sku": "SKU-445", "store": "Hub A → Hub B", "confidence": 92,
                "message": "Transfer 400 units — projected 18% increase in regional demand.",
                "action": "Transfer units",
            },
            {
                "id": "3", "type": "supply", "severity": "low",
                "sku": "SKU-234", "store": "Distribution", "confidence": 95,
                "message": "Divert shipments for Route X-44. Port congestion detected.",
                "action": "Reroute shipment",
            },
            {
                "id": "4", "type": "markdown", "severity": "high",
                "sku": "SKU-781", "store": "All Stores", "confidence": 84,
                "message": "Optimal markdown window opens Friday — consumer sensitivity peak.",
                "action": "Schedule 20% markdown",
            },
        ]
    }

@router.get("/demand-trend")
async def get_demand_trend(period: str = Query("6m")):
    months = {"3m": 3, "6m": 6, "12m": 12}.get(period, 6)
    return {"data": gen_demand_trend(months), "period": period}
