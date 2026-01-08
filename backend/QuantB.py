import yfinance as yf
import pandas as pd
import numpy as np
from quant_metrics import (
    calculate_var, calculate_cvar, calculate_sortino_ratio,
    calculate_calmar_ratio, calculate_omega_ratio, calculate_skewness,
    calculate_kurtosis, calculate_hit_ratio, calculate_win_loss_ratio,
    calculate_information_ratio, calculate_beta, calculate_alpha
)
from ml_prediction import predict_portfolio_returns


def clean_value(value):
    """Nettoie les valeurs NaN/inf/None pour JSON - garde les vraies valeurs"""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        if np.isnan(value) or np.isinf(value):
            return None
        # Garde la valeur réelle même si c'est 0
        return round(float(value), 4)
    return value


def analyze_portfolio(assets, rebalance_freq='monthly'):
    """
    Analyse complète d'un portefeuille multi-actifs
    
    Args:
        assets: liste de symboles (strings) ou liste de dicts avec ticker et weight
        rebalance_freq: 'daily', 'weekly', 'monthly', 'quarterly', 'none'
    
    Returns:
        dict avec toutes les métriques du portefeuille
    """
    
    # Gestion de deux formats d'input possibles
    if isinstance(assets, list) and len(assets) > 0:
        if isinstance(assets[0], str):
            # Format simple: ['AAPL', 'MSFT', 'GOOGL']
            assets = [{'ticker': ticker, 'weight': 1.0/len(assets)} for ticker in assets]
        elif isinstance(assets[0], dict):
            # Format dict: [{'ticker': 'AAPL', 'weight': 0.3}, ...]
            pass
        else:
            return None
    else:
        return None

    if len(assets) < 1:
        return None

    # Récupération des données
    all_prices = {}
    all_data = {}

    for asset in assets:
        if isinstance(asset, dict):
            ticker = asset.get('ticker')
        else:
            ticker = asset
            
        if not ticker:
            continue
            
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period='3mo')

            if not df.empty and len(df) > 1:
                all_prices[ticker] = df['Close']
                weight = asset.get('weight', 1.0/len(assets)) if isinstance(asset, dict) else 1.0/len(assets)
                all_data[ticker] = {
                    'current_price': float(df['Close'].iloc[-1]),
                    'weight': float(weight)
                }
        except Exception as e:
            print(f"[Quant B] Error fetching {ticker}: {e}")
            continue

    if len(all_prices) < 1:
        return None

    # Créer DataFrame avec les prix
    prices_df = pd.DataFrame(all_prices).dropna()
    
    if len(prices_df) < 2:
        return None

    # Calcul des rendements
    returns_df = prices_df.pct_change().dropna()

    # Poids du portefeuille
    weights = np.array([all_data[ticker]['weight'] for ticker in all_prices.keys()])

    if weights.sum() == 0:
        print("[Quant B] Error: Sum of weights is zero")
        return None

    # Normalisation des poids
    weights = weights / weights.sum()

    # Rééquilibrage selon la fréquence
    if rebalance_freq == 'none':
        # Pas de rééquilibrage: les poids dérivent avec les prix
        initial_values = prices_df.iloc[0] * weights
        portfolio_values = (prices_df * weights / prices_df.iloc[0] * initial_values).sum(axis=1)
        portfolio_values = (portfolio_values / portfolio_values.iloc[0]) * 100
        portfolio_returns = (returns_df * weights).sum(axis=1)
    else:
        # Avec rééquilibrage: poids fixes
        portfolio_returns = (returns_df * weights).sum(axis=1)
        normalized = prices_df / prices_df.iloc[0]
        portfolio_values = (normalized * weights).sum(axis=1) * 100

    # Calcul des métriques de base
    total_return = ((portfolio_values.iloc[-1] / portfolio_values.iloc[0]) - 1) * 100
    portfolio_volatility = portfolio_returns.std() * np.sqrt(252) * 100

    # Sharpe Ratio avec risk-free rate (2% annuel)
    risk_free_rate = 0.02 / 252  # Taux journalier
    sharpe_ratio = ((portfolio_returns.mean() - risk_free_rate) / portfolio_returns.std()) * np.sqrt(252) \
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

    # Alpha et Beta vs SPY (benchmark)
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
    except Exception as e:
        print(f"[Quant B] Error calculating alpha/beta: {e}")
        beta = alpha = info_ratio = 0.0

    # Matrice de corrélation
    correlation_matrix = returns_df.corr().to_dict()

    # Contribution de chaque actif
    for ticker in all_prices.keys():
        if ticker in prices_df.columns:
            asset_return = ((prices_df[ticker].iloc[-1] / prices_df[ticker].iloc[0]) - 1) * 100
            all_data[ticker]['return'] = float(asset_return)
            all_data[ticker]['contribution'] = float(asset_return * all_data[ticker]['weight'])

    # Historique pour graphique
    normalized_prices = (prices_df / prices_df.iloc[0]) * 100

    history = [
        {
            'date': str(date.date()),
            'portfolio': float(portfolio_values.loc[date]),
            **{ticker: float(normalized_prices[ticker].loc[date]) for ticker in all_prices.keys()}
        }
        for date in portfolio_values.index
    ]

    # ML Prediction (Bonus Feature)
    ml_prediction = None
    try:
        prediction_result = predict_portfolio_returns(
            portfolio_returns,
            n_days=5,
            window=5
        )

        if prediction_result and 'error' not in prediction_result:
            ml_prediction = {
                'enabled': True,
                'next_day_prediction': clean_value(prediction_result['predictions']['predictions'][0]) if prediction_result['predictions']['predictions'] else None,
                'five_day_cumulative': clean_value(prediction_result['predictions']['cumulative_return']),
                'model_accuracy': clean_value(prediction_result['model_metrics']['direction_accuracy']),
                'model_r2': clean_value(prediction_result['model_metrics']['r2']),
                'predictions_detail': [float(p) for p in prediction_result['predictions']['predictions']],
                'confidence_lower': [float(c) for c in prediction_result['predictions']['confidence_lower']],
                'confidence_upper': [float(c) for c in prediction_result['predictions']['confidence_upper']]
            }
        else:
            ml_prediction = {'enabled': False, 'error': 'Insufficient data'}
    except Exception as e:
        print(f"[Quant B] ML Prediction Error: {e}")
        ml_prediction = {'enabled': False, 'error': str(e)}

    return {
        'total_return': clean_value(total_return),
        'total_value': clean_value(portfolio_values.iloc[-1]),
        'portfolio_volatility': clean_value(portfolio_volatility),
        'sharpe_ratio': clean_value(sharpe_ratio),
        'sortino_ratio': clean_value(sortino_ratio),
        'calmar_ratio': clean_value(calmar_ratio),
        'max_drawdown': clean_value(max_drawdown),
        'var_95': clean_value(var_95),
        'cvar_95': clean_value(cvar_95),
        'omega_ratio': clean_value(omega_ratio),
        'alpha': clean_value(alpha),
        'beta': clean_value(beta),
        'information_ratio': clean_value(info_ratio),
        'skewness': clean_value(skewness),
        'kurtosis': clean_value(kurtosis),
        'hit_ratio': clean_value(hit_ratio),
        'win_loss_ratio': clean_value(win_loss),
        'correlation_matrix': correlation_matrix,
        'assets_data': all_data,
        'history': history,
        'ml_prediction': ml_prediction,
        'rebalance_frequency': rebalance_freq
    }
