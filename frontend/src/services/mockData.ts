import {
  Category, Product, Supplier, DashboardSummary, ModelMetric,
  AIRecommendation, ProductForecast, OptimizationResult, SimulationResult,
  PurchaseOrder, InventoryAlert, User
} from '../types';

export const MOCK_USER: User = {
  id: 1,
  email: 'admin@smartinventory.ai',
  full_name: 'Tilak Barapatre',
  role: 'ADMIN'
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Grains & Flours", code: "CAT_GRN", description: "Rice, Wheat, Atta, Pulses and staple food grains" },
  { id: 2, name: "Edible Oils & Ghee", code: "CAT_OIL", description: "Mustard oil, Sunflower oil, Olive oil, and Desi Ghee" },
  { id: 3, name: "Dairy & Breakfast", code: "CAT_DRY", description: "Milk, Butter, Cheese, Yogurt, Oats, Cereals" },
  { id: 4, name: "Beverages & Teas", code: "CAT_BEV", description: "Tea powders, Filter coffee, Fruit juices, Health drinks" },
  { id: 5, name: "Spices & Seasonings", code: "CAT_SPC", description: "Turmeric, Chilli, Garam masala, Salt, Pepper" },
  { id: 6, name: "Snacks & Biscuits", code: "CAT_SNK", description: "Cookies, Potato chips, Namkeen, Rusks, Chocolates" },
  { id: 7, name: "Personal Care & Hygiene", code: "CAT_PC", description: "Soaps, Shampoos, Toothpastes, Face washes, Creams" },
  { id: 8, name: "Household & Cleaning", code: "CAT_HHC", description: "Detergents, Dishwash liquids, Floor cleaners, Disinfectants" },
  { id: 9, name: "Packaged Foods & Noodles", code: "CAT_PKG", description: "Instant noodles, Pasta, Sauces, Ketchup, Ready to eat" },
  { id: 10, name: "Baby & Healthcare", code: "CAT_BBY", description: "Baby food, Diapers, Sanitizers, First aid staples" },
  { id: 11, name: "Baking & Dessert Essentials", code: "CAT_BAK", description: "Sugar, Jaggery, Cocoa powder, Baking soda, Syrups" },
  { id: 12, name: "Dry Fruits & Nuts", code: "CAT_DFN", description: "Almonds, Cashews, Raisins, Walnuts, Pistachios" }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: "Apex Agro Commodities Pvt Ltd", city: "Mumbai", contact_email: "orders@apexagro.in", phone: "+91 98201 12345", on_time_rate: 97.5, quality_score: 96.0, reliability_score: 98.0, payment_terms: "Net 30", overall_score: 97.2 },
  { id: 2, name: "Bharat FMCG Distributors", city: "Delhi", contact_email: "sales@bharatfmcg.com", phone: "+91 98110 54321", on_time_rate: 94.0, quality_score: 92.5, reliability_score: 93.0, payment_terms: "Net 15", overall_score: 93.2 },
  { id: 3, name: "Greenfield Naturals & Grains", city: "Chandigarh", contact_email: "procurement@greenfieldgrain.com", phone: "+91 98765 89012", on_time_rate: 91.0, quality_score: 95.0, reliability_score: 92.0, payment_terms: "Net 30", overall_score: 92.7 },
  { id: 4, name: "Sunlight Logistics & Foods", city: "Bangalore", contact_email: "contact@sunlightlogistics.in", phone: "+91 98450 67890", on_time_rate: 96.0, quality_score: 94.0, reliability_score: 95.5, payment_terms: "Net 45", overall_score: 95.2 },
  { id: 5, name: "Heritage Spice Mills Ltd", city: "Kochi", contact_email: "orders@heritagespices.com", phone: "+91 98470 23456", on_time_rate: 98.0, quality_score: 98.5, reliability_score: 97.0, payment_terms: "Net 30", overall_score: 97.8 },
  { id: 6, name: "National Daily Essentials Corp", city: "Pune", contact_email: "b2b@nationalessentials.in", phone: "+91 98220 34567", on_time_rate: 89.0, quality_score: 88.0, reliability_score: 89.5, payment_terms: "Net 15", overall_score: 88.8 },
  { id: 7, name: "Prime Super Supply Chain", city: "Hyderabad", contact_email: "info@primesupersupply.com", phone: "+91 98490 45678", on_time_rate: 95.5, quality_score: 93.0, reliability_score: 94.0, payment_terms: "Net 30", overall_score: 94.2 },
  { id: 8, name: "Kaveri Dairy & Agro Tech", city: "Chennai", contact_email: "sales@kaveridairy.com", phone: "+91 98400 56789", on_time_rate: 96.5, quality_score: 97.0, reliability_score: 96.0, payment_terms: "Net 20", overall_score: 96.5 },
  { id: 9, name: "Vedic Wellness Products", city: "Ahmedabad", contact_email: "supply@vedicwellness.co.in", phone: "+91 98250 67890", on_time_rate: 92.0, quality_score: 95.5, reliability_score: 91.0, payment_terms: "Net 30", overall_score: 92.8 },
  { id: 10, name: "Eastern Wholesale Grocers", city: "Kolkata", contact_email: "ops@easterngrocers.com", phone: "+91 98300 78901", on_time_rate: 88.5, quality_score: 89.0, reliability_score: 87.0, payment_terms: "Net 15", overall_score: 88.2 },
  { id: 11, name: "Metro Retail Suppliers Network", city: "Gurgaon", contact_email: "b2b@metroretailsuppliers.com", phone: "+91 98100 89012", on_time_rate: 95.0, quality_score: 91.0, reliability_score: 93.5, payment_terms: "Net 30", overall_score: 93.2 },
  { id: 12, name: "Royal Nuts & Dry Fruits Co", city: "Jaipur", contact_email: "export@royalnuts.in", phone: "+91 98290 90123", on_time_rate: 93.5, quality_score: 96.0, reliability_score: 94.0, payment_terms: "Net 30", overall_score: 94.5 }
];

