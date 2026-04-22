from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import random
from datetime import datetime, date, timedelta

router = APIRouter()

class ApproveMarkdownRequest(BaseModel):
    discount: float
    notes: Optional[str] = None

class AgentRunRequest(BaseModel):
    sku_ids: Optional[List[str]] = None
    max_discount_pct: Optional[float] = 35.0

MARKDOWN_RECS = [
    {
        "id": "M001", "sku": "SKU-902", "name": "Checked Blazer - M",
        "category": "Outerwear", "daysOnShelf": 98,
        "currentPrice": 4999, "suggestedDiscount": 15, "newPrice": 4249,
        "stockUnits": 234, "projectedSellThrough": 88, "marginImpact": -12,
        "confidence": 88, "optimalDate": "2026-04-25",
        "rationale": "Stock exceeds 90-day threshold with declining velocity. Friday event traffic optimizes sell-through.",
    },
    {
        "id": "M002", "sku": "SKU-781", "name": "Summer Floral Top XS/S",
        "category": "Tops", "daysOnShelf": 67,
        "currentPrice": 1299, "suggestedDiscount": 20, "newPrice": 1039,
        "stockUnits": 512, "projectedSellThrough": 94, "marginImpact": -8,
        "confidence": 84, "optimalDate": "2026-04-26",
        "rationale": "Consumer price sensitivity peaks this weekend. Event-aware model predicts 40% uplift.",
    },
    {
        "id": "M003", "sku": "SKU-445", "name": "Woolen Scarf Bundle",
        "category": "Accessories", "daysOnShelf": 121,
        "currentPrice": 799, "suggestedDiscount": 30, "newPrice": 559,
        "stockUnits": 876, "projectedSellThrough": 79, "marginImpact": -18,
        "confidence": 91, "optimalDate": "2026-04-27",
        "rationale": "Seasonal transition imminent. Deep discount before summer prevents full deadstock loss.",
    },
]

def langgraph_markdown_agent_steps(sku_ids: Optional[List[str]] = None) -> List[dict]:
    """
    Simulates LangGraph multi-step agentic reasoning.
    
    In production, this uses:
    - LangGraph StateGraph with conditional edges
    - LangChain tools: demand_forecast_tool, competitor_price_tool, event_calendar_tool
    - RL policy network for discount depth optimization
    - Explainability layer: SHAP values → plain English rationale
    """
    steps = [
        {"step": 1, "agent": "ScannerAgent", "action": "Scanning SKUs for aging patterns",
         "result": f"Found {len(MARKDOWN_RECS)} SKUs exceeding threshold", "status": "done"},
        {"step": 2, "agent": "ForecastAgent", "action": "Loading Prophet demand forecasts",
         "result": "14-day rolling forecast loaded for all flagged SKUs", "status": "done"},
        {"step": 3, "agent": "ExternalSignalAgent", "action": "Fetching weather, events, competitor prices",
         "result": "Weekend foot traffic +22%, no competitor markdown detected", "status": "done"},
        {"step": 4, "agent": "ReasoningAgent", "action": "LangGraph Step 1 — Classify urgency tiers",
         "result": "Tier 1: 1 critical, Tier 2: 1 high, Tier 3: 1 medium", "status": "done"},
        {"step": 5, "agent": "ReasoningAgent", "action": "LangGraph Step 2 — Compute optimal discount depth via RL policy",
         "result": "Discounts: 15%, 20%, 30% — margin floor respected", "status": "done"},
        {"step": 6, "agent": "ReasoningAgent", "action": "LangGraph Step 3 — Identify inflection timing window",
         "result": "Optimal dates: Apr 25–27 based on traffic + price elasticity", "status": "done"},
        {"step": 7, "agent": "ExplainabilityAgent", "action": "Generating plain-English rationale via SHAP",
         "result": "Rationale generated for each recommendation", "status": "done"},
        {"step": 8, "agent": "AuditAgent", "action": "Logging to compliance audit trail",
         "result": "3 recommendations logged with full decision provenance", "status": "done"},
    ]
    return steps

@router.get("/schedule")
async def get_schedule():
    scheduled = [
        {**r, "status": "scheduled" if r["id"] == "M001" else "pending"}
        for r in MARKDOWN_RECS
    ]
    return {"schedule": scheduled, "total": len(scheduled)}

@router.get("/recommendations")
async def get_recommendations():
    return {"recommendations": MARKDOWN_RECS, "total": len(MARKDOWN_RECS)}

@router.post("/approve/{markdown_id}")
async def approve_markdown(markdown_id: str, req: ApproveMarkdownRequest):
    rec = next((r for r in MARKDOWN_RECS if r["id"] == markdown_id), None)
    if not rec:
        raise HTTPException(404, f"Markdown recommendation {markdown_id} not found")
    new_price = int(rec["currentPrice"] * (1 - req.discount / 100))
    return {
        "status": "approved",
        "markdownId": markdown_id,
        "sku": rec["sku"],
        "discountApplied": req.discount,
        "newPrice": new_price,
        "scheduledDate": rec["optimalDate"],
        "projectedSellThrough": rec["projectedSellThrough"],
        "ecommerceSyncStatus": "queued",
        "posSyncStatus": "queued",
        "notes": req.notes,
    }

@router.post("/agent/run")
async def run_markdown_agent(req: AgentRunRequest):
    steps = langgraph_markdown_agent_steps(req.sku_ids)
    return {
        "status": "completed",
        "agentFramework": "LangGraph 0.1 + LangChain",
        "stepsExecuted": len(steps),
        "steps": steps,
        "recommendations": MARKDOWN_RECS,
        "totalRecommendations": len(MARKDOWN_RECS),
        "timestamp": datetime.now().isoformat(),
        "model": "RL Markdown Policy v1.0 + SHAP Explainability",
    }
