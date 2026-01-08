import numpy as np
import pandas as pd
from scipy import stats


def calculate_var(returns, confidence_level=0.95):

    return np.percentile(returns, (1 - confidence_level) * 100) * 100


def calculate_cvar(returns, confidence_level=0.95):

    var_threshold = np.percentile(returns, (1 - confidence_level) * 100)
    return returns[returns <= var_threshold].mean() * 100


def calculate_sortino_ratio(returns, risk_free_rate=0.02, mar=0):

    returns_clean = returns.dropna()

    if len(returns_clean) == 0:
        return 0.0

    # Calcul de l'excès de rendement
    daily_rf = risk_free_rate / 252
    excess_returns = returns_clean - daily_rf

    # Downside deviation: racine carrée de la moyenne des rendements négatifs au carré
    # Formule correcte: on prend tous les rendements, mais on clip à 0 pour les positifs
    downside_values = np.minimum(returns_clean - mar, 0)
    downside_deviation = np.sqrt(np.mean(downside_values ** 2))

    if downside_deviation == 0:
        return 0.0

    return (excess_returns.mean() / downside_deviation) * np.sqrt(252)


def calculate_calmar_ratio(returns, max_drawdown):

    returns_clean = returns.dropna()

    if len(returns_clean) == 0 or max_drawdown == 0:
        return 0.0

    # Calcul du rendement total composé
    cumulative_return = (1 + returns_clean).prod() - 1

    # Annualisation du rendement (CAGR)
    n_days = len(returns_clean)
    if n_days == 0:
        return 0.0

    cagr = (1 + cumulative_return) ** (252 / n_days) - 1

    # Calmar = CAGR / |MaxDrawdown| (tous deux en décimal, puis * 100 pour %)
    # max_drawdown est déjà en % (ex: -20), donc on divise par 100 pour cohérence
    return (cagr * 100) / abs(max_drawdown) if abs(max_drawdown) > 0.01 else 0.0


def calculate_omega_ratio(returns, threshold=0):

    gains = returns[returns > threshold] - threshold
    losses = threshold - returns[returns < threshold]

    if losses.sum() == 0:
        return float('inf') if gains.sum() > 0 else 0

    return gains.sum() / losses.sum()


def calculate_beta(asset_returns, market_returns):

    # Aligner les deux séries
    combined = pd.DataFrame({
        'asset': asset_returns,
        'market': market_returns
    }).dropna()

    if len(combined) < 2:
        return 1.0

    covariance = combined['asset'].cov(combined['market'])
    market_variance = combined['market'].var()

    if market_variance == 0:
        return 1.0

    return covariance / market_variance


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


def calculate_information_ratio(asset_returns, benchmark_returns):

    # Reset index pour aligner par position si les dates ne matchent pas
    asset_vals = asset_returns.reset_index(drop=True)
    benchmark_vals = benchmark_returns.reset_index(drop=True)

    # Prendre la longueur minimale
    min_len = min(len(asset_vals), len(benchmark_vals))
    if min_len < 2:
        return 0

    asset_vals = asset_vals[:min_len]
    benchmark_vals = benchmark_vals[:min_len]

    excess_returns = asset_vals - benchmark_vals
    tracking_error = excess_returns.std()

    if tracking_error == 0:
        return 0

    return (excess_returns.mean() / tracking_error) * np.sqrt(252)


def calculate_skewness(returns):

    return stats.skew(returns.dropna())


def calculate_kurtosis(returns):
 
    return stats.kurtosis(returns.dropna())


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


def calculate_win_loss_ratio(returns):

    wins = returns[returns > 0]
    losses = returns[returns < 0]

    if len(losses) == 0:
        return float('inf') if len(wins) > 0 else 0

    avg_win = wins.mean() if len(wins) > 0 else 0
    avg_loss = abs(losses.mean())

    if avg_loss == 0:
        return float('inf') if avg_win > 0 else 0

    return avg_win / avg_loss
