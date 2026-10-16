import matplotlib.pyplot as plt
import matplotlib.patches as patches

def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 50)
    ax.axis('off')

    # Color palette
    c_blue = '#1e3a8a'
    c_teal = '#0f766e'
    c_green = '#15803d'
    c_purple = '#6b21a8'
    c_amber = '#b45309'
    c_box = '#f8fafc'
    c_border = '#cbd5e1'

    # Main title
    ax.text(50, 47, 'INVENT AI: End-to-End Soft Computing & Optimization Architecture', 
            ha='center', va='center', fontsize=12, fontweight='bold', color='#0f172a')

    stages = [
        ("1. Data Ingestion\n& Feature Eng.", 
         ["12+ Mo Sales Data", "Lags (1, 7, 14, 30d)", "Rolling Mean/Std", "Cyclical Sine/Cosine"], 
         c_blue, 10),
        ("2. Multi-Model\nDemand Forecaster", 
         ["XGBoost Regressor", "Random Forest", "Ridge Regression", "Exp. Smoothing Baseline"], 
         c_teal, 35),
        ("3. Risk & Safety\nStock Analytics", 
         ["Dynamic ROP & SS", "Pareto ABC Matrix", "XYZ Volatility (CV)", "Stockout Prob. (1.4d)"], 
         c_amber, 60),
        ("4. OR-Tools MILP\nProcurement Engine", 
         ["Multi-Supplier MOQs", "Budget Constraints", "Lead-Time Penalty", "Explainable AI (XAI)"], 
         c_purple, 85)
    ]

    for title, bullets, col, x_center in stages:
        # Card box
        rect = patches.FancyBboxPatch((x_center - 11, 8), 22, 34, 
                                      boxstyle="round,pad=0.8,rounding_size=2", 
                                      facecolor=c_box, edgecolor=col, linewidth=2)
        ax.add_patch(rect)
        
        # Header banner
        header_rect = patches.FancyBboxPatch((x_center - 11, 35), 22, 7, 
                                             boxstyle="round,pad=0.4,rounding_size=1", 
                                             facecolor=col, edgecolor=col, linewidth=1)
        ax.add_patch(header_rect)
        ax.text(x_center, 38.5, title, ha='center', va='center', 
                fontsize=8.5, fontweight='bold', color='white', multialignment='center')

        # Bullets
        y_pos = 30
        for b in bullets:
            ax.text(x_center - 9.5, y_pos, f"• {b}", ha='left', va='center', 
                    fontsize=7.2, color='#334155')
            y_pos -= 5.5

    # Arrows between stages
    arrow_props = dict(facecolor='#475569', edgecolor='#475569', width=1.5, headwidth=6, headlength=6)
    ax.annotate('', xy=(23, 25), xytext=(21.5, 25), arrowprops=arrow_props)
    ax.annotate('', xy=(48, 25), xytext=(46.5, 25), arrowprops=arrow_props)
    ax.annotate('', xy=(73, 25), xytext=(71.5, 25), arrowprops=arrow_props)

    # Bottom Feedback / Ledger Loop
    loop_rect = patches.FancyBboxPatch((15, 1.5), 70, 4.5, 
                                       boxstyle="round,pad=0.3,rounding_size=1", 
                                       facecolor='#f1f5f9', edgecolor='#94a3b8', linestyle='--', linewidth=1.5)
    ax.add_patch(loop_rect)
    ax.text(50, 3.75, 'Automated PO Lifecycle & Inventory Ledger Sync (FastAPI + React Dashboard)', 
            ha='center', va='center', fontsize=8, fontweight='bold', color='#1e293b')

    plt.tight_layout()
    plt.savefig('report_assets/fig_architecture_pipeline.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Architecture diagram generated successfully!")

if __name__ == "__main__":
    generate_architecture_diagram()
