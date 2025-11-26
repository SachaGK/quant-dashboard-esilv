import yfinance as yf
import pandas as pd
import numpy as np


def get_asset_data(ticker):

    stock = yf.Ticker(ticker)
    data = stock.history(period='3mo')

    if data.empty:
        return None

    prices = data['Close']
    current_price = float(prices.iloc[-1])
    previous_price = float(prices.iloc[-2])
    price_change = ((current_price - previous_price) / previous_price) * 100

    history = [
        {'date': date.strftime('%Y-%m-%d'), 'price': float(price)}
        for date, price in prices.items()
    ]

    return {
        'ticker': ticker,
        'current_price': current_price,
        'price_change': price_change,
        'history': history
    }


def calculate_simple_metrics(returns):

    mean_return = returns.mean() * 252 * 100  # Annualisé
    volatility = returns.std() * np.sqrt(252) * 100  # Annualisée

    sharpe_ratio = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() != 0 else 0

    # Max Drawdown
    cumulative = (1 + returns).cumprod()
    running_max = cumulative.expanding().max()
    drawdown = (cumulative - running_max) / running_max
    max_drawdown = drawdown.min() * 100

    return {
        'annual_return': float(mean_return),
        'volatility': float(volatility),
        'sharpe_ratio': float(sharpe_ratio),
        'max_drawdown': float(max_drawdown)
    }


def get_asset_statistics(ticker):

    asset_data = get_asset_data(ticker)

    if not asset_data:
        return None

    # Calcul des rendements pour les métriques
    stock = yf.Ticker(ticker)
    df = stock.history(period='3mo')

    if df.empty:
        return asset_data

    prices = df['Close']
    returns = prices.pct_change().fillna(0)

    # Ajout des métriques
    metrics = calculate_simple_metrics(returns)
    asset_data.update(metrics)

    return asset_data