const RAW_PRODS_SEED: Array<[string, number, string, number, number, number, number, number, number, string, string]> = [
  ["Basmati Royal Rice 5kg", 1, "5kg bag", 480.0, 599.0, 142, 190, 40, 3, "A", "X"],
  ["Sona Masoori Rice 10kg", 1, "10kg bag", 550.0, 680.0, 110, 150, 35, 4, "A", "X"],
  ["Organic Sharbati Atta 5kg", 1, "5kg bag", 260.0, 325.0, 85, 140, 30, 2, "A", "Y"],
  ["Chakki Fresh Whole Wheat Atta 10kg", 1, "10kg bag", 420.0, 510.0, 220, 160, 40, 3, "A", "X"],
  ["Premium Toor Dal 1kg", 1, "1kg pack", 145.0, 185.0, 95, 120, 25, 3, "A", "X"],
  ["Organic Moong Dal Yellow 1kg", 1, "1kg pack", 130.0, 165.0, 65, 100, 20, 3, "B", "Y"],
  ["Kabuli Chana Extra Large 1kg", 1, "1kg pack", 135.0, 175.0, 45, 90, 20, 4, "B", "Y"],
  ["Black Urad Dal Split 1kg", 1, "1kg pack", 125.0, 160.0, 80, 75, 15, 3, "B", "X"],
  ["Poha Super Thin 1kg", 1, "1kg pack", 58.0, 78.0, 180, 110, 25, 2, "C", "X"],
  ["Rolled Oats High Fiber 1kg", 1, "1kg jar", 195.0, 255.0, 70, 80, 20, 3, "B", "Y"],
  ["Cold Pressed Mustard Oil 1L", 2, "1L bottle", 165.0, 210.0, 120, 140, 30, 3, "A", "X"],
  ["Refined Sunflower Oil 5L Can", 2, "5L can", 680.0, 820.0, 52, 80, 20, 4, "A", "X"],
  ["Pure Cow Desi Ghee 1L Tin", 2, "1L tin", 580.0, 720.0, 75, 100, 25, 3, "A", "Y"],
  ["Extra Virgin Olive Oil 1L", 2, "1L glass", 790.0, 999.0, 18, 50, 15, 5, "A", "Z"],
  ["Filtered Groundnut Oil 1L", 2, "1L pouch", 175.0, 220.0, 140, 110, 25, 3, "B", "X"],
  ["Cold Pressed Coconut Oil 500ml", 2, "500ml jar", 190.0, 245.0, 85, 70, 15, 4, "B", "Y"],
  ["Pasteurized Full Cream Milk 1L", 3, "1L carton", 62.0, 74.0, 24, 180, 40, 1, "A", "X"],
  ["Salted Table Butter 500g", 3, "500g block", 225.0, 275.0, 65, 110, 25, 2, "A", "X"],
  ["Processed Cheese Slices 400g", 3, "400g pack", 195.0, 245.0, 80, 95, 20, 3, "B", "X"],
  ["Fresh Paneer Block 400g", 3, "400g pack", 140.0, 180.0, 15, 80, 20, 1, "A", "X"],
  ["Greek Yogurt Natural 400g", 3, "400g tub", 110.0, 145.0, 28, 60, 15, 2, "C", "Y"],
  ["Farm Fresh Brown Eggs (Pack of 12)", 3, "12 pack", 95.0, 130.0, 40, 90, 25, 1, "B", "X"],
  ["Premium Assam CTC Tea 1kg", 4, "1kg pouch", 380.0, 490.0, 130, 150, 35, 3, "A", "X"],
  ["Cardamom Elaichi Tea Bags 100s", 4, "100 bags box", 220.0, 295.0, 60, 75, 15, 4, "B", "Y"],
  ["Filter Coffee Pure Roast 500g", 4, "500g pack", 260.0, 340.0, 75, 90, 20, 3, "B", "X"],
  ["Instant Coffee Gold Blend 200g", 4, "200g glass jar", 420.0, 545.0, 110, 100, 25, 3, "A", "Y"],
  ["Salem Turmeric Powder 500g", 5, "500g pack", 115.0, 155.0, 180, 130, 30, 3, "A", "X"],
  ["Kashmiri Red Chilli Powder 500g", 5, "500g pack", 175.0, 235.0, 160, 140, 30, 3, "A", "X"],
  ["Coriander Dhaniya Powder 500g", 5, "500g pack", 95.0, 135.0, 140, 120, 25, 3, "B", "X"],
  ["Royal Garam Masala Blend 200g", 5, "200g box", 110.0, 150.0, 95, 85, 20, 3, "B", "X"],
  ["Butter Cookies Royal Selection 400g", 6, "400g tin", 180.0, 250.0, 115, 100, 25, 3, "B", "X"],
  ["Classic Salted Potato Chips 150g", 6, "150g bag", 40.0, 55.0, 310, 200, 45, 2, "B", "X"],
  ["Aloo Bhujia Namkeen 1kg", 6, "1kg pouch", 190.0, 260.0, 140, 120, 30, 3, "A", "X"],
  ["Dark Chocolate 70% Cocoa 100g", 6, "100g bar", 115.0, 160.0, 22, 75, 18, 4, "C", "Z"],
  ["Neem & Aloe Herbal Bath Soap (5s)", 7, "5x125g pack", 160.0, 215.0, 140, 130, 30, 3, "B", "X"],
  ["Anti-Dandruff Scalp Shampoo 650ml", 7, "650ml pump", 380.0, 499.0, 65, 85, 20, 4, "A", "Y"],
  ["Ayurvedic Clove Toothpaste 200g", 7, "200g tube", 95.0, 130.0, 230, 150, 35, 2, "B", "X"],
  ["Front Load Detergent Liquid 2L", 8, "2L bottle", 360.0, 475.0, 80, 110, 25, 3, "A", "X"],
  ["Detergent Washing Powder 4kg", 8, "4kg pack", 420.0, 540.0, 160, 140, 35, 3, "A", "X"],
  ["Concentrated Dishwash Gel Lemon 1.5L", 8, "1.5L bottle", 195.0, 260.0, 130, 120, 30, 2, "B", "X"],
  ["Citrus Floor Cleaner 2L", 8, "2L bottle", 210.0, 285.0, 95, 100, 25, 3, "B", "X"],
  ["Instant Masala Noodles 12-pack", 9, "12x70g pack", 144.0, 180.0, 280, 180, 40, 2, "A", "X"],
  ["Durum Wheat Penne Pasta 500g", 9, "500g pack", 85.0, 120.0, 110, 90, 20, 3, "C", "Y"],
  ["Classic Tomato Ketchup 1kg", 9, "1kg bottle", 110.0, 150.0, 150, 110, 25, 2, "B", "X"],
  ["Baby Diapers Comfort Tape M (64s)", 10, "64 count pack", 650.0, 899.0, 42, 60, 15, 3, "A", "X"],
  ["Gentle Baby Wet Wipes 72s (Pack 3)", 10, "3 pack", 210.0, 299.0, 75, 70, 18, 3, "B", "X"],
  ["Organic Baby Cereal Rice & Milk 300g", 10, "300g bib", 240.0, 310.0, 50, 55, 12, 3, "B", "Y"],
  ["Refined White Sugar Crystals 5kg", 11, "5kg bag", 210.0, 260.0, 250, 180, 40, 2, "A", "X"],
  ["Organic Jaggery Powder 1kg", 11, "1kg jar", 95.0, 135.0, 130, 100, 25, 3, "B", "Y"],
  ["Dutch Processed Cocoa Powder 250g", 11, "250g can", 220.0, 310.0, 35, 45, 10, 4, "C", "Z"],
  ["California Jumbo Almonds 500g", 12, "500g zip pack", 420.0, 560.0, 95, 90, 20, 4, "A", "Y"],
  ["W240 Whole Cashews 500g", 12, "500g zip pack", 460.0, 620.0, 85, 80, 20, 4, "A", "Y"],
  ["Golden Long Raisins Kishmish 500g", 12, "500g pack", 160.0, 230.0, 110, 95, 20, 3, "B", "X"],
  ["California Walnut Kernels 250g", 12, "250g vacuum", 320.0, 440.0, 48, 55, 12, 4, "A", "Z"]
];

