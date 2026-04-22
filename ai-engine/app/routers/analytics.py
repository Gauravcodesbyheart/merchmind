from fastapi import APIRouter, Query
import random

router = APIRouter()

@router.get("/sales")
async def get_sales(period: str = Query("6m")):
    months = {"3m": 3, "6m": 6, "12m": 12}.get(period, 6)
    labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    data = []
    for i in range(months):
        data.append({
            "month": labels[i % 12],
            "inStore": random.randint(3500, 5500),
            "online": random.randint(2800, 4500),
            "marketplace": random.randint(1200, 2500),
            "total": 0,
        })
        data[-1]["total"] = data[-1]["inStore"] + data[-1]["online"] + data[-1]["marketplace"]
    return {"data": data, "period": period}

@router.get("/waste")
async def get_waste():
    return {
        "deadstockReduction": [
            {"month": "Jan", "deadstock": 22, "target": 18},
            {"month": "Feb", "deadstock": 19, "target": 18},
            {"month": "Mar", "deadstock": 16, "target": 17},
            {"month": "Apr", "deadstock": 14, "target": 16},
            {"month": "May", "deadstock": 12, "target": 15},
            {"month": "Jun", "deadstock": 10, "target": 14},
        ],
        "esgAlignment": "UN SDG 12 — Responsible Consumption",
        "co2Saved": "14.2 tonnes",
        "wasteValueAvoided": "₹4.8 Cr",
    }

@router.get("/roi")
async def get_roi():
    return {
        "totalInvestment": 120000,
        "annualSavings": 5700000,
        "roi": "3x in 18 months",
        "breakdown": {
            "deadstockSavings": 2100000,
            "lostSalesRecovery": 1800000,
            "marginProtection": 1400000,
            "plannerEfficiency": 400000,
        },
        "monthlyData": [
            {"month": "Jan", "savings": 420, "investment": 95, "roi": 342},
            {"month": "Feb", "savings": 480, "investment": 95, "roi": 405},
            {"month": "Mar", "savings": 510, "investment": 95, "roi": 437},
            {"month": "Apr", "savings": 465, "investment": 95, "roi": 389},
            {"month": "May", "savings": 535, "investment": 95, "roi": 463},
            {"month": "Jun", "savings": 590, "investment": 95, "roi": 521},
        ],
    }
