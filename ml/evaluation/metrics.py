import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict

def calculate_metrics(y_true, y_pred) -> Dict[str, float]:
    """
    Computes standard regression & forecasting metrics: MAE, RMSE, MAPE, and R2.
    """
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)
    
    # Clip predictions to non-negative since demand cannot be negative
    y_pred = np.clip(y_pred, 0, None)
    
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    
    # Calculate Mean Absolute Percentage Error (MAPE) avoiding division by zero
    non_zero_mask = y_true > 0
    if np.sum(non_zero_mask) > 0:
        mape = float(np.mean(np.abs((y_true[non_zero_mask] - y_pred[non_zero_mask]) / y_true[non_zero_mask])) * 100)
    else:
        mape = 0.0
        
    try:
        r2 = float(r2_score(y_true, y_pred))
        if np.isnan(r2) or np.isneginf(r2):
            r2 = 0.0
    except Exception:
        r2 = 0.0

    return {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "mape": round(mape, 2),
        "r2_score": round(max(0.0, min(1.0, r2)), 4)
    }
