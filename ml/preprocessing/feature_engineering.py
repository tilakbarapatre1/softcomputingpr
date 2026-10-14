import numpy as np
import pandas as pd
from typing import Tuple, List

def create_demand_features(df: pd.DataFrame, target_col: str = "quantity") -> pd.DataFrame:
    """
    Creates robust time-series lag and rolling window features for retail demand forecasting.
    Expects df with columns: ['date', 'product_id', 'quantity', 'unit_price', 'promotion_flag']
    """
    data = df.copy()
    data['date'] = pd.to_datetime(data['date'])
    data = data.sort_values(by=['product_id', 'date']).reset_index(drop=True)

    # Date calendar features
    data['day_of_week'] = data['date'].dt.dayofweek
    data['day_of_month'] = data['date'].dt.day
    data['month'] = data['date'].dt.month
    data['quarter'] = data['date'].dt.quarter
    data['is_weekend'] = data['day_of_week'].isin([5, 6]).astype(int)

    # Cyclical encoding for seasonality
    data['month_sin'] = np.sin(2 * np.pi * data['month'] / 12)
    data['month_cos'] = np.cos(2 * np.pi * data['month'] / 12)
    data['dow_sin'] = np.sin(2 * np.pi * data['day_of_week'] / 7)
    data['dow_cos'] = np.cos(2 * np.pi * data['day_of_week'] / 7)

    # Lag features per product
    for lag in [1, 2, 7, 14, 21, 30]:
        data[f'lag_{lag}'] = data.groupby('product_id')[target_col].shift(lag)

    # Rolling window stats
    for window in [7, 14, 30]:
        data[f'rolling_mean_{window}'] = data.groupby('product_id')[target_col].shift(1).rolling(window=window, min_periods=1).mean()
        data[f'rolling_std_{window}'] = data.groupby('product_id')[target_col].shift(1).rolling(window=window, min_periods=1).std().fillna(0)
        data[f'rolling_max_{window}'] = data.groupby('product_id')[target_col].shift(1).rolling(window=window, min_periods=1).max()
        data[f'rolling_min_{window}'] = data.groupby('product_id')[target_col].shift(1).rolling(window=window, min_periods=1).min()

    # Price / Promo interaction
    if 'promotion_flag' in data.columns:
        data['promotion_flag'] = data['promotion_flag'].astype(int)
    else:
        data['promotion_flag'] = 0

    if 'unit_price' in data.columns:
        data['price_rolling_mean'] = data.groupby('product_id')['unit_price'].shift(1).rolling(7, min_periods=1).mean()
        data['price_diff'] = data['unit_price'] - data['price_rolling_mean'].fillna(data['unit_price'])
    else:
        data['price_diff'] = 0.0

    # Fill NA caused by shift with forward fill then median
    data = data.bfill().ffill().fillna(0)
    return data
