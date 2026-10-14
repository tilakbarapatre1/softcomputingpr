import random
import math
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session

from app.models.models import (
    User, Category, Product, Supplier, SupplierProduct,
    Sale, SalesItem, PurchaseOrder, PurchaseOrderItem,
    DemandForecast, InventoryAlert, AIRecommendation, ModelMetric
)
from app.auth.security import get_password_hash

# 12 Categories
CATEGORIES_DATA = [
    {"name": "Grains & Flours", "code": "CAT_GRN", "description": "Rice, Wheat, Atta, Pulses and staple food grains"},
    {"name": "Edible Oils & Ghee", "code": "CAT_OIL", "description": "Mustard oil, Sunflower oil, Olive oil, and Desi Ghee"},
    {"name": "Dairy & Breakfast", "code": "CAT_DRY", "description": "Milk, Butter, Cheese, Yogurt, Oats, Cereals"},
    {"name": "Beverages & Teas", "code": "CAT_BEV", "description": "Tea powders, Filter coffee, Fruit juices, Health drinks"},
    {"name": "Spices & Seasonings", "code": "CAT_SPC", "description": "Turmeric, Chilli, Garam masala, Salt, Pepper"},
    {"name": "Snacks & Biscuits", "code": "CAT_SNK", "description": "Cookies, Potato chips, Namkeen, Rusks, Chocolates"},
    {"name": "Personal Care & Hygiene", "code": "CAT_PC", "description": "Soaps, Shampoos, Toothpastes, Face washes, Creams"},
    {"name": "Household & Cleaning", "code": "CAT_HHC", "description": "Detergents, Dishwash liquids, Floor cleaners, Disinfectants"},
    {"name": "Packaged Foods & Noodles", "code": "CAT_PKG", "description": "Instant noodles, Pasta, Sauces, Ketchup, Ready to eat"},
    {"name": "Baby & Healthcare", "code": "CAT_BBY", "description": "Baby food, Diapers, Sanitizers, First aid staples"},
    {"name": "Baking & Dessert Essentials", "code": "CAT_BAK", "description": "Sugar, Jaggery, Cocoa powder, Baking soda, Syrups"},
    {"name": "Dry Fruits & Nuts", "code": "CAT_DFN", "description": "Almonds, Cashews, Raisins, Walnuts, Pistachios"}
]

# 12 Suppliers
SUPPLIERS_DATA = [
    {"name": "Apex Agro Commodities Pvt Ltd", "city": "Mumbai", "contact_email": "orders@apexagro.in", "phone": "+91 98201 12345", "on_time_rate": 97.5, "quality_score": 96.0, "reliability_score": 98.0, "payment_terms": "Net 30"},
    {"name": "Bharat FMCG Distributors", "city": "Delhi", "contact_email": "sales@bharatfmcg.com", "phone": "+91 98110 54321", "on_time_rate": 94.0, "quality_score": 92.5, "reliability_score": 93.0, "payment_terms": "Net 15"},
    {"name": "Greenfield Naturals & Grains", "city": "Chandigarh", "contact_email": "procurement@greenfieldgrain.com", "phone": "+91 98765 89012", "on_time_rate": 91.0, "quality_score": 95.0, "reliability_score": 92.0, "payment_terms": "Net 30"},
    {"name": "Sunlight Logistics & Foods", "city": "Bangalore", "contact_email": "contact@sunlightlogistics.in", "phone": "+91 98450 67890", "on_time_rate": 96.0, "quality_score": 94.0, "reliability_score": 95.5, "payment_terms": "Net 45"},
    {"name": "Heritage Spice Mills Ltd", "city": "Kochi", "contact_email": "orders@heritagespices.com", "phone": "+91 98470 23456", "on_time_rate": 98.0, "quality_score": 98.5, "reliability_score": 97.0, "payment_terms": "Net 30"},
    {"name": "National Daily Essentials Corp", "city": "Pune", "contact_email": "b2b@nationalessentials.in", "phone": "+91 98220 34567", "on_time_rate": 89.0, "quality_score": 88.0, "reliability_score": 89.5, "payment_terms": "Net 15"},
    {"name": "Prime Super Supply Chain", "city": "Hyderabad", "contact_email": "info@primesupersupply.com", "phone": "+91 98490 45678", "on_time_rate": 95.5, "quality_score": 93.0, "reliability_score": 94.0, "payment_terms": "Net 30"},
    {"name": "Kaveri Dairy & Agro Tech", "city": "Chennai", "contact_email": "sales@kaveridairy.com", "phone": "+91 98400 56789", "on_time_rate": 96.5, "quality_score": 97.0, "reliability_score": 96.0, "payment_terms": "Net 20"},
    {"name": "Vedic Wellness Products", "city": "Ahmedabad", "contact_email": "supply@vedicwellness.co.in", "phone": "+91 98250 67890", "on_time_rate": 92.0, "quality_score": 95.5, "reliability_score": 91.0, "payment_terms": "Net 30"},
    {"name": "Eastern Wholesale Grocers", "city": "Kolkata", "contact_email": "ops@easterngrocers.com", "phone": "+91 98300 78901", "on_time_rate": 88.5, "quality_score": 89.0, "reliability_score": 87.0, "payment_terms": "Net 15"},
    {"name": "Metro Retail Suppliers Network", "city": "Gurgaon", "contact_email": "b2b@metroretailsuppliers.com", "phone": "+91 98100 89012", "on_time_rate": 95.0, "quality_score": 91.0, "reliability_score": 93.5, "payment_terms": "Net 30"},
    {"name": "Royal Nuts & Dry Fruits Co", "city": "Jaipur", "contact_email": "export@royalnuts.in", "phone": "+91 98290 90123", "on_time_rate": 93.5, "quality_score": 96.0, "reliability_score": 94.0, "payment_terms": "Net 30"}
]

