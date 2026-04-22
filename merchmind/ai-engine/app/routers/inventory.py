from fastapi import APIRouter
import random

# ── Inventory Router ─────────────────────────────────────────
router = APIRouter()

@router.get("/overview")
async def inventory_overview():
    return {
        "totalSKUs": 12847,
        "healthyPct": 68,
        "overstockPct": 22,
        "stockoutPct": 10,
        "totalValue": "₹48.2 Cr",
        "deadstockValue": "₹10.6 Cr",
        "channelBreakdown": {
            "inStore": 45,
            "online": 32,
            "marketplace": 23,
        },
    }

@router.get("/stock-levels")
async def stock_levels(category: str = None, region: str = None):
    data = [
        {"category": "Apparel", "healthy": 62, "overstock": 23, "stockout": 15},
        {"category": "Footwear", "healthy": 71, "overstock": 18, "stockout": 11},
        {"category": "Accessories", "healthy": 55, "overstock": 31, "stockout": 14},
        {"category": "Home & Living", "healthy": 78, "overstock": 15, "stockout": 7},
        {"category": "Electronics", "healthy": 69, "overstock": 12, "stockout": 19},
    ]
    if category:
        data = [d for d in data if d["category"].lower() == category.lower()]
    return {"data": data}

@router.get("/deadstock")
async def deadstock_report():
    items = [
        {"sku": "SKU-0551", "name": "Linen Shirt S", "days": 134, "units": 340, "value": "₹2.72L", "category": "Apparel", "risk": "critical"},
        {"sku": "SKU-6678", "name": "Wool Cardigan L", "days": 121, "units": 510, "value": "₹5.10L", "category": "Outerwear", "risk": "critical"},
        {"sku": "SKU-9923", "name": "Formal Trousers 32", "days": 108, "units": 220, "value": "₹3.30L", "category": "Apparel", "risk": "high"},
        {"sku": "SKU-4451", "name": "Patent Leather Heels", "days": 97, "units": 180, "value": "₹4.50L", "category": "Footwear", "risk": "high"},
        {"sku": "SKU-7712", "name": "Winter Gloves M", "days": 145, "units": 620, "value": "₹1.86L", "category": "Accessories", "risk": "critical"},
    ]
    return {"items": items, "total": len(items), "totalLockedValue": "₹17.48L"}
