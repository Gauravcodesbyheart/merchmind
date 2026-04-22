// Mock data used when backend is not available (demo mode)

export const mockKPIs = {
  wasteReduction: 30,
  revenueLift: 25,
  markdownAccuracy: 40,
  marginImprovement: 18,
  plannerTimeSaved: 60,
  roiMonths: 18,
  totalSavings: 5.7,
  deadstockRate: 8.4,
  stockoutRate: 5.1,
  fullPriceSellThrough: 72,
}

export const mockAlerts = [
  {
    id: '1',
    type: 'replenishment',
    severity: 'high',
    sku: 'SKU-902',
    message: 'Stock aging exceeds 90-day threshold. Liquidation will free up 12% capacity.',
    confidence: 88,
    action: 'Approve 15% markdown',
    store: 'Hub B',
  },
  {
    id: '2',
    type: 'assortment',
    severity: 'medium',
    sku: 'SKU-445',
    message: 'Transfer 400 units from Hub A — projected 18% increase in regional demand.',
    confidence: 92,
    action: 'Transfer units',
    store: 'Hub A → Hub B',
  },
  {
    id: '3',
    type: 'supply',
    severity: 'low',
    sku: 'SKU-234',
    message: 'Divert shipments for Route X-44. Port congestion detected.',
    confidence: 95,
    action: 'Reroute shipment',
    store: 'Distribution',
  },
  {
    id: '4',
    type: 'markdown',
    severity: 'high',
    sku: 'SKU-781',
    message: 'Optimal markdown window opens Friday — consumer price sensitivity peak.',
    confidence: 84,
    action: 'Schedule 20% markdown',
    store: 'All Stores',
  },
]

export const mockDemandTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  actual: Math.floor(Math.random() * 40000) + 60000,
  forecast: Math.floor(Math.random() * 35000) + 62000,
  target: 80000,
}))

export const mockReplenishmentQueue = [
  {
    id: 'R001', sku: 'SKU-1023', name: 'Blue Denim Jacket - L',
    store: 'Store 12', currentStock: 3, reorderPoint: 10,
    suggestedQty: 45, urgency: 'critical', confidence: 96,
    expectedSales: 52, leadTimeDays: 3,
  },
  {
    id: 'R002', sku: 'SKU-0774', name: 'White Sneakers - US9',
    store: 'Store 07', currentStock: 8, reorderPoint: 15,
    suggestedQty: 30, urgency: 'high', confidence: 91,
    expectedSales: 38, leadTimeDays: 5,
  },
  {
    id: 'R003', sku: 'SKU-2201', name: 'Floral Midi Dress - M',
    store: 'Store 03', currentStock: 12, reorderPoint: 20,
    suggestedQty: 25, urgency: 'medium', confidence: 87,
    expectedSales: 29, leadTimeDays: 4,
  },
  {
    id: 'R004', sku: 'SKU-3340', name: 'Sports Joggers - XL',
    store: 'Store 19', currentStock: 6, reorderPoint: 12,
    suggestedQty: 40, urgency: 'high', confidence: 93,
    expectedSales: 44, leadTimeDays: 2,
  },
  {
    id: 'R005', sku: 'SKU-0551', name: 'Linen Shirt - S',
    store: 'Store 05', currentStock: 18, reorderPoint: 25,
    suggestedQty: 20, urgency: 'medium', confidence: 82,
    expectedSales: 24, leadTimeDays: 6,
  },
]

export const mockMarkdownRecommendations = [
  {
    id: 'M001', sku: 'SKU-902', name: 'Checked Blazer - M',
    category: 'Outerwear', daysOnShelf: 98,
    currentPrice: 4999, suggestedDiscount: 15,
    newPrice: 4249, stockUnits: 234,
    projectedSellThrough: 88, marginImpact: -12,
    confidence: 88, optimalDate: '2026-04-25',
    rationale: 'Stock exceeds 90-day threshold with declining velocity. Friday event traffic optimizes sell-through.',
  },
  {
    id: 'M002', sku: 'SKU-781', name: 'Summer Floral Top - XS/S',
    category: 'Tops', daysOnShelf: 67,
    currentPrice: 1299, suggestedDiscount: 20,
    newPrice: 1039, stockUnits: 512,
    projectedSellThrough: 94, marginImpact: -8,
    confidence: 84, optimalDate: '2026-04-26',
    rationale: 'Consumer price sensitivity peaks this weekend. Event-aware model predicts 40% uplift.',
  },
  {
    id: 'M003', sku: 'SKU-445', name: 'Woolen Scarf Bundle',
    category: 'Accessories', daysOnShelf: 121,
    currentPrice: 799, suggestedDiscount: 30,
    newPrice: 559, stockUnits: 876,
    projectedSellThrough: 79, marginImpact: -18,
    confidence: 91, optimalDate: '2026-04-27',
    rationale: 'Seasonal transition imminent. Deep discount before summer prevents full deadstock loss.',
  },
]

export const mockInventoryByCategory = [
  { category: 'Apparel', healthy: 62, overstock: 23, stockout: 15 },
  { category: 'Footwear', healthy: 71, overstock: 18, stockout: 11 },
  { category: 'Accessories', healthy: 55, overstock: 31, stockout: 14 },
  { category: 'Home & Living', healthy: 78, overstock: 15, stockout: 7 },
  { category: 'Electronics', healthy: 69, overstock: 12, stockout: 19 },
]

export const mockROIData = [
  { month: 'Jan', savings: 420, investment: 95, roi: 342 },
  { month: 'Feb', savings: 480, investment: 95, roi: 405 },
  { month: 'Mar', savings: 510, investment: 95, roi: 437 },
  { month: 'Apr', savings: 465, investment: 95, roi: 389 },
  { month: 'May', savings: 535, investment: 95, roi: 463 },
  { month: 'Jun', savings: 590, investment: 95, roi: 521 },
]

export const mockAssortmentScores = [
  { region: 'North Zone', score: 82, topSKUs: 145, lowPerformers: 23, opportunity: '+$240K' },
  { region: 'South Zone', score: 71, topSKUs: 132, lowPerformers: 38, opportunity: '+$380K' },
  { region: 'East Zone', score: 88, topSKUs: 167, lowPerformers: 15, opportunity: '+$180K' },
  { region: 'West Zone', score: 64, topSKUs: 118, lowPerformers: 51, opportunity: '+$490K' },
  { region: 'Online', score: 91, topSKUs: 203, lowPerformers: 12, opportunity: '+$320K' },
]
