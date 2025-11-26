import yfinance as yf
import pandas as pd
import numpy as np
from quant_metrics import (
    calculate_var, calculate_cvar, calculate_sortino_ratio,
    calculate_calmar_ratio, calculate_omega_ratio, calculate_skewness,
    calculate_kurtosis, calculate_hit_ratio, calculate_win_loss_ratio,
    calculate_information_ratio, calculate_beta, calculate_alpha
)


def clean_value(value):
    """Nettoie les valeurs NaN/inf pour JSON"""
    if isinstance(value, (int, float)):
        if np.isnan(value) or np.isinf(value):
            return 0.0
        return float(value)
    return value


def analyze_portfolio(assets, rebalance_freq='monthly'):

    if len(assets) < 2:
        return None

    # Récupération des données
    all_prices = {}
    all_data = {}

    for asset in assets:
        ticker = asset['ticker']
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period='3mo')

            if not df.empty:
                all_prices[ticker] = df['Close']
                all_data[ticker] = {
                    'current_price': float(df['Close'].iloc[-1]),
                    'weight': asset['weight']
                }
        except Exception as e:
            print(f"[Portfolio] Error fetching {ticker}: {e}")
            continue

    if len(all_prices) < 2:
        return None

    prices_df = pd.DataFrame(all_prices).dropna()

    # Calcul des rendements
    returns_df = prices_df.pct_change().dropna()

    # Poids du portefeuille
    weights = np.array([asset['weight'] for asset in assets])
    weights = weights / weights.sum()

    # Rendements du portefeuille
    portfolio_returns = (returns_df * weights).sum(axis=1)

    # Rééquilibrage si nécessaire
    if rebalance_freq != 'none':
        normalized = prices_df / prices_df.iloc[0]
        portfolio_values = (normalized * weights).sum(axis=1) * 100
    else:
        normalized = prices_df / prices_df.iloc[0]
        portfolio_values = (normalized * weights).sum(axis=1) * 100

    # Calcul des métriques de base
    total_return = ((portfolio_values.iloc[-1] / portfolio_values.iloc[0]) - 1) * 100
    portfolio_volatility = portfolio_returns.std() * np.sqrt(252) * 100

    sharpe_ratio = (portfolio_returns.mean() / portfolio_returns.std()) * np.sqrt(252) \
        if portfolio_returns.std() != 0 else 0

    # Max Drawdown
    cumulative = portfolio_values
    running_max = cumulative.expanding().max()
    drawdown = (cumulative - running_max) / running_max
    max_drawdown = drawdown.min() * 100

    # Métriques avancées
    sortino_ratio = calculate_sortino_ratio(portfolio_returns)
    calmar_ratio = calculate_calmar_ratio(portfolio_returns, max_drawdown)
    var_95 = calculate_var(portfolio_returns)
    cvar_95 = calculate_cvar(portfolio_returns)
    omega_ratio = calculate_omega_ratio(portfolio_returns)
    skewness = calculate_skewness(portfolio_returns)
    kurtosis = calculate_kurtosis(portfolio_returns)
    hit_ratio = calculate_hit_ratio(portfolio_returns)
    win_loss = calculate_win_loss_ratio(portfolio_returns)

    # Alpha et Beta vs SPY
    try:
        spy = yf.Ticker('SPY')
        spy_df = spy.history(period='3mo')
        spy_returns = spy_df['Close'].pct_change().dropna()

        # Aligner les dates
        combined = pd.DataFrame({
            'portfolio': portfolio_returns,
            'spy': spy_returns
        }).dropna()

        if len(combined) > 10:
            beta = calculate_beta(combined['portfolio'], combined['spy'])
            alpha = calculate_alpha(combined['portfolio'], combined['spy'])
            info_ratio = calculate_information_ratio(combined['portfolio'], combined['spy'])
        else:
            beta = alpha = info_ratio = 0.0
    except:
        beta = alpha = info_ratio = 0.0

    # Matrice de corrélation
    correlation_matrix = returns_df.corr().to_dict()

    # Contribution de chaque actif
    for ticker in all_data.keys():
        asset_return = ((prices_df[ticker].iloc[-1] / prices_df[ticker].iloc[0]) - 1) * 100
        all_data[ticker]['return'] = float(asset_return)
        all_data[ticker]['contribution'] = float(asset_return * all_data[ticker]['weight'] / 100)

    # Historique pour graphique - normaliser tous les actifs à 100 comme le portefeuille
    normalized_prices = (prices_df / prices_df.iloc[0]) * 100

    history = [
        {
            'date': date.strftime('%Y-%m-%d'),
            'portfolio': float(portfolio_values.loc[date]),
            **{ticker: float(normalized_prices[ticker].loc[date]) for ticker in all_data.keys()}
        }
        for date in portfolio_values.index
    ]

    return {
        'total_return': clean_value(total_return),
        'total_value': clean_value(portfolio_values.iloc[-1]),
        'portfolio_volatility': clean_value(portfolio_volatility),
        'sharpe_ratio': clean_value(sharpe_ratio),
        'max_drawdown': clean_value(max_drawdown),
        'var_95': clean_value(var_95),
        'cvar_95': clean_value(cvar_95),
        'alpha': clean_value(alpha),
        'beta': clean_value(beta),
        'skewness': clean_value(skewness),
        'hit_ratio': clean_value(hit_ratio),
        'win_loss_ratio': clean_value(win_loss),
        'correlation_matrix': correlation_matrix,
        'assets_data': all_data,
        'history': history
    }
