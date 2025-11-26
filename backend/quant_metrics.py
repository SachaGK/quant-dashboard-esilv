import numpy as np
import pandas as pd
from scipy import stats


def calculate_var(returns, confidence_level=0.95):

    return np.percentile(returns, (1 - confidence_level) * 100) * 100


def calculate_cvar(returns, confidence_level=0.95):

    var_threshold = np.percentile(returns, (1 - confidence_level) * 100)
    return returns[returns <= var_threshold].mean() * 100


def calculate_alpha(asset_returns, market_returns, risk_free_rate=0.02):

    asset_clean = asset_returns.dropna()
    market_clean = market_returns.dropna()

    if len(asset_clean) < 2 or len(market_clean) < 2:
        return 0.0

    beta = calculate_beta(asset_returns, market_returns)

    # Calcul des rendements annualisés
    asset_cumulative = (1 + asset_clean).prod() - 1
    market_cumulative = (1 + market_clean).prod() - 1

    n_days_asset = len(asset_clean)
    n_days_market = len(market_clean)

    asset_return_annual = (1 + asset_cumulative) ** (252 / n_days_asset) - 1
    market_return_annual = (1 + market_cumulative) ** (252 / n_days_market) - 1

    # Rendement attendu selon le CAPM
    expected_return = risk_free_rate + beta * (market_return_annual - risk_free_rate)

    # Alpha = Rendement réel - Rendement attendu
    alpha = asset_return_annual - expected_return

    return alpha * 100



def calculate_skewness(returns):

    return stats.skew(returns.dropna())




def calculate_tail_ratio(returns):

    right_tail = abs(np.percentile(returns, 95))
    left_tail = abs(np.percentile(returns, 5))

    if left_tail == 0:
        return float('inf') if right_tail > 0 else 1.0

    return right_tail / left_tail


def calculate_hit_ratio(returns):

    winning_periods = (returns > 0).sum()
    total_periods = len(returns)

    if total_periods == 0:
        return 0

    return (winning_periods / total_periods) * 100