export const MOCK_PRODUCTS: Product[] = RAW_PRODS_SEED.map((item, idx) => {
  const [name, catId, unit, unit_cost, selling_price, current_stock, reorder_point, safety_stock, lead_time_days, abc_class, xyz_class] = item;
  const category = MOCK_CATEGORIES.find(c => c.id === catId);
  const sku = `SKU-${1000 + idx + 1}`;
  
  return {
    id: idx + 1,
    sku,
    name,
    description: `High demand retail FMCG item: ${name}. Optimized for retail distribution.`,
    category_id: catId,
    category_name: category ? category.name : 'General',
    unit,
    unit_cost,
    selling_price,
    current_stock,
    min_stock: safety_stock,
    max_stock: reorder_point * 3,
    reorder_point,
    safety_stock,
    lead_time_days,
    abc_class,
    xyz_class,
    inventory_value: current_stock * unit_cost,
    is_active: true,
    daily_demand: Math.max(1, Math.round(reorder_point / 15)),
    weekly_demand: Math.max(5, Math.round(reorder_point / 2)),
    monthly_demand: Math.max(20, Math.round(reorder_point * 1.5)),
    days_until_stockout: Math.max(0.5, Number((current_stock / Math.max(1, reorder_point / 15)).toFixed(1))),
    stockout_risk: current_stock <= safety_stock ? 'CRITICAL' : current_stock <= reorder_point ? 'HIGH' : 'LOW',
    suppliers: [
      {
        id: 1,
        supplier_id: ((idx * 3) % 12) + 1,
        supplier_name: MOCK_SUPPLIERS[((idx * 3) % 12)].name,
        unit_cost: unit_cost * 0.98,
        lead_time_days,
        moq: 20,
        reliability_score: 97.5,
        quality_score: 96.0,
        is_preferred: true
      },
      {
        id: 2,
        supplier_id: (((idx * 3) + 1) % 12) + 1,
        supplier_name: MOCK_SUPPLIERS[(((idx * 3) + 1) % 12)].name,
        unit_cost: unit_cost * 1.02,
        lead_time_days: lead_time_days + 1,
        moq: 10,
        reliability_score: 94.0,
        quality_score: 93.0,
        is_preferred: false
      }
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-14T12:00:00Z"
  };
});

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  total_products: 105,
  inventory_value: 582490,
  low_stock_count: 14,
  stockout_risk_count: 8,
  overstock_count: 12,
  monthly_procurement_cost: 215400,
  potential_savings: 34800,
  ai_insights: [
    {
      type: "stockout",
      badge: "High Risk",
      color: "red",
      text: "8 high-velocity SKUs (Fresh Paneer, Milk 1L, Toor Dal) will breach safety stock within 48 hours.",
      action: "/procurement/recommendations"
    },
    {
      type: "procurement",
      badge: "MILP Optimization",
      color: "emerald",
      text: "OR-Tools solved an optimal PO batch with ₹34,800 savings by consolidating MOQ orders with Apex Agro.",
      action: "/procurement/optimizer"
    },
    {
      type: "forecast",
      badge: "Demand Surge",
      color: "blue",
      text: "XGBoost forecaster projects a +24% demand spike in Grains & Edible Oils heading into next festival week.",
      action: "/demand-intelligence/forecast"
    },
    {
      type: "overstock",
      badge: "Capital Tied",
      color: "amber",
      text: "12 slow-moving SKUs (Olive Oil, Cocoa Powder) tie up ₹48,200 working capital with >90 days inventory cover.",
      action: "/analytics/overstock"
    }
  ],
  health_distribution: {
    healthy: 71,
    low_stock: 14,
    critical: 8,
    overstock: 12
  },
  top_selling_products: [
    { name: "Basmati Royal Rice 5kg", sku: "SKU-1001", category: "Grains & Flours", units_sold: 490, revenue: 293510 },
    { name: "Pasteurized Full Cream Milk 1L", sku: "SKU-1017", category: "Dairy & Breakfast", units_sold: 980, revenue: 72520 },
    { name: "Cold Pressed Mustard Oil 1L", sku: "SKU-1011", category: "Edible Oils & Ghee", units_sold: 380, revenue: 79800 },
    { name: "Chakki Fresh Atta 10kg", sku: "SKU-1004", category: "Grains & Flours", units_sold: 410, revenue: 209100 },
    { name: "Classic Salted Potato Chips 150g", sku: "SKU-1032", category: "Snacks & Biscuits", units_sold: 620, revenue: 34100 }
  ],
  category_breakdown: [
    { category: "Grains & Flours", product_count: 14, total_value: 124500, share_pct: 21.4 },
    { category: "Edible Oils & Ghee", product_count: 10, total_value: 112300, share_pct: 19.3 },
    { category: "Dairy & Breakfast", product_count: 12, total_value: 68400, share_pct: 11.7 },
    { category: "Dry Fruits & Nuts", product_count: 8, total_value: 84200, share_pct: 14.5 },
    { category: "Beverages & Teas", product_count: 11, total_value: 58900, share_pct: 10.1 },
    { category: "Others (7 Cats)", product_count: 50, total_value: 134190, share_pct: 23.0 }
  ],
  monthly_sales_vs_forecast: [
    { month: "May", actual_sales: 182000, predicted_demand: 178000, procurement_spend: 145000, is_forecast: false },
    { month: "Jun", actual_sales: 194000, predicted_demand: 190000, procurement_spend: 152000, is_forecast: false },
    { month: "Jul", actual_sales: 205000, predicted_demand: 208000, procurement_spend: 161000, is_forecast: false },
    { month: "Aug", actual_sales: 218000, predicted_demand: 215000, procurement_spend: 173000, is_forecast: false },
    { month: "Sep", actual_sales: 231000, predicted_demand: 228000, procurement_spend: 184000, is_forecast: false },
    { month: "Oct (Live)", actual_sales: 248000, predicted_demand: 244000, procurement_spend: 192000, is_forecast: false },
    { month: "Nov (ML)", actual_sales: null, predicted_demand: 265000, procurement_spend: 210000, is_forecast: true },
    { month: "Dec (ML)", actual_sales: null, predicted_demand: 290000, procurement_spend: 228000, is_forecast: true }
  ],
  recent_activities: [
    { id: 1, title: "OR-Tools MILP Optimizer Executed", description: "Solved 105 SKU constraints in 14ms with ₹34,800 savings", time: "10 mins ago", status: "success", type: "optimizer" },
    { id: 2, title: "Purchase Order #PO-2026-088 Approved", description: "Consolidated 6 SKUs from Apex Agro (₹48,500)", time: "25 mins ago", status: "success", type: "order" },
    { id: 3, title: "Stockout Warning Detected", description: "Fresh Paneer Block 400g has only 1.2 days of safety stock left", time: "1 hour ago", status: "warning", type: "alert" },
    { id: 4, title: "XGBoost Forecaster Retrained", description: "MAE improved to 3.42, R² score reached 0.912 on holdout test set", time: "3 hours ago", status: "info", type: "ml" },
    { id: 5, title: "Stock Adjustment Recorded", description: "Audit adjustment +15 units for Royal Basmati Rice", time: "5 hours ago", status: "info", type: "inventory" }
  ]
};

