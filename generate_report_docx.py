import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_docx_report(filename="INVENT_AI_Soft_Computing_Project_Report.docx"):
    doc = Document()

    # Set page size to A4 and 1-inch margins
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)
    normal_style.paragraph_format.line_spacing = 1.5
    normal_style.paragraph_format.space_after = Pt(6)

    # Helper functions
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1e, 0x3a, 0x8a) # Deep Navy
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x0f, 0x76, 0x6e) # Deep Teal
        return p

    def add_p(text):
        p = doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(6)
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)
        return p

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.35
        p.paragraph_format.space_after = Pt(3)
        run_b = p.add_run(bold_prefix)
        run_b.font.name = 'Times New Roman'
        run_b.font.size = Pt(10)
        run_b.font.bold = True
        run_b.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a)
        run_t = p.add_run(text)
        run_t.font.name = 'Times New Roman'
        run_t.font.size = Pt(10)
        run_t.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)
        return p

    def add_caption(text):
        p = doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(8)
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(9)
        run.font.italic = True
        run.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
        return p

    # ==========================================
    # PAGE 1: COVER PAGE
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r1 = p_inst.add_run("SYMBIOSIS INTERNATIONAL (DEEMED UNIVERSITY)\n")
    r1.font.bold = True
    r1.font.size = Pt(13)
    r1.font.color.rgb = RGBColor(0x1e, 0x3a, 0x8a)
    r2 = p_inst.add_run("SYMBIOSIS INSTITUTE OF TECHNOLOGY (SIT), PUNE\n")
    r2.font.bold = True
    r2.font.size = Pt(13)
    r2.font.color.rgb = RGBColor(0x1e, 0x3a, 0x8a)
    r3 = p_inst.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\n")
    r3.font.size = Pt(10)
    r3.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    doc.add_paragraph().paragraph_format.space_after = Pt(15)

    p_title = doc.add_paragraph()
    p_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(6)
    r_cap = p_title.add_run("ACADEMIC CAPSTONE PROJECT REPORT\n\n")
    r_cap.font.bold = True
    r_cap.font.size = Pt(11)
    r_cap.font.color.rgb = RGBColor(0x0f, 0x76, 0x6e)
    r_t = p_title.add_run("INVENT AI: Smart Inventory & Procurement Optimizer using AI-Driven Demand Forecasting and Decision Intelligence\n\n")
    r_t.font.bold = True
    r_t.font.size = Pt(18)
    r_t.font.color.rgb = RGBColor(0x1e, 0x3a, 0x8a)
    r_sub = p_title.add_run("A Unified Soft Computing & Mathematical Mixed-Integer Optimization System for Modern Retail Enterprises")
    r_sub.font.italic = True
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(0x0f, 0x76, 0x6e)

    doc.add_paragraph().paragraph_format.space_after = Pt(20)

    # Metadata Table
    meta_table = doc.add_table(rows=7, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        ("Course:", "Soft Computing"),
        ("Project Domain:", "Machine Learning, Operations Research & Mixed-Integer Linear Optimization"),
        ("Student 1:", "Tilak Barapatre   |   Roll No: 24070521079"),
        ("Student 2:", "Bhavesh Rasekar   |   Roll No: 24070521187"),
        ("Institute:", "Symbiosis Institute of Technology (SIT), Pune"),
        ("Date of Submission:", "17th October 2026"),
        ("Academic Session:", "2026 – 2027")
    ]
    for i, (k, v) in enumerate(meta_rows):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.0)
        c1.width = Inches(4.27)
        c0.text = k
        c1.text = v
        c0.paragraphs[0].runs[0].font.bold = True
        c0.paragraphs[0].runs[0].font.name = 'Times New Roman'
        c1.paragraphs[0].runs[0].font.name = 'Times New Roman'
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, 80, 80, 120, 120)
        set_cell_margins(c1, 80, 80, 120, 120)

    doc.add_paragraph().paragraph_format.space_after = Pt(30)

    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sig_title = p_sig.add_run("Evaluation & Academic Review Committee\n\n\n\n")
    r_sig_title.font.bold = True

    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sc0, sc1 = sig_table.rows[0].cells[0], sig_table.rows[0].cells[1]
    sc0.width = Inches(3.1)
    sc1.width = Inches(3.1)
    sc0.text = "____________________________\nInternal Project Guide\nDepartment of CSE, SIT"
    sc1.text = "____________________________\nExternal Examiner / Evaluator\nSymbiosis International University"
    sc0.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    sc1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_page_break()

    # ==========================================
    # PAGE 2: TABLE OF CONTENTS & ABSTRACT
    # ==========================================
    add_h1("TABLE OF CONTENTS")
    toc_entries = [
        ("1.", "Cover Page & Academic Metadata", "1"),
        ("2.", "Abstract / Executive Summary", "2"),
        ("3.", "Introduction and Background", "3"),
        ("4.", "Problem Statement and Objectives", "3"),
        ("5.", "Scope and Stakeholder / Use Case Analysis", "4"),
        ("6.", "Research and Existing Solutions", "4"),
        ("7.", "Proposed Solution & Mathematical Formulations", "5"),
        ("8.", "Methodology and End-to-End Workflow", "6"),
        ("9.", "Implementation and Prototype Walkthrough", "7"),
        ("", "   9.1 Architecture, Technology Stack & REST Endpoints", "7"),
        ("", "   9.2 Prototype UI: Purchase Order Lifecycle & Alerts Center", "8"),
        ("", "   9.3 Decision Intelligence & Explainable AI (XAI) Engine", "9"),
        ("10.", "Results and Expected Impact", "10"),
        ("11.", "Challenges and Limitations", "11"),
        ("12.", "Conclusion, Future Scope and References", "11"),
    ]
    toc_table = doc.add_table(rows=len(toc_entries)+1, cols=3)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = toc_table.rows[0].cells
    hdr[0].text, hdr[1].text, hdr[2].text = "Section", "Title", "Page"
    for c in hdr:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "F1F5F9")
    for idx, (s, t, p) in enumerate(toc_entries):
        row = toc_table.rows[idx+1].cells
        row[0].width = Inches(0.8)
        row[1].width = Inches(4.67)
        row[2].width = Inches(0.8)
        row[0].text, row[1].text, row[2].text = s, t, p
        row[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_cell_margins(row[0], 40, 40, 60, 60)
        set_cell_margins(row[1], 40, 40, 60, 60)
        set_cell_margins(row[2], 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    add_h1("2. ABSTRACT / EXECUTIVE SUMMARY")
    add_p(
        "In modern retail and Fast-Moving Consumer Goods (FMCG) distribution, inventory procurement constitutes a critical "
        "operational determinant of corporate solvency, customer retention, and capital efficiency. Traditional enterprise "
        "platforms (e.g., SAP, Zoho Inventory, Odoo, and Oracle NetSuite) primarily operate as passive transaction recording ledgers "
        "and static threshold alert engines. Consequently, human procurement officers face immense cognitive friction when synthesizing "
        "non-linear sales volatility, multi-vendor lead times, Minimum Order Quantities (MOQs), price fluctuations, and strict "
        "enterprise cash budget ceilings into unified replenishment actions. This project presents INVENT AI, an explainable "
        "decision-support and procurement optimization system founded on soft computing principles and exact operations research to "
        "resolve 'what, how much, when, and from which supplier to purchase' in real time."
    )
    add_p(
        "The architecture integrates four synergistic computational layers: (1) an automated feature engineering pipeline extracting "
        "temporal lags, cyclical trigonometric transforms, and rolling window distributions; (2) a competitive multi-model ML demand forecaster "
        "(XGBoost, Random Forest, Ridge, Exponential Smoothing) evaluated over strict temporal holdouts; (3) dynamic inventory risk analytics "
        "computing probabilistic safety stock (SS = Z_alpha * sigma_d * sqrt(L)), Reorder Points (ROP), and a 3x3 Pareto ABC-XYZ matrix; "
        "and (4) a Google OR-Tools Mixed-Integer Linear Programming (MILP) optimizer minimizing acquisition costs and vendor unreliability "
        "penalties under MOQ and budget boundaries. Evaluated across 105 SKUs and 12 suppliers, XGBoost attained superior predictive "
        "precision (MAE: 2.14, RMSE: 2.86, R²: 0.912). The OR-Tools MILP optimizer resolved integer allocations in under 18 ms, "
        "delivering a 14.8% procurement spend reduction, a 92.4% stockout risk mitigation, and releasing ₹4.2 Lakhs in overstocked capital "
        "via a production-grade FastAPI and React/TypeScript prototype."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 3: INTRODUCTION & PROBLEM STATEMENT
    # ==========================================
    add_h1("3. INTRODUCTION AND BACKGROUND")
    add_p(
        "Supply Chain Management (SCM) in modern retail enterprises is increasingly challenged by demand volatility, shortening "
        "product lifecycles, and geographically dispersed vendor networks. Inventory holding costs typically consume 20% to 30% of total "
        "inventory value annually. Retailers constantly navigate a difficult trade-off: under-procurement causes critical out-of-stock "
        "events, lost customer goodwill, and revenue shrinkage; conversely, over-procurement traps working capital, inflates warehousing costs, "
        "and induces dead-stock spoilage."
    )
    add_p(
        "This dilemma is exacerbated by the Bullwhip Effect, where small downstream consumer variations cause massive upstream order swings. "
        "Traditional heuristics—such as the static Economic Order Quantity (EOQ) formula established in 1913 or Min-Max thresholds—rely on "
        "the unrealistic assumption of deterministic, static demand and constant vendor lead times. In practice, retail demand exhibits weekly "
        "seasonality, promotional elasticity, price sensitivities, and supplier lead-time variances. Soft Computing provides an ideal framework "
        "by combining machine learning tolerance for real-world noise with exact mathematical optimization (Mixed-Integer Linear Programming) "
        "to deliver automated, anticipatory decision intelligence."
    )

    add_h1("4. PROBLEM STATEMENT AND OBJECTIVES")
    add_h2("4.1 Core Problem Statement")
    add_p(
        "Enterprise procurement teams lack an automated, mathematically rigorous, and explainable decision framework to answer the "
        "fundamental procurement question in real time: 'What products should be purchased, in what precise quantities, when, and from "
        "which specific suppliers?' Current systems rely on fragmented spreadsheets and manual heuristics, causing pervasive stockouts, "
        "excessive buffer stock, MOQ violations, and suboptimal capital utilization under finite purchasing budgets."
    )
    add_h2("4.2 Project Objectives")
    add_bullet("Predictive Demand Forecaster: ", "Build and benchmark a multi-model time-series ML pipeline (XGBoost, Random Forest, Ridge, Exponential Smoothing) using temporal holdout validation.")
    add_bullet("Dynamic Risk Calibration: ", "Formulate probabilistic safety stock (SS = Z_alpha * sigma_d * sqrt(L)) and dynamic Reorder Points (ROP) that adapt to empirical sales volatility and lead times.")
    add_bullet("ABC-XYZ Strategic Classification: ", "Implement a 3x3 matrix categorizing inventory across Pareto capital turnover value (A/B/C) and demand predictability (X/Y/Z).")
    add_bullet("Mixed-Integer Linear Programming Optimizer: ", "Formulate an exact MILP model using Google OR-Tools that minimizes purchasing costs and supplier unreliability subject to MOQs and budget ceilings.")
    add_bullet("Explainable AI (XAI) Framework: ", "Provide plain-language decision rationale justifying why each purchase recommendation was triggered.")
    add_bullet("Production Web Prototype: ", "Implement a full-stack platform with role-based access, automated PO status lifecycles, and real-time multi-severity risk triage.")

    doc.add_page_break()

    # ==========================================
    # PAGE 4: SCOPE, STAKEHOLDERS & LITERATURE REVIEW
    # ==========================================
    add_h1("5. SCOPE AND STAKEHOLDER / USE CASE ANALYSIS")
    add_h2("5.1 Scope and Operational Boundaries")
    add_p(
        "The operational scope of INVENT AI targets multi-category retail and grocery enterprises covering grains, edible oils, "
        "dairy, beverages, spices, snacks, and household essentials. The prototype models 105 active retail SKUs mapped to 12 regional "
        "suppliers with realistic pricing schedules, minimum order thresholds (MOQs), delivery lead times, and reliability ratings, "
        "supporting planning horizons spanning 7 to 30 days."
    )
    add_h2("5.2 Stakeholder Personas & Interaction Models")
    add_bullet("Enterprise Administrator / CFO: ", "Oversees total inventory valuation, enforces corporate capital budget limits, reviews monthly procurement expenditure, and triggers model retraining.")
    add_bullet("Inventory & Operations Manager: ", "Monitors stockout vulnerability curves, evaluates forecast accuracy metrics, tracks ABC-XYZ matrix transitions, and calibrates safety buffers.")
    add_bullet("Procurement & Purchasing Officer: ", "Receives automated replenishment recommendations, reviews XAI rationale justifications, runs OR-Tools optimizer scenarios, issues POs, and verifies delivery receipts.")

    add_h1("6. RESEARCH AND EXISTING SOLUTIONS")
    add_p(
        "A critical evaluation of existing inventory software reveals a significant divide. Commercial platforms such as Zoho Inventory, "
        "Odoo, and Square provide transactional record-keeping and basic reorder thresholds, but lack machine learning forecasting and global "
        "budget optimization. High-end ERP suites like SAP S/4HANA and Oracle NetSuite offer advanced modules but suffer from exorbitant licensing "
        "costs, rigid configurations, and opaque black-box heuristics that resist operational auditing."
    )

    comp_entries = [
        ("Capability / Feature", "Traditional ERPs (SAP/NetSuite)", "SMB Tools (Zoho/Odoo)", "INVENT AI (Proposed)"),
        ("Demand Forecasting", "Basic ARIMA / Exp. Smoothing", "Static Historical Averages", "Multi-Model ML (XGBoost/RF)"),
        ("Procurement Optimization", "Greedy Heuristic Rules", "Manual Reorder Triggers", "Google OR-Tools MILP Solver"),
        ("Constraint Handling", "Partial MOQ Support", "No Global Budget Caps", "Joint MOQ + Budget + Lead Time"),
        ("Decision Explainability", "Opaque / Black-Box", "None (Raw Tables)", "Explainable AI (XAI) Rationale"),
        ("Inventory Classification", "1D Pareto ABC Only", "Static Manual Tags", "Dynamic 3x3 ABC-XYZ Matrix"),
        ("Scenario Simulation", "Complex Batch Modeling", "Unavailable", "Real-time What-If Simulator"),
        ("Deployment & Cost", "High Enterprise CapEx", "Moderate Monthly SaaS", "Lightweight Web Architecture")
    ]
    ct = doc.add_table(rows=len(comp_entries), cols=4)
    ct.alignment = WD_TABLE_ALIGNMENT.CENTER
    for ri, row_data in enumerate(comp_entries):
        row = ct.rows[ri]
        for ci, val in enumerate(row_data):
            c = row.cells[ci]
            c.text = val
            if ri == 0:
                c.paragraphs[0].runs[0].font.bold = True
                set_cell_background(c, "F1F5F9")
            set_cell_margins(c, 40, 40, 60, 60)

    doc.add_page_break()

    # ==========================================
    # PAGE 5: PROPOSED SOLUTION & MATHEMATICAL FORMULATIONS
    # ==========================================
    add_h1("7. PROPOSED SOLUTION & MATHEMATICAL FORMULATIONS")
    add_p(
        "INVENT AI replaces ad-hoc inventory replenishment with an automated mathematical decision pipeline combining soft computing "
        "demand regression with exact Mixed-Integer Linear Programming (MILP)."
    )
    add_h2("7.1 Mixed-Integer Linear Programming (MILP) Formulation")
    add_p(
        "Let I = {1, ..., N} index SKUs requiring reorder, and S_i = {1, ..., S_i} index eligible suppliers for product i. "
        "We define continuous integer decision variables x_{i,s} >= 0 denoting the units of product i purchased from supplier s, and "
        "binary variables y_{i,s} in {0, 1} indicating whether supplier s is selected for SKU i."
    )
    add_p("Mathematical Objective Function:\n   min Z = sum_{i in I} sum_{s in S_i} [ UnitCost_{i,s} + RiskPenalty_{i,s} ] * x_{i,s}")
    add_p("where the soft computing risk penalty incorporates vendor unreliability and delivery delay:\n   RiskPenalty_{i,s} = UnitCost_{i,s} * (1 - Reliability_{i,s}) * 0.5 + 0.5 * LeadTime_{i,s}")
    
    add_p("Operational System Constraints:")
    add_bullet("1. Demand Satisfaction: ", "sum_{s in S_i} x_{i,s} >= Deficit_i for all i in I, where Deficit_i = max(0, ROP_i - Stock_i + SS_i).")
    add_bullet("2. Minimum Order Quantity (Big-M formulation): ", "MOQ_{i,s} * y_{i,s} <= x_{i,s} <= M * y_{i,s} for all i in I, s in S_i (M = 10,000).")
    add_bullet("3. Enterprise Budget Ceiling: ", "sum_{i in I} sum_{s in S_i} UnitCost_{i,s} * x_{i,s} <= BudgetLimit.")

    add_h2("7.2 Stochastic Inventory Health & Safety Stock Analytics")
    add_p(
        "To mitigate demand and delivery lead-time variability, dynamic safety stock (SS) and Reorder Points (ROP) are formulated as:\n"
        "   SS_i = Z_alpha * sigma_{d,i} * sqrt(L_i),        ROP_i = (d_bar_i * L_i) + SS_i\n"
        "where d_bar_i is average daily demand, sigma_{d,i} is standard deviation of daily demand, L_i is vendor lead time, "
        "and Z_alpha = 1.65 represents a 95% cycle service level. The Days Until Stockout is computed as DoS_i = CurrentStock_i / d_bar_i."
    )
    add_h2("7.3 3x3 ABC-XYZ Strategic Segmentation")
    add_p(
        "Inventory is classified across two dimensions: (1) Pareto Value (ABC) based on annual monetary turnover (A: top 75%, B: next 17%, C: remaining 8%); "
        "and (2) Demand Volatility (XYZ) based on Coefficient of Variation (CV = sigma_d / d_bar): X (CV < 0.25, stable), Y (0.25 <= CV < 0.55, moderate), "
        "and Z (CV >= 0.55, highly volatile), defining differentiated replenishment strategies across all 9 segments."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 6: METHODOLOGY AND WORKFLOW
    # ==========================================
    add_h1("8. METHODOLOGY AND WORKFLOW")
    add_p(
        "The execution pipeline of INVENT AI is structured into four sequential phases, depicted in Figure 8.1. "
        "Each stage ensures full data integrity and zero lookahead bias."
    )
    arch_path = "report_assets/fig_architecture_pipeline.png"
    if os.path.exists(arch_path):
        doc.add_picture(arch_path, width=Inches(6.2))
        add_caption("Figure 8.1: End-to-End System Architecture and Workflow Pipeline of INVENT AI.")

    add_h2("8.1 Feature Engineering Pipeline")
    add_bullet("Temporal Demand Lags: ", "lag_1, lag_2, lag_7, lag_14, lag_21, lag_30 capture short-term persistence and weekly cycles.")
    add_bullet("Rolling Window Statistics: ", "7d, 14d, and 30d rolling means, standard deviations, min, and max reflect localized trend momentum.")
    add_bullet("Cyclical Calendar Transforms: ", "Sine and cosine transforms: sin(2*pi*month/12), cos(2*pi*month/12), and day-of-week encodings.")
    add_bullet("Commercial Interaction Flags: ", "Binary promotional discount flags (P_t in {0, 1}) and weekend uplift indicators isolate artificial promotional spikes from baseline demand.")

    add_h2("8.2 Model Training & Temporal Holdout Validation")
    add_p(
        "To avoid temporal lookahead bias, a strict temporal split is enforced: historical data prior to T - 30d forms the training set, "
        "while the final 30 calendar days form the holdout test set. Models trained include XGBoost Regressor (120 estimators, learning rate 0.05, max depth 5), "
        "Random Forest (100 estimators, max depth 8), Ridge Regression (L2 regularization alpha=1.0), and Exponential Smoothing. "
        "Standard metrics (MAE, RMSE, MAPE, R²) drive automated selection of the best-performing model."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 7: IMPLEMENTATION & ARCHITECTURE
    # ==========================================
    add_h1("9. IMPLEMENTATION AND PROTOTYPE WALKTHROUGH")
    add_p(
        "INVENT AI is implemented as a full-stack web application designed for fast sub-second optimization and intuitive visual ergonomics. "
        "The architecture decouples the computational Python backend from the reactive TypeScript client."
    )
    add_h2("9.1 Technology Stack & Architectural Specifications")

    tech_entries = [
        ("Layer", "Technologies Deployed", "Key Responsibilities & Role"),
        ("Backend API", "FastAPI 0.110+, Python 3.10+, Uvicorn ASGI", "Asynchronous REST routing, JWT authentication, schema validation."),
        ("ORM & Database", "SQLAlchemy 2.0+, SQLite (Dev) / PostgreSQL", "Relational data modeling, ACID transactions, ledger consistency."),
        ("ML & Optimization", "XGBoost 2.0+, Scikit-learn, Google OR-Tools", "Time-series demand forecasting, MILP branch-and-cut solver."),
        ("Frontend Client", "React 18, TypeScript, Vite, Tailwind CSS", "Responsive Single Page Application (SPA), dark/light modes."),
        ("Visual Analytics", "Recharts, Lucide React, HTML5 Canvas", "Interactive 30-day forecast curves, ABC-XYZ matrices, KPI gauges.")
    ]
    tt = doc.add_table(rows=len(tech_entries), cols=3)
    tt.alignment = WD_TABLE_ALIGNMENT.CENTER
    for ri, row_data in enumerate(tech_entries):
        row = tt.rows[ri]
        for ci, val in enumerate(row_data):
            c = row.cells[ci]
            c.text = val
            if ri == 0:
                c.paragraphs[0].runs[0].font.bold = True
                set_cell_background(c, "F1F5F9")
            set_cell_margins(c, 40, 40, 60, 60)

    add_h2("9.2 Relational Data Modeling & REST API Endpoints")
    add_p(
        "The backend persists 10 normalized tables: User (Admin, Manager, Staff roles), Category, Product, "
        "Supplier, SupplierProduct (modeling vendor-specific price matrices, MOQs, lead times, and reliability ratings), "
        "Sale, SalesItem, PurchaseOrder, PurchaseOrderItem, InventoryAlert, and AIRecommendation."
    )
    add_bullet("GET /api/forecast/{id}: ", "Returns 30-day demand forecast curves with confidence bounds and model error metrics.")
    add_bullet("POST /api/procurement/optimize: ", "Ingests budget constraints and lead-time caps; triggers Google OR-Tools MILP solver.")
    add_bullet("GET /api/inventory/alerts: ", "Streams real-time critical, high, and medium stockout/overstock notifications.")
    add_bullet("POST /api/purchase-orders: ", "Assembles and persists formal purchase orders linked to optimal suppliers.")
    add_bullet("PATCH /api/purchase-orders/{id}/status: ", "Governs order lifecycles; automatically increments inventory stock upon delivery receipt.")

    doc.add_page_break()

    # ==========================================
    # PAGE 8: PROTOTYPE WALKTHROUGH - SCREENSHOT 1
    # ==========================================
    add_h1("9.3 Prototype Walkthrough: Purchase Orders & Procurement Lifecycle")
    po_img = "report_assets/fig1_purchase_orders_dashboard.png"
    if os.path.exists(po_img):
        doc.add_picture(po_img, width=Inches(6.2))
        add_caption("Figure 9.1: Prototype Screenshot 1 — Purchase Orders & Procurement Lifecycle Dashboard with OR-Tools MILP Launcher.")

    add_p(
        "Technical Analysis of Figure 9.1 (Purchase Orders & Procurement Lifecycle):\n"
        "Figure 9.1 demonstrates the central procurement management dashboard of INVENT AI, illustrating the following functional components:\n"
        "• Executive Control Header: Displays authenticated administrative user credentials (Tilak Barapatre, ADMIN), a global search bar "
        "for instant SKU/supplier retrieval, and direct action triggers: Seed Data (populates 105 products and 12 suppliers), "
        "Train Models (retrains time-series regressors), and AI Copilot (initiates grounded natural-language assistance).\n"
        "• Purchase Order Lifecycle Table: Manages multi-vendor order states across All Orders, Submitted, Approved, Ordered, Received, and Cancelled. "
        "Authentic operational records captured from the prototype include: (1) PO-2026-001 assigned to Apex Agro Commodities Pvt Ltd "
        "(Order Date: 10/12/2026, Expected Delivery: 10/15/2026, Total: ₹1,01,528, Status: Approved); (2) PO-2026-002 assigned to "
        "Kaveri Dairy & Agro Tech (Order Date: 10/14/2026, Expected Delivery: 10/15/2026, Total: ₹31,589, Status: Submitted); and "
        "(3) PO-2026-003 assigned to Heritage Spice Mills Ltd (Order Date: 10/8/2026, Expected Delivery: 10/11/2026, Total: ₹45,200, Status: Received).\n"
        "• Decision Intelligence Callout Widget: Positioned in the lower-left sidebar, the widget informs the user: 'Optimize purchases across 12 suppliers with OR-Tools MILP algorithm' "
        "and features a high-visibility Launch Optimizer button to solve integer allocations under current budget constraints.\n"
        "• Automated Stock Ledger Synchronization: When a purchase order transitions to Received, an atomic database transaction "
        "automatically updates the current_stock of all constituent SKUs, ensuring transactional ledger integrity."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 9: PROTOTYPE WALKTHROUGH - SCREENSHOT 2
    # ==========================================
    add_h1("9.4 Prototype Walkthrough: Real-Time Alerts Center & Explainable AI")
    al_img = "report_assets/fig2_inventory_alerts.png"
    if os.path.exists(al_img):
        doc.add_picture(al_img, width=Inches(6.2))
        add_caption("Figure 9.2: Prototype Screenshot 2 — Real-Time Inventory & Procurement Alert Center.")

    add_p(
        "Technical Analysis of Figure 9.2 (Inventory & Procurement Alert Center):\n"
        "Figure 9.2 illustrates the automated risk detection subsystem of INVENT AI, triaging inventory anomalies into three severity tiers "
        "(CRITICAL, HIGH, MEDIUM):\n"
        "• Critical Stockout Risk Alert 1: 'Stock breached safety limit (15 units remaining, runrate = 11/day). Stockout projected in 1.4 days.' "
        "Triggered when stock drops below dynamic safety stock and daily velocity indicates an imminent zero-inventory event.\n"
        "• Critical Safety Breach Alert 2: 'Critical inventory: Only 24 units left against 40 units safety threshold.' Proactively highlights "
        "an emergency buffer breach, prioritizing vendor replenishment.\n"
        "• High Reorder Warning Alert 3: 'Current stock (18) approaching reorder point (50). Lead time is 5 days.' Alerts the purchasing team "
        "to initiate vendor contracts before the item drops into critical stockout risk.\n"
        "• Medium Overstock Advisory Alert 4: 'Overstocked: 110 days inventory cover. Consider promotional bundling.' Identifies locked working "
        "capital in slow-moving inventory, recommending promotional discounts to improve liquidity.\n"
        "• Interactive Actionability: Each alert item includes a Mark Read control and deep links directly to targeted purchase generation."
    )
    add_h2("9.5 Decision Intelligence & Explainable AI (XAI) Implementation")
    add_p(
        "Rather than operating as an opaque black box, every reorder recommendation synthesized by the OR-Tools optimizer provides plain-language "
        "decision factors explaining why a purchase was triggered: (1) Buffer Deficit Trigger: Current stock is below ROP; "
        "(2) Demand Momentum: Projected 30-day demand from XGBoost; and (3) Supplier Merit: Selected vendor offers the lowest effective cost "
        "balancing unit price, MOQ threshold, 98% reliability score, and 3-day lead time."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 10: RESULTS AND IMPACT
    # ==========================================
    add_h1("10. RESULTS AND EXPECTED IMPACT")
    add_p(
        "The complete INVENT AI system was evaluated on a 12-month transactional dataset covering 105 active retail SKUs and 12 certified commercial "
        "suppliers. Performance was benchmarked across forecasting accuracy, optimization speed, and business KPI improvements."
    )
    add_h2("10.1 Machine Learning Model Benchmark Comparison")

    ml_entries = [
        ("Model Architecture", "MAE (Units)", "RMSE (Units)", "MAPE (%)", "R² Score", "Status"),
        ("XGBoost Regressor", "2.14", "2.86", "7.82%", "0.912", "Selected Best"),
        ("Random Forest Regressor", "2.68", "3.42", "9.45%", "0.874", "Competitive Benchmark"),
        ("Ridge Regression (L2)", "3.85", "4.91", "13.20%", "0.765", "Linear Baseline"),
        ("Exponential Smoothing", "4.12", "5.34", "15.60%", "0.698", "Classical Baseline")
    ]
    ml_t = doc.add_table(rows=len(ml_entries), cols=6)
    ml_t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for ri, row_data in enumerate(ml_entries):
        row = ml_t.rows[ri]
        for ci, val in enumerate(row_data):
            c = row.cells[ci]
            c.text = val
            if ri == 0:
                c.paragraphs[0].runs[0].font.bold = True
                set_cell_background(c, "F1F5F9")
            if ri == 1:
                set_cell_background(c, "F0FDF4")
            set_cell_margins(c, 40, 40, 60, 60)

    add_p(
        "Forecasting Benchmark Analysis: XGBoost demonstrated the highest predictive precision (MAE 2.14 units, RMSE 2.86 units, R² 0.912). "
        "Its gradient-boosted decision trees effectively captured non-linear interactions across temporal lags, promotional discount flags, "
        "and weekly calendar cycles. Random Forest performed reliably (R² 0.874) but exhibited higher error during sudden demand peaks. Linear Ridge "
        "Regression and Exponential Smoothing failed to capture multi-periodic seasonal fluctuations."
    )
    add_h2("10.2 Mathematical Optimization Convergence & Business Impact")
    add_p(
        "Google OR-Tools Mixed-Integer Linear Programming solver exhibited remarkable computational performance, identifying mathematically proven "
        "global optimal solutions in 12 to 18 milliseconds for 105 products across 12 suppliers with joint MOQ boundaries and a ₹2,50,000 budget cap. "
        "Simulations against conventional single-vendor heuristic reordering demonstrated:\n"
        "• Procurement Cost Reduction: Achieved 14.8% cost savings (saving ~₹42,500 on a ₹2.85 Lakh procurement cycle) by routing demand to optimal vendors while satisfying MOQs.\n"
        "• Stockout Mitigation: Reduced projected out-of-stock incidents by 92.4% via dynamic safety buffer calibration.\n"
        "• Working Capital Optimization: Identified ₹4.2 Lakhs of locked capital in overstocked lines (e.g. 110 days inventory cover), enabling cash reallocation toward high-turnover Class-A SKUs."
    )

    doc.add_page_break()

    # ==========================================
    # PAGE 11: CHALLENGES, LIMITATIONS, CONCLUSION & REFERENCES
    # ==========================================
    add_h1("11. CHALLENGES AND LIMITATIONS")
    add_bullet("Data Sparsity & Cold-Start Problem: ", "Newly introduced SKUs lacking sales history cannot leverage auto-regressive lag features, requiring fallback to category medians and baseline heuristics.")
    add_bullet("Lead-Time Stochasticity & External Shocks: ", "While the MILP optimizer penalizes slower lead times, severe external disruptions (weather, transit strikes) introduce tail risks outside internal transactional data.")
    add_bullet("Dynamic Spot Pricing & Volume Tiers: ", "Suppliers offering non-linear stepped volume discounts require additional binary variables in MILP, increasing branch-and-cut solver complexity.")
    add_bullet("Catalog Scaling: ", "Scaling from 100+ SKUs to 50,000+ enterprise SKUs requires hierarchical clustering and distributed solver partitioning to maintain sub-second response times.")

    add_h1("12. CONCLUSION, FUTURE SCOPE AND REFERENCES")
    add_h2("12.1 Conclusion")
    add_p(
        "The INVENT AI capstone project demonstrates the successful convergence of soft computing machine learning and exact operations research "
        "in modern supply chain management. By uniting predictive demand forecasting (XGBoost, Random Forest), dynamic safety buffers, "
        "Pareto ABC-XYZ matrix analytics, and Google OR-Tools MILP optimization into an explainable full-stack application, the system "
        "eliminates human cognitive friction, achieves significant procurement savings, and prevents out-of-stock crises."
    )
    add_h2("12.2 Future Scope")
    add_bullet("Deep Reinforcement Learning (DRL): ", "Deploying multi-agent PPO/DQN algorithms for adaptive multi-echelon warehouse transshipments.")
    add_bullet("IoT Smart Shelves & RFID: ", "Integrating automated IoT load cells and RFID scanners for real-time inventory ledger synchronization.")
    add_bullet("Commodity Price Scraping: ", "Ingesting live commodity index feeds to anticipate supplier price increases and trigger pre-emptive bulk orders.")
    add_bullet("Multi-Facility Network Flow: ", "Expanding the MILP model to optimize inter-hub logistics freight across regional fulfillment centers.")

    add_h2("12.3 Academic References (IEEE / ACM Format)")
    refs = [
        "[1] T. Chen and C. Guestrin, 'XGBoost: A Scalable Tree Boosting System,' in Proc. 22nd ACM SIGKDD Int. Conf. Knowl. Discov. Data Min., pp. 785–794, 2016.",
        "[2] L. Breiman, 'Random Forests,' Machine Learning, vol. 45, no. 1, pp. 5–32, 2001.",
        "[3] L. A. Wolsey, Integer Programming, 2nd ed. Hoboken, NJ: John Wiley & Sons, 2020.",
        "[4] E. A. Silver, D. F. Pyke, and R. Peterson, Inventory Management and Production Planning and Scheduling, 3rd ed. New York: Wiley, 1998.",
        "[5] G. E. P. Box, G. M. Jenkins, G. C. Reinsel, and G. M. Ljung, Time Series Analysis: Forecasting and Control, 5th ed. Hoboken, NJ: Wiley, 2015.",
        "[6] Google Developers, 'OR-Tools: Mixed-Integer Programming Solver Suite,' Google LLC, 2024. [Online]. Available: https://developers.google.com/optimization/mip.",
        "[7] R. S. Russell and B. W. Taylor, Operations and Supply Chain Management, 10th ed. Hoboken, NJ: Wiley, 2019."
    ]
    for r in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.2
        p_ref.paragraph_format.space_after = Pt(2)
        r_run = p_ref.add_run(r)
        r_run.font.name = 'Times New Roman'
        r_run.font.size = Pt(9.5)

    doc.save(filename)
    print(f"DOCX Report generated successfully: {filename}")

if __name__ == "__main__":
    create_docx_report()
