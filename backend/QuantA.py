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


def backtest_strategy(ticker, strategy='buy-hold', period=20):

    stock = yf.Ticker(ticker)
    df = stock.history(period='3mo')

    if df.empty:
        return None

    prices = df['Close']
    returns = prices.pct_change().fillna(0)

    # Implémentation des stratégies
    if strategy == 'momentum':
        ma = prices.rolling(period).mean()
        signals = (prices > ma).astype(int)
        strategy_returns = returns * signals.shift(1).fillna(0)

    elif strategy == 'mean-reversion':
        ma = prices.rolling(period).mean()
        signals = (prices < ma).astype(int)
        strategy_returns = returns * signals.shift(1).fillna(0)

    elif strategy == 'bollinger':
        ma = prices.rolling(period).mean()
        std = prices.rolling(period).std()
        upper_band = ma + (2 * std)
        lower_band = ma - (2 * std)

        z_score = (prices - ma) / std
        signals = (z_score < -0.5).astype(int)
        strategy_returns = returns * signals.shift(1).fillna(0)

    else:  # buy-hold
        strategy_returns = returns

    # Calcul des métriques
    cumulative_returns = (1 + strategy_returns).cumprod()
    total_return = (cumulative_returns.iloc[-1] - 1) * 100

    # Sharpe Ratio
    mean_return = strategy_returns.mean()
    std_return = strategy_returns.std()
    sharpe_ratio = (mean_return / std_return) * np.sqrt(252) if std_return != 0 else 0

    # Max Drawdown
    running_max = cumulative_returns.expanding().max()
    drawdown = (cumulative_returns - running_max) / running_max
    max_drawdown = drawdown.min() * 100

    # Historique pour graphique
    history = [
        {
            'date': date.strftime('%Y-%m-%d'),
            'value': float(val * 100),
            'price': float(prices.loc[date])
        }
        for date, val in cumulative_returns.items()
    ]

    return {
        'ticker': ticker,
        'strategy': strategy,
        'period': period,
        'strategy_return': float(total_return),
        'sharpe_ratio': float(sharpe_ratio),
        'max_drawdown': float(max_drawdown),
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