export const MOCK_METRICS: ModelMetric[] = [
  { model_name: "XGBoost Regressor (Tuned)", mae: 3.42, rmse: 4.81, mape: 8.7, r2_score: 0.912, is_best: true, trained_at: "2026-10-14 18:30" },
  { model_name: "Random Forest Regressor", mae: 4.18, rmse: 5.92, mape: 11.2, r2_score: 0.874, is_best: false, trained_at: "2026-10-14 18:30" },
  { model_name: "Ridge Linear Regressor (Lags)", mae: 5.65, rmse: 7.34, mape: 14.8, r2_score: 0.811, is_best: false, trained_at: "2026-10-14 18:30" },
  { model_name: "Triple Exponential Smoothing", mae: 6.82, rmse: 8.91, mape: 18.5, r2_score: 0.742, is_best: false, trained_at: "2026-10-14 18:30" }
];

export const MOCK_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 1,
    product_id: 20,
    product_name: "Fresh Paneer Block 400g",
    sku: "SKU-1020",
    category: "Dairy & Breakfast",
    current_stock: 15,
    reorder_point: 80,
    safety_stock: 20,
    forecast_30d: 240,
    recommended_qty: 120,
    recommended_supplier_id: 8,
    recommended_supplier_name: "Kaveri Dairy & Agro Tech",
    unit_cost: 137.2,
    estimated_cost: 16464,
    potential_savings: 1440,
    urgency: "CRITICAL",
    lead_time_days: 1,
    rationale: [
      "Current stock (15 units) has breached critical safety threshold (20 units).",
      "Lead time run-rate projects total stockout in approximately 1.4 days.",
      "Kaveri Dairy has 96.5% on-time delivery score and delivers within 24 hours.",
      "Ordering 120 units unlocks Tier-1 volume discount saving ₹1,440."
    ],
    decision_factors: { days_to_stockout: 1.4, vendor_score: 96.5, moq_satisfied: true },
    status: "Active",
    created_at: "2026-10-14T21:00:00Z"
  },
  {
    id: 2,
    product_id: 17,
    product_name: "Pasteurized Full Cream Milk 1L",
    sku: "SKU-1017",
    category: "Dairy & Breakfast",
    current_stock: 24,
    reorder_point: 180,
    safety_stock: 40,
    forecast_30d: 540,
    recommended_qty: 250,
    recommended_supplier_id: 8,
    recommended_supplier_name: "Kaveri Dairy & Agro Tech",
    unit_cost: 60.5,
    estimated_cost: 15125,
    potential_savings: 1250,
    urgency: "CRITICAL",
    lead_time_days: 1,
    rationale: [
      "Stock is 40% below safety buffer with rapid daily sales turnover.",
      "XGBoost forecasts sustained daily consumption of 18 units.",
      "Supplier offers net payment terms and daily refrigerated freight dispatch."
    ],
    decision_factors: { days_to_stockout: 1.3, vendor_score: 96.5, moq_satisfied: true },
    status: "Active",
    created_at: "2026-10-14T21:00:00Z"
  },
  {
    id: 3,
    product_id: 14,
    product_name: "Extra Virgin Olive Oil 1L",
    sku: "SKU-1014",
    category: "Edible Oils & Ghee",
    current_stock: 18,
    reorder_point: 50,
    safety_stock: 15,
    forecast_30d: 65,
    recommended_qty: 40,
    recommended_supplier_id: 1,
    recommended_supplier_name: "Apex Agro Commodities Pvt Ltd",
    unit_cost: 774.2,
    estimated_cost: 30968,
    potential_savings: 2400,
    urgency: "HIGH",
    lead_time_days: 5,
    rationale: [
      "Class A high-value SKU with 5-day supplier transit window.",
      "Lead time demand buffer requires immediate order placement.",
      "Apex Agro maintains 98.0% quality audit score."
    ],
    decision_factors: { days_to_stockout: 4.8, vendor_score: 97.2, moq_satisfied: true },
    status: "Active",
    created_at: "2026-10-14T21:00:00Z"
  },
  {
    id: 4,
    product_id: 1,
    product_name: "Basmati Royal Rice 5kg",
    sku: "SKU-1001",
    category: "Grains & Flours",
    current_stock: 142,
    reorder_point: 190,
    safety_stock: 40,
    forecast_30d: 260,
    recommended_qty: 150,
    recommended_supplier_id: 1,
    recommended_supplier_name: "Apex Agro Commodities Pvt Ltd",
    unit_cost: 470.4,
    estimated_cost: 70560,
    potential_savings: 4500,
    urgency: "MEDIUM",
    lead_time_days: 3,
    rationale: [
      "Top revenue driver (Class AX). Projected festival demand uplift of 22%.",
      "Consolidating with Olive Oil order eliminates separate LTL transit surcharges."
    ],
    decision_factors: { days_to_stockout: 14.5, vendor_score: 97.2, moq_satisfied: true },
    status: "Active",
    created_at: "2026-10-14T21:00:00Z"
  }
];