# 105 Realistic Retail Products across categories
RAW_PRODUCTS = [
    # Grains & Flours (CAT_GRN)
    ("Basmati Royal Rice 5kg", "CAT_GRN", "5kg bag", 480.0, 599.0, 142, 190, 40, 3),
    ("Sona Masoori Rice 10kg", "CAT_GRN", "10kg bag", 550.0, 680.0, 110, 150, 35, 4),
    ("Organic Sharbati Atta 5kg", "CAT_GRN", "5kg bag", 260.0, 325.0, 85, 140, 30, 2),
    ("Chakki Fresh Whole Wheat Atta 10kg", "CAT_GRN", "10kg bag", 420.0, 510.0, 220, 160, 40, 3),
    ("Premium Toor Dal 1kg", "CAT_GRN", "1kg pack", 145.0, 185.0, 95, 120, 25, 3),
    ("Organic Moong Dal Yellow 1kg", "CAT_GRN", "1kg pack", 130.0, 165.0, 65, 100, 20, 3),
    ("Kabuli Chana Extra Large 1kg", "CAT_GRN", "1kg pack", 135.0, 175.0, 45, 90, 20, 4),
    ("Black Urad Dal Split 1kg", "CAT_GRN", "1kg pack", 125.0, 160.0, 80, 75, 15, 3),
    ("Poha Super Thin 1kg", "CAT_GRN", "1kg pack", 58.0, 78.0, 180, 110, 25, 2),
    ("Rolled Oats High Fiber 1kg", "CAT_GRN", "1kg jar", 195.0, 255.0, 70, 80, 20, 3),

    # Edible Oils & Ghee (CAT_OIL)
    ("Cold Pressed Mustard Oil 1L", "CAT_OIL", "1L bottle", 165.0, 210.0, 120, 140, 30, 3),
    ("Refined Sunflower Oil 5L Can", "CAT_OIL", "5L can", 680.0, 820.0, 52, 80, 20, 4),
    ("Pure Cow Desi Ghee 1L Tin", "CAT_OIL", "1L tin", 580.0, 720.0, 75, 100, 25, 3),
    ("Extra Virgin Olive Oil 1L", "CAT_OIL", "1L glass", 790.0, 999.0, 30, 50, 15, 5),
    ("Filtered Groundnut Oil 1L", "CAT_OIL", "1L pouch", 175.0, 220.0, 140, 110, 25, 3),
    ("Cold Pressed Coconut Oil 500ml", "CAT_OIL", "500ml jar", 190.0, 245.0, 85, 70, 15, 4),
    ("Buffalo Pure Ghee 1L Tin", "CAT_OIL", "1L tin", 540.0, 675.0, 60, 75, 18, 3),
    ("Rice Bran Healthy Oil 5L", "CAT_OIL", "5L jar", 630.0, 760.0, 42, 65, 15, 4),

    # Dairy & Breakfast (CAT_DRY)
    ("Pasteurized Full Cream Milk 1L", "CAT_DRY", "1L carton", 62.0, 74.0, 90, 180, 40, 1),
    ("Salted Table Butter 500g", "CAT_DRY", "500g block", 225.0, 275.0, 65, 110, 25, 2),
    ("Processed Cheese Slices 400g (20s)", "CAT_DRY", "400g pack", 195.0, 245.0, 80, 95, 20, 3),
    ("Fresh Paneer Block 400g", "CAT_DRY", "400g pack", 140.0, 180.0, 35, 80, 20, 1),
    ("Greek Yogurt Natural 400g", "CAT_DRY", "400g tub", 110.0, 145.0, 28, 60, 15, 2),
    ("Farm Fresh Brown Eggs (Pack of 12)", "CAT_DRY", "12 pack", 95.0, 130.0, 40, 90, 25, 1),
    ("Almond Milk Unsweetened 1L", "CAT_DRY", "1L carton", 210.0, 280.0, 32, 45, 10, 3),
    ("Muesli Fruit & Nut Crunch 750g", "CAT_DRY", "750g jar", 290.0, 380.0, 55, 60, 15, 3),
    ("Corn Flakes Honey Crunch 1kg", "CAT_DRY", "1kg box", 260.0, 340.0, 90, 85, 20, 3),

    # Beverages & Teas (CAT_BEV)
    ("Premium Assam CTC Tea 1kg", "CAT_BEV", "1kg pouch", 380.0, 490.0, 130, 150, 35, 3),
    ("Cardamom Elaichi Tea Bags 100s", "CAT_BEV", "100 bags box", 220.0, 295.0, 60, 75, 15, 4),
    ("Filter Coffee Pure Roast 500g", "CAT_BEV", "500g pack", 260.0, 340.0, 75, 90, 20, 3),
    ("Instant Coffee Gold Blend 200g", "CAT_BEV", "200g glass jar", 420.0, 545.0, 110, 100, 25, 3),
    ("Green Tea Organic Lemon & Honey 50s", "CAT_BEV", "50 bags box", 185.0, 245.0, 85, 80, 20, 3),
    ("Mixed Fruit Juice Tetra 1L", "CAT_BEV", "1L pack", 90.0, 125.0, 160, 130, 30, 2),
    ("Alphonso Mango Nectar 1L", "CAT_BEV", "1L pack", 85.0, 115.0, 140, 120, 25, 2),
    ("Chocolate Malt Energy Drink 1kg", "CAT_BEV", "1kg refill", 340.0, 425.0, 95, 110, 25, 3),
    ("Sparkling Tonic Water 6-pack", "CAT_BEV", "6x250ml can", 240.0, 330.0, 40, 55, 12, 4),

    # Spices & Seasonings (CAT_SPC)
    ("Salem Turmeric Powder 500g", "CAT_SPC", "500g pack", 115.0, 155.0, 180, 130, 30, 3),
    ("Kashmiri Red Chilli Powder 500g", "CAT_SPC", "500g pack", 175.0, 235.0, 160, 140, 30, 3),
    ("Coriander Dhaniya Powder 500g", "CAT_SPC", "500g pack", 95.0, 135.0, 140, 120, 25, 3),
    ("Royal Garam Masala Blend 200g", "CAT_SPC", "200g box", 110.0, 150.0, 95, 85, 20, 3),
    ("Whole Cumin Seeds Jeera 500g", "CAT_SPC", "500g pouch", 240.0, 320.0, 85, 95, 20, 4),
    ("Green Cardamom Elaichi Bold 100g", "CAT_SPC", "100g jar", 290.0, 390.0, 40, 60, 15, 4),
    ("Black Pepper Whole Peppercorns 200g", "CAT_SPC", "200g jar", 195.0, 265.0, 60, 70, 15, 3),
    ("Himalayan Pink Rock Salt 1kg", "CAT_SPC", "1kg jar", 65.0, 95.0, 210, 150, 35, 2),
    ("Iodized Crystal Table Salt 1kg", "CAT_SPC", "1kg pouch", 18.0, 28.0, 350, 200, 50, 2),
    ("Chaat Masala Sprinkler 100g", "CAT_SPC", "100g bottle", 48.0, 68.0, 110, 80, 15, 3),

    # Snacks & Biscuits (CAT_SNK)
    ("Butter Cookies Royal Selection 400g", "CAT_SNK", "400g tin", 180.0, 250.0, 115, 100, 25, 3),
    ("Digestive High Fiber Biscuits 1kg", "CAT_SNK", "1kg pack", 145.0, 195.0, 160, 130, 30, 2),
    ("Bourbon Chocolate Cream Biscuits 300g", "CAT_SNK", "300g pack", 38.0, 50.0, 240, 160, 40, 2),
    ("Salted Cashew Crunch Cookies 250g", "CAT_SNK", "250g box", 95.0, 130.0, 75, 80, 20, 3),
    ("Classic Salted Potato Chips 150g", "CAT_SNK", "150g bag", 40.0, 55.0, 310, 200, 45, 2),
    ("Spicy Pudina Lime Chips 150g", "CAT_SNK", "150g bag", 40.0, 55.0, 190, 180, 40, 2),
    ("Aloo Bhujia Namkeen 1kg", "CAT_SNK", "1kg pouch", 190.0, 260.0, 140, 120, 30, 3),
    ("Khatta Meetha Mixture Namkeen 1kg", "CAT_SNK", "1kg pouch", 175.0, 240.0, 125, 110, 25, 3),
    ("Roasted Salted Peanuts 500g", "CAT_SNK", "500g pouch", 110.0, 150.0, 95, 85, 20, 3),
    ("Dark Chocolate 70% Cocoa 100g", "CAT_SNK", "100g bar", 115.0, 160.0, 80, 75, 18, 4),

    # Personal Care & Hygiene (CAT_PC)
    ("Neem & Aloe Herbal Bath Soap (Pack of 5)", "CAT_PC", "5x125g pack", 160.0, 215.0, 140, 130, 30, 3),
    ("Moisturizing Cream Bathing Bar 4x100g", "CAT_PC", "4 pack", 195.0, 260.0, 110, 110, 25, 3),
    ("Anti-Dandruff Scalp Shampoo 650ml", "CAT_PC", "650ml pump", 380.0, 499.0, 65, 85, 20, 4),
    ("Keratin Smooth Conditioner 300ml", "CAT_PC", "300ml bottle", 220.0, 295.0, 55, 65, 15, 4),
    ("Ayurvedic Clove & Mint Toothpaste 200g", "CAT_PC", "200g tube", 95.0, 130.0, 230, 150, 35, 2),
    ("Charcoal Deep Clean Toothbrush (Pack of 4)", "CAT_PC", "4 pack", 110.0, 160.0, 140, 100, 20, 3),
    ("Gentle Hydrating Face Wash 150ml", "CAT_PC", "150ml tube", 165.0, 230.0, 85, 90, 20, 3),
    ("Vitamin C Brightening Face Serum 30ml", "CAT_PC", "30ml dropper", 390.0, 550.0, 45, 60, 15, 4),
    ("SPF 50 Sunscreen Gel 100g", "CAT_PC", "100g tube", 260.0, 360.0, 60, 70, 18, 4),
    ("Deep Moisture Body Lotion 400ml", "CAT_PC", "400ml pump", 240.0, 330.0, 70, 85, 20, 3),

    # Household & Cleaning (CAT_HHC)
    ("Front Load Detergent Liquid 2L", "CAT_HHC", "2L bottle", 360.0, 475.0, 80, 110, 25, 3),
    ("Detergent Washing Powder 4kg Super Value", "CAT_HHC", "4kg pack", 420.0, 540.0, 160, 140, 35, 3),
    ("Concentrated Dishwash Gel Lemon 1.5L", "CAT_HHC", "1.5L bottle", 195.0, 260.0, 130, 120, 30, 2),
    ("Citrus Floor Disinfectant Cleaner 2L", "CAT_HHC", "2L bottle", 210.0, 285.0, 95, 100, 25, 3),
    ("Toilet Disinfectant Power Cleaner 1L", "CAT_HHC", "1L bottle", 130.0, 175.0, 150, 120, 30, 2),
    ("Fabric Softener Floral Breeze 1L", "CAT_HHC", "1L bottle", 175.0, 235.0, 65, 75, 18, 3),
    ("Garbage Bags Medium 30s Roll (Pack of 3)", "CAT_HHC", "3x30 pack", 160.0, 225.0, 120, 90, 20, 3),
    ("Microfiber Multi-Surface Cleaning Cloth (4s)", "CAT_HHC", "4 pack", 140.0, 199.0, 90, 70, 15, 3),
    ("Mosquito Repellent Liquid Refill (Pack of 4)", "CAT_HHC", "4 refills", 240.0, 320.0, 110, 95, 20, 3),
    ("Kitchen Paper Towel Rolls (Pack of 4)", "CAT_HHC", "4 rolls", 180.0, 245.0, 85, 80, 18, 2),

    # Packaged Foods & Noodles (CAT_PKG)
    ("Masala Instant Noodles (12-Pack Family Pack)", "CAT_PKG", "840g pack", 135.0, 175.0, 280, 200, 45, 2),
    ("Whole Wheat Durum Wheat Pasta 500g", "CAT_PKG", "500g box", 85.0, 120.0, 110, 90, 20, 3),
    ("Classic Tomato Ketchup 1kg Squeezy", "CAT_PKG", "1kg bottle", 110.0, 150.0, 170, 130, 30, 2),
    ("Sweet Chilli Sauce 500g", "CAT_PKG", "500g bottle", 85.0, 115.0, 65, 70, 15, 3),
    ("Mayonnaise Creamy Eggless 800g", "CAT_PKG", "800g jar", 165.0, 225.0, 90, 85, 20, 3),
    ("Instant Sweet Corn Soup (Pack of 4)", "CAT_PKG", "4x50g box", 95.0, 130.0, 130, 90, 20, 3),
    ("Breakfast Crunchy Peanut Butter 1kg", "CAT_PKG", "1kg jar", 280.0, 375.0, 85, 80, 20, 3),
    ("Mixed Fruit Spread Jam 1kg", "CAT_PKG", "1kg glass jar", 195.0, 260.0, 110, 95, 20, 3),
    ("Ready To Eat Paneer Butter Masala 300g", "CAT_PKG", "300g pack", 95.0, 135.0, 50, 70, 15, 3),
    ("Ready To Eat Dal Makhani 300g", "CAT_PKG", "300g pack", 85.0, 120.0, 60, 70, 15, 3),

    # Baby & Healthcare (CAT_BBY)
    ("Premium Diaper Pants Large 60s", "CAT_BBY", "60 pants pack", 680.0, 899.0, 75, 90, 20, 4),
    ("Gentle Baby Wet Wipes Aloe Vera 72s (Pack of 3)", "CAT_BBY", "3x72 wipes", 240.0, 340.0, 110, 100, 25, 3),
    ("Baby Gentle Tear-Free Shampoo 400ml", "CAT_BBY", "400ml bottle", 220.0, 299.0, 50, 60, 15, 3),
    ("Baby Nourishing Massage Oil 200ml", "CAT_BBY", "200ml bottle", 175.0, 240.0, 60, 65, 15, 3),
    ("Herbal Immunity Booster Chyawanprash 1kg", "CAT_BBY", "1kg jar", 310.0, 410.0, 85, 90, 20, 3),
    ("Effervescent Vitamin C 1000mg 20 Tabs", "CAT_BBY", "20 tube", 195.0, 275.0, 70, 75, 15, 3),
    ("Medical Alcohol Hand Rub Sanitizer 500ml", "CAT_BBY", "500ml pump", 110.0, 160.0, 95, 80, 20, 2),
    ("Cotton Crepe Bandage Medical Roll 10cm", "CAT_BBY", "1 roll", 65.0, 95.0, 80, 50, 15, 3),

    # Baking & Dessert Essentials (CAT_BAK)
    ("Pure Sulphurless White Sugar 5kg", "CAT_BAK", "5kg bag", 215.0, 270.0, 310, 180, 40, 2),
    ("Organic Solid Jaggery Gur 1kg", "CAT_BAK", "1kg block", 75.0, 105.0, 140, 110, 25, 3),
    ("Unsweetened Dutch Cocoa Powder 250g", "CAT_BAK", "250g can", 195.0, 270.0, 45, 60, 15, 4),
    ("Pure Vanilla Extract 100ml", "CAT_BAK", "100ml bottle", 260.0, 360.0, 35, 45, 10, 4),
    ("Baking Powder Double Acting 200g", "CAT_BAK", "200g can", 65.0, 90.0, 90, 65, 15, 3),
    ("Chocolate Vermicelli Sprinkles 200g", "CAT_BAK", "200g jar", 80.0, 115.0, 60, 50, 12, 3),
    ("Condensed Sweetened Milk 400g Tin", "CAT_BAK", "400g tin", 115.0, 150.0, 120, 95, 20, 3),

    # Dry Fruits & Nuts (CAT_DFN)
    ("California Premium Almonds Badam 1kg", "CAT_DFN", "1kg zip pouch", 780.0, 980.0, 65, 85, 20, 4),
    ("Whole White Cashews Kaju W240 1kg", "CAT_DFN", "1kg zip pouch", 840.0, 1060.0, 55, 75, 18, 4),
    ("Kashmiri Walnut Kernels Akhrot 500g", "CAT_DFN", "500g vacuum", 490.0, 640.0, 40, 55, 12, 5),
    ("Green Seedless Golden Raisins Kishmish 1kg", "CAT_DFN", "1kg pouch", 320.0, 420.0, 85, 90, 20, 3),
    ("Roasted Salted Pistachios Pista 500g", "CAT_DFN", "500g pouch", 540.0, 690.0, 45, 60, 15, 4),
    ("Medjool Royal Dates 500g", "CAT_DFN", "500g box", 380.0, 499.0, 50, 65, 15, 4),
    ("Dried Cranberries Antioxidant 500g", "CAT_DFN", "500g pouch", 340.0, 450.0, 38, 50, 12, 4),
    ("Chia Seeds High Omega-3 500g", "CAT_DFN", "500g jar", 195.0, 275.0, 70, 65, 15, 3),
]

