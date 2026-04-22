// MerchMind MongoDB Collections — Event Streams & Recommendation Logs
// Run: mongosh merchmind < mongo_init.js

db = db.getSiblingDB('merchmind');

// POS Event Stream
db.createCollection('pos_events', {
  timeseries: { timeField: 'timestamp', metaField: 'storeId', granularity: 'seconds' }
});

// Recommendation Logs (explainable AI audit trail)
db.createCollection('recommendation_logs');
db.recommendation_logs.createIndex({ createdAt: -1 });
db.recommendation_logs.createIndex({ skuId: 1, type: 1 });

// Demand Signals (external: weather, events, social)
db.createCollection('demand_signals');
db.demand_signals.createIndex({ timestamp: -1 });
db.demand_signals.createIndex({ signalType: 1 });

// Agent Execution Logs
db.createCollection('agent_logs');
db.agent_logs.createIndex({ agentName: 1, createdAt: -1 });

// Seed sample POS event
db.pos_events.insertOne({
  timestamp: new Date(),
  storeId: 'store_01',
  skuId: 'SKU-1023',
  quantity: 2,
  unitPrice: 4999,
  channel: 'physical',
  eventType: 'sale'
});

// Seed sample recommendation log
db.recommendation_logs.insertOne({
  type: 'markdown',
  skuId: 'SKU-902',
  recommendation: { discount: 15, optimalDate: '2026-04-25' },
  rationale: 'Stock exceeds 90-day threshold. Friday event boosts traffic.',
  confidence: 0.88,
  agentSteps: ['ScannerAgent', 'ForecastAgent', 'ReasoningAgent'],
  modelVersion: 'LangGraph v0.1 + RL Policy v1.0',
  createdAt: new Date()
});

print('MongoDB collections initialized successfully');