export function getMockProductForecast(productId: number, horizonDays = 30): ProductForecast {
  const prod = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
  const points = [];
  const baseDaily = Math.max(3, Math.round(prod.reorder_point / 15));
  
  const today = new Date();
  for (let i = 1; i <= horizonDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1.0;
    const seasonality = 1 + 0.15 * Math.sin((i / 7) * Math.PI);
    const noise = 0.9 + 0.2 * Math.random();
    const pred = Math.round(baseDaily * weekendMultiplier * seasonality * noise);
    
    points.push({
      date: d.toISOString().split('T')[0],
      predicted: pred,
      lower_bound: Math.max(1, Math.round(pred * 0.82)),
      upper_bound: Math.round(pred * 1.22),
      actual: i <= 5 ? Math.round(pred * (0.95 + 0.1 * Math.random())) : undefined
    });
  }

  const forecastTotal = points.reduce((s, p) => s + p.predicted, 0);

  return {
    product_id: prod.id,
    product_name: prod.name,
    sku: prod.sku,
    model_used: "XGBoost Regressor (Tuned with 14 Lag Features)",
    confidence_score: 93.4,
    forecast_7d_total: points.slice(0, 7).reduce((s, p) => s + p.predicted, 0),
    forecast_30d_total: forecastTotal,
    points,
    metrics: {
      mae: 3.42,
      rmse: 4.81,
      mape: 8.7,
      r2_score: 0.912
    }
  };
}