def seed_database_data(db: Session) -> Dict[str, Any]:
    """
    Seeds rich, realistic retail inventory data for 105+ products, 12 categories, 12 suppliers,
    12+ months of sales history with seasonal effects, ML predictions, and supplier allocations.
    """
    # 1. Check if already seeded
    user_count = db.query(User).count()
    if user_count > 0:
        return {"status": "already_seeded", "message": "Database already contains seed data."}

    print("Seeding Users...")
    # Seed Users
    users = [
        User(
            email="admin@smartinventory.ai",
            full_name="Harsh Vardhan (Administrator)",
            hashed_password=get_password_hash("admin123"),
            role="ADMIN",
            is_active=True
        ),
        User(
            email="manager@smartinventory.ai",
            full_name="Priya Sharma (Inventory Manager)",
            hashed_password=get_password_hash("manager123"),
            role="INVENTORY_MANAGER",
            is_active=True
        ),
        User(
            email="staff@smartinventory.ai",
            full_name="Rahul Verma (Procurement Staff)",
            hashed_password=get_password_hash("staff123"),
            role="STAFF",
            is_active=True
        )
    ]
    db.add_all(users)
    db.commit()

    print("Seeding Categories...")
    category_map = {}
    for cat_data in CATEGORIES_DATA:
        c = Category(name=cat_data["name"], code=cat_data["code"], description=cat_data["description"])
        db.add(c)
        db.flush()
        category_map[cat_data["code"]] = c.id
    db.commit()

    print("Seeding Suppliers...")
    supplier_objs = []
    for s_data in SUPPLIERS_DATA:
        s = Supplier(
            name=s_data["name"],
            contact_email=s_data["contact_email"],
            phone=s_data["phone"],
            city=s_data["city"],
            address=f"Industrial Zone Sector {random.randint(1, 25)}, {s_data['city']}",
            on_time_rate=s_data["on_time_rate"],
            quality_score=s_data["quality_score"],
            reliability_score=s_data["reliability_score"],
            payment_terms=s_data["payment_terms"]
        )
        db.add(s)
        supplier_objs.append(s)
    db.commit()

    print("Seeding Products and Supplier Quotes...")
    product_objs = []
    supplier_ids = [s.id for s in supplier_objs]

    for idx, (p_name, cat_code, unit, cost, price, stock, reorder, safety, lead) in enumerate(RAW_PRODUCTS, start=1):
        sku = f"SKU-{cat_code.replace('CAT_', '')}-{1000 + idx}"
        
        # Calculate ABC & XYZ based on value and volume
        annual_val = cost * stock
        if annual_val > 50000:
            abc = "A"
        elif annual_val > 18000:
            abc = "B"
        else:
            abc = "C"

        xyz = random.choice(["X", "X", "Y", "Y", "Z"]) if idx > 20 else ("X" if idx % 2 == 0 else "Y")

        prod = Product(
            sku=sku,
            name=p_name,
            description=f"Authentic retail grade {p_name} ({unit}). Packaged for retail distribution.",
            category_id=category_map[cat_code],
            unit=unit,
            unit_cost=cost,
            selling_price=price,
            current_stock=stock,
            min_stock=safety,
            max_stock=reorder * 3,
            reorder_point=reorder,
            safety_stock=safety,
            lead_time_days=lead,
            abc_class=abc,
            xyz_class=xyz,
            is_active=True
        )
        db.add(prod)
        db.flush()
        product_objs.append(prod)

        # Assign 2 to 4 competing suppliers per product
        selected_supps = random.sample(supplier_ids, k=random.randint(2, 4))
        for s_rank, s_id in enumerate(selected_supps):
            # Price variation +/- 5% to 10%
            cost_factor = random.uniform(0.93, 1.07)
            quote_cost = round(cost * cost_factor, 2)
            supp_lead = max(1, lead + random.choice([-1, 0, 1, 2]))
            moq = random.choice([5, 10, 20, 25, 50])
            
            is_pref = (s_rank == 0)
            sp = SupplierProduct(
                supplier_id=s_id,
                product_id=prod.id,
                supplier_sku=f"SUP-{s_id}-{prod.id}",
                unit_cost=quote_cost,
                lead_time_days=supp_lead,
                moq=moq,
                reliability_score=round(random.uniform(88.0, 99.0), 1),
                quality_score=round(random.uniform(90.0, 99.0), 1),
                is_preferred=is_pref
            )
            db.add(sp)

    db.commit()

    print("Generating 12 Months Historical Daily Sales Data...")
    # Generate daily sales transactions spanning last 365 days
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=365)
    current_date = start_date

    sales_records = []
    sales_item_records = []
    
    invoice_counter = 10001
    
    # Store items for batch commit
    day_idx = 0
    while current_date <= end_date:
        # Weekend sales boost
        is_weekend = current_date.weekday() in [5, 6]
        # Festival/Month-end spikes
        is_festive = current_date.month in [10, 11, 12] or (current_date.day in [1, 2, 3, 28, 29, 30])

        # Random sample of products sold each day
        num_sales_today = random.randint(15, 30) if is_weekend else random.randint(10, 20)
        
        for _ in range(num_sales_today):
            inv_num = f"INV-{current_date.strftime('%Y%m')}-{invoice_counter}"
            invoice_counter += 1

            # Sale header
            num_items = random.randint(2, 6)
            chosen_prods = random.sample(product_objs, k=num_items)

            total_inv_amount = 0.0
            sale_obj = Sale(
                invoice_number=inv_num,
                sale_date=current_date,
                total_amount=0.0,
                channel=random.choice(["In-Store", "In-Store", "In-Store", "Online", "Wholesale"]),
                status="Completed",
                created_at=current_date
            )
            db.add(sale_obj)
            db.flush()

            for p in chosen_prods:
                base_qty = random.randint(1, 4)
                if is_weekend:
                    base_qty += random.randint(1, 3)
                if is_festive and random.random() > 0.6:
                    base_qty += random.randint(2, 5)

                promo = (current_date.day % 7 == 0) and random.random() > 0.7
                disc = 0.10 if promo else 0.0
                line_price = round(p.selling_price * (1 - disc), 2)
                line_total = round(line_price * base_qty, 2)
                total_inv_amount += line_total

                s_item = SalesItem(
                    sale_id=sale_obj.id,
                    product_id=p.id,
                    quantity=base_qty,
                    unit_price=line_price,
                    total_price=line_total,
                    discount=disc,
                    sale_date=current_date,
                    promotion_flag=promo
                )
                db.add(s_item)

            sale_obj.total_amount = round(total_inv_amount, 2)

        current_date += timedelta(days=1)
        day_idx += 1
        if day_idx % 60 == 0:
            db.commit()

    db.commit()

    print("Generating Purchase Orders...")
    po_statuses = ["Received", "Received", "Ordered", "Approved", "Submitted", "Draft"]
    for po_idx in range(1, 15):
        s_obj = random.choice(supplier_objs)
        po_date = end_date - timedelta(days=random.randint(2, 90))
        exp_date = po_date + timedelta(days=random.randint(3, 10))
        st = random.choice(po_statuses) if po_idx > 3 else "Received"

        po = PurchaseOrder(
            po_number=f"PO-{end_date.strftime('%Y%m')}-{5000 + po_idx}",
            supplier_id=s_obj.id,
            order_date=po_date,
            expected_delivery=exp_date,
            status=st,
            total_amount=0.0,
            budget_allocated=random.choice([75000.0, 100000.0, 150000.0, 200000.0]),
            notes=f"Periodic replenishment order via AI Procurement Optimizer. Vendor {s_obj.name}.",
            created_by="Harsh Vardhan (Admin)",
            created_at=po_date
        )
        db.add(po)
        db.flush()

        po_total = 0.0
        # Pick 3 to 6 products
        po_prods = random.sample(product_objs, k=random.randint(3, 6))
        for p in po_prods:
            qty = random.randint(20, 100)
            cost = p.unit_cost
            tot = round(qty * cost, 2)
            po_total += tot
            item = PurchaseOrderItem(
                po_id=po.id,
                product_id=p.id,
                quantity=qty,
                unit_cost=cost,
                total_cost=tot,
                received_quantity=qty if st == "Received" else 0
            )
            db.add(item)

        po.total_amount = round(po_total, 2)

    db.commit()

    print("Generating Initial AI Recommendations and Alerts...")
    # Find products with stock < reorder point
    for p in product_objs:
        deficit = p.reorder_point - p.current_stock
        if deficit > 0 or p.current_stock < p.safety_stock:
            # High / Critical urgency
            urgency = "CRITICAL" if p.current_stock < p.safety_stock else "HIGH"
            rec_qty = math.ceil((deficit + p.safety_stock * 1.5) / 10.0) * 10
            
            # Find best supplier for this product
            best_sp = db.query(SupplierProduct).filter(SupplierProduct.product_id == p.id).order_by(SupplierProduct.unit_cost.asc()).first()
            supp_id = best_sp.supplier_id if best_sp else supplier_ids[0]
            supp_cost = best_sp.unit_cost if best_sp else p.unit_cost
            est_cost = round(rec_qty * supp_cost, 2)
            std_cost = round(rec_qty * p.unit_cost * 1.08, 2)
            savings = round(max(0.0, std_cost - est_cost), 2)

            rationale = [
                f"Current stock ({p.current_stock} {p.unit}) is below the required reorder point of {p.reorder_point}.",
                f"Machine learning 30-day forecast projects demand velocity of ~{round(p.reorder_point * 1.8)} units.",
                f"Supplier lead time is {p.lead_time_days} days with safety stock requirement of {p.safety_stock} {p.unit}.",
                f"Selected optimal supplier offers lowest unit cost (₹{supp_cost}) with {best_sp.reliability_score if best_sp else 95}% on-time reliability score.",
                f"Ordering recommended quantity yields estimated procurement savings of ₹{savings}."
            ]

            decision_factors = {
                "current_stock": p.current_stock,
                "reorder_point": p.reorder_point,
                "safety_stock": p.safety_stock,
                "lead_time_days": p.lead_time_days,
                "forecast_30d": round(p.reorder_point * 1.8),
                "supplier_reliability": best_sp.reliability_score if best_sp else 95.0,
                "moq": best_sp.moq if best_sp else 10
            }

            rec = AIRecommendation(
                product_id=p.id,
                recommended_supplier_id=supp_id,
                recommended_qty=rec_qty,
                current_stock=p.current_stock,
                reorder_point=p.reorder_point,
                safety_stock=p.safety_stock,
                forecast_30d=float(round(p.reorder_point * 1.8)),
                estimated_cost=est_cost,
                potential_savings=savings,
                urgency=urgency,
                rationale=rationale,
                decision_factors=decision_factors,
                status="Active"
            )
            db.add(rec)

            # Also create inventory alert
            alert_type = "CRITICAL_STOCK" if p.current_stock < p.safety_stock else "LOW_STOCK"
            sev = "CRITICAL" if p.current_stock < p.safety_stock else "HIGH"
            alert = InventoryAlert(
                product_id=p.id,
                alert_type=alert_type,
                severity=sev,
                message=f"Stock alert for {p.name}: Available stock is {p.current_stock} {p.unit} (Reorder threshold: {p.reorder_point} {p.unit}). Immediate replenishment recommended.",
                is_read=False,
                created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48))
            )
            db.add(alert)

        elif p.current_stock > p.max_stock * 0.85:
            # Overstock alert
            excess = p.current_stock - int(p.reorder_point * 1.5)
            locked_cap = round(excess * p.unit_cost, 2)
            alert = InventoryAlert(
                product_id=p.id,
                alert_type="OVERSTOCK",
                severity="MEDIUM",
                message=f"Excess inventory detected in {p.name}: {p.current_stock} {p.unit} on hand. ₹{locked_cap} working capital is currently locked. Recommend promotional bundles or procurement freeze.",
                is_read=False,
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 5))
            )
            db.add(alert)

    # Initial Model Metrics for benchmark transparency
    models_benchmark = [
        ("XGBoost", 2.14, 2.86, 7.82, 0.912, True),
        ("Random Forest", 2.68, 3.42, 9.45, 0.874, False),
        ("Ridge Regression", 3.85, 4.91, 13.20, 0.765, False),
        ("Exponential Smoothing", 4.12, 5.34, 15.60, 0.698, False)
    ]
    for m_name, mae, rmse, mape, r2, is_b in models_benchmark:
        mm = ModelMetric(
            model_name=m_name,
            mae=mae,
            rmse=rmse,
            mape=mape,
            r2_score=r2,
            trained_at=datetime.utcnow(),
            is_best=is_b
        )
        db.add(mm)

    db.commit()
    print("Database seeding successfully completed!")
    return {"status": "success", "message": f"Successfully seeded {len(product_objs)} products, {len(supplier_objs)} suppliers, 12 months sales data."}