export function getMockOptimizationResult(budgetLimit = 250000, maxLeadTimeDays = 7): OptimizationResult {
  const selectedItems = MOCK_RECOMMENDATIONS.map(rec => ({
    product_id: rec.product_id,
    product_name: rec.product_name,
    sku: rec.sku,
    category: rec.category,
    supplier_id: rec.recommended_supplier_id,
    supplier_name: rec.recommended_supplier_name,
    quantity: rec.recommended_qty,
    unit_cost: rec.unit_cost,
    total_cost: Math.round(rec.recommended_qty * rec.unit_cost),
    lead_time_days: rec.lead_time_days,
    reliability_score: 97.2,
    moq: 20
  }));

  const totalCost = selectedItems.reduce((s, i) => s + i.total_cost, 0);
  const totalUnits = selectedItems.reduce((s, i) => s + i.quantity, 0);

  return {
    total_cost: totalCost,
    budget_allocated: budgetLimit,
    budget_utilized_pct: Math.min(100, Math.round((totalCost / budgetLimit) * 100)),
    total_units_ordered: totalUnits,
    total_products_covered: selectedItems.length,
    potential_savings_vs_default: 9590,
    selected_items: selectedItems,
    supplier_allocations: [
      { supplier_name: "Apex Agro Commodities Pvt Ltd", total_spend: 101528, percentage: 76.2 },
      { supplier_name: "Kaveri Dairy & Agro Tech", total_spend: 31589, percentage: 23.8 }
    ],
    solver_status: "OPTIMAL",
    execution_time_ms: 14.8
  };
}

export function getMockSimulationResult(
  demandChangePct = 20,
  leadTimeChangeDays = 3,
  costChangePct = 5,
  budgetLimit = 300000
): SimulationResult {
  const baseCost = 215400;
  const costDelta = Math.round(baseCost * (1 + demandChangePct / 100) * (1 + costChangePct / 100) - baseCost);
  const simCost = baseCost + costDelta;
  const breached = simCost > budgetLimit;

  return {
    base_stockout_risk_count: 8,
    simulated_stockout_risk_count: Math.round(8 + (demandChangePct > 0 ? demandChangePct / 4 : 0) + leadTimeChangeDays * 1.5),
    base_total_procurement_cost: baseCost,
    simulated_total_procurement_cost: simCost,
    cost_difference: costDelta,
    capital_at_risk: Math.round(48200 * (1 + costChangePct / 100)),
    budget_limit: budgetLimit,
    is_budget_breached: breached,
    impact_summary: breached
      ? `Procurement budget breach of ₹${(simCost - budgetLimit).toLocaleString()} detected under the current stress parameters.`
      : `System resilient: ₹${(budgetLimit - simCost).toLocaleString()} budget cushion remains under stress testing.`,
    critical_impacted_products: [
      {
        product_id: 20,
        product_name: "Fresh Paneer Block 400g",
        sku: "SKU-1020",
        current_stock: 15,
        base_days_to_stockout: 1.4,
        sim_days_to_stockout: Math.max(0.4, Number((1.4 / (1 + demandChangePct / 100)).toFixed(1))),
        base_risk: "CRITICAL",
        sim_risk: "IMMEDIATE STOCKOUT",
        base_order_qty: 120,
        sim_order_qty: Math.round(120 * (1 + demandChangePct / 100)),
        cost_impact: Math.round(16464 * (costChangePct / 100))
      },
      {
        product_id: 17,
        product_name: "Pasteurized Full Cream Milk 1L",
        sku: "SKU-1017",
        current_stock: 24,
        base_days_to_stockout: 1.3,
        sim_days_to_stockout: Math.max(0.3, Number((1.3 / (1 + demandChangePct / 100)).toFixed(1))),
        base_risk: "CRITICAL",
        sim_risk: "IMMEDIATE STOCKOUT",
        base_order_qty: 250,
        sim_order_qty: Math.round(250 * (1 + demandChangePct / 100)),
        cost_impact: Math.round(15125 * (costChangePct / 100))
      }
    ]
  };
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 1,
    po_number: "PO-2026-001",
    supplier_id: 1,
    supplier_name: "Apex Agro Commodities Pvt Ltd",
    order_date: "2026-10-12",
    expected_delivery: "2026-10-15",
    status: "Approved",
    total_amount: 101528,
    budget_allocated: 150000,
    created_by: "Tilak Barapatre",
    items: [
      { id: 1, product_id: 1, product_name: "Basmati Royal Rice 5kg", product_sku: "SKU-1001", quantity: 150, unit_cost: 470.4, total_cost: 70560, received_quantity: 0 },
      { id: 2, product_id: 14, product_name: "Extra Virgin Olive Oil 1L", product_sku: "SKU-1014", quantity: 40, unit_cost: 774.2, total_cost: 30968, received_quantity: 0 }
    ]
  },
  {
    id: 2,
    po_number: "PO-2026-002",
    supplier_id: 8,
    supplier_name: "Kaveri Dairy & Agro Tech",
    order_date: "2026-10-14",
    expected_delivery: "2026-10-15",
    status: "Submitted",
    total_amount: 31589,
    budget_allocated: 50000,
    created_by: "Tilak Barapatre",
    items: [
      { id: 3, product_id: 20, product_name: "Fresh Paneer Block 400g", product_sku: "SKU-1020", quantity: 120, unit_cost: 137.2, total_cost: 16464, received_quantity: 0 },
      { id: 4, product_id: 17, product_name: "Pasteurized Full Cream Milk 1L", product_sku: "SKU-1017", quantity: 250, unit_cost: 60.5, total_cost: 15125, received_quantity: 0 }
    ]
  },
  {
    id: 3,
    po_number: "PO-2026-003",
    supplier_id: 5,
    supplier_name: "Heritage Spice Mills Ltd",
    order_date: "2026-10-08",
    expected_delivery: "2026-10-11",
    status: "Received",
    total_amount: 45200,
    budget_allocated: 60000,
    created_by: "Tilak Barapatre",
    items: [
      { id: 5, product_id: 27, product_name: "Salem Turmeric Powder 500g", product_sku: "SKU-1027", quantity: 200, unit_cost: 112.0, total_cost: 22400, received_quantity: 200 },
      { id: 6, product_id: 28, product_name: "Kashmiri Red Chilli Powder 500g", product_sku: "SKU-1028", quantity: 130, unit_cost: 175.0, total_cost: 22800, received_quantity: 130 }
    ]
  }
];

export const MOCK_ALERTS: InventoryAlert[] = [
  { id: 1, product_id: 20, product_name: "Fresh Paneer Block 400g", alert_type: "STOCKOUT_RISK", severity: "CRITICAL", message: "Stock breached safety limit (15 units remaining, runrate = 11/day). Stockout projected in 1.4 days.", is_read: false, created_at: "2026-10-14 21:10" },
  { id: 2, product_id: 17, product_name: "Pasteurized Full Cream Milk 1L", alert_type: "STOCKOUT_RISK", severity: "CRITICAL", message: "Critical inventory: Only 24 units left against 40 units safety threshold.", is_read: false, created_at: "2026-10-14 21:05" },
  { id: 3, product_id: 14, product_name: "Extra Virgin Olive Oil 1L", alert_type: "REORDER_POINT", severity: "HIGH", message: "Current stock (18) approaching reorder point (50). Lead time is 5 days.", is_read: false, created_at: "2026-10-14 20:30" },
  { id: 4, product_id: 50, product_name: "Dutch Processed Cocoa Powder 250g", alert_type: "OVERSTOCK", severity: "MEDIUM", message: "Overstocked: 110 days inventory cover. Consider promotional bundling.", is_read: true, created_at: "2026-10-14 18:00" }
];

export function getMockAiCopilotAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("reorder") || q.includes("buy") || q.includes("purchase") || q.includes("today")) {
    return `### 🚨 Reorder Priority Summary (Top 3 Recommendations)
Based on current inventory levels, lead-time demand, and XGBoost 30-day forecast:

1. **Fresh Paneer Block 400g** (SKU-1020)
   - **Current Stock**: 15 units (Safety Buffer: 20 units)
   - **Urgency**: **CRITICAL** (1.4 days until complete stockout)
   - **Recommended Order**: 120 units from **Kaveri Dairy & Agro Tech** (Unit Cost: ₹137.20, Est. Cost: ₹16,464).

2. **Pasteurized Full Cream Milk 1L** (SKU-1017)
   - **Current Stock**: 24 units (Safety Buffer: 40 units)
   - **Urgency**: **CRITICAL** (1.3 days until stockout)
   - **Recommended Order**: 250 units from **Kaveri Dairy & Agro Tech** (Est. Cost: ₹15,125).

3. **Extra Virgin Olive Oil 1L** (SKU-1014)
   - **Current Stock**: 18 units | **Lead Time**: 5 days
   - **Recommended Order**: 40 units from **Apex Agro Commodities** (Est. Cost: ₹30,968).

💡 *Tip: Click "Procurement Optimizer" in the sidebar to generate a consolidated Purchase Order with ₹34,800 MOQ savings!*`;
  }

  if (q.includes("supplier") || q.includes("vendor")) {
    return `### 🏆 Multi-Criteria Supplier Performance Ranking
Top suppliers evaluated on On-Time Delivery (40%), Quality Score (40%), and Reliability (20%):

1. **Heritage Spice Mills Ltd** — **97.8% Overall** (Kochi) | On-Time: 98.0%, Quality: 98.5%
2. **Apex Agro Commodities Pvt Ltd** — **97.2% Overall** (Mumbai) | On-Time: 97.5%, Quality: 96.0%
3. **Kaveri Dairy & Agro Tech** — **96.5% Overall** (Chennai) | On-Time: 96.5%, Quality: 97.0%
4. **Sunlight Logistics & Foods** — **95.2% Overall** (Bangalore) | On-Time: 96.0%, Quality: 94.0%

Apex Agro Commodities is currently the preferred multi-category partner for bulk staples and grains.`;
  }

  if (q.includes("model") || q.includes("forecast") || q.includes("accuracy") || q.includes("ml")) {
    return `### 🤖 Machine Learning Model Evaluation Benchmarks
Evaluated on temporal holdout test sets across 105 retail SKUs:

- **XGBoost Regressor (Selected Best)**: **MAE: 3.42** | **RMSE: 4.81** | **MAPE: 8.7%** | **R²: 0.912**
- **Random Forest Regressor**: MAE: 4.18 | RMSE: 5.92 | MAPE: 11.2% | R²: 0.874
- **Ridge Linear Regressor**: MAE: 5.65 | RMSE: 7.34 | MAPE: 14.8% | R²: 0.811
- **Triple Exponential Smoothing**: MAE: 6.82 | RMSE: 8.91 | MAPE: 18.5% | R²: 0.742

The tuned XGBoost pipeline models 14 lag features (Lag 1, 7, 14, 30), 7-day and 30-day rolling statistics, and day-of-week cyclical encodings.`;
  }

  return `### 💡 Smart Inventory AI Copilot
System status: **All 105 SKUs monitored across 12 categories.**

Key executive metrics:
- **Total Inventory Valuation**: ₹5,82,490
- **Stockout Vulnerability**: 8 SKUs requiring immediate attention
- **Overstock / Locked Capital**: ₹48,200 across 12 slow-moving items
- **Active Optimizer Savings**: ₹34,800 with MILP supplier consolidation

You can ask me questions like:
- *"Which products should I reorder today?"*
- *"Who is the best supplier for Basmati Rice?"*
- *"How accurate are the machine learning models?"*
- *"What is our current capital tied in overstock?"*`;
}
