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
        # Long si prix > MA, sinon cash (0)
        ma = prices.rolling(period).mean()
        signals = (prices > ma).astype(float)
        strategy_returns = returns * signals.shift(1).fillna(0)

    elif strategy == 'mean-reversion':
        # Long si prix < MA (sous-évalué), sinon cash
        ma = prices.rolling(period).mean()
        signals = (prices < ma).astype(float)
        strategy_returns = returns * signals.shift(1).fillna(0)

    elif strategy == 'bollinger':
        # Long si prix dans bande basse (survente), cash sinon
        ma = prices.rolling(period).mean()
        std = prices.rolling(period).std()

        # Gestion division par zéro: si std=0, z_score=0
        z_score = pd.Series(0, index=prices.index)
        mask = std > 0
        z_score[mask] = (prices[mask] - ma[mask]) / std[mask]

        # Signal d'achat si z-score < -0.5 (prix bas)
        signals = (z_score < -0.5).astype(float)
        strategy_returns = returns * signals.shift(1).fillna(0)

    elif strategy == 'rsi':
        # RSI (Relative Strength Index) - Indicateur de momentum
        # RSI = 100 - (100 / (1 + RS)), où RS = moyenne des gains / moyenne des pertes

        # Calcul des gains et pertes
        delta = prices.diff()
        gains = delta.where(delta > 0, 0.0)
        losses = -delta.where(delta < 0, 0.0)

        # Moyenne mobile des gains et pertes sur la période
        avg_gains = gains.rolling(window=period, min_periods=period).mean()
        avg_losses = losses.rolling(window=period, min_periods=period).mean()

        # Calcul du RSI avec gestion division par zéro
        rs = pd.Series(0.0, index=prices.index)
        mask = avg_losses > 0
        rs[mask] = avg_gains[mask] / avg_losses[mask]

        rsi = 100 - (100 / (1 + rs))

        # Stratégie: Long si RSI < 30 (oversold), cash si RSI > 70 (overbought)
        # Entre 30 et 70: on garde la position précédente
        signals = pd.Series(np.nan, index=prices.index)
        signals[rsi < 30] = 1.0  # Achat en zone de survente
        signals[rsi > 70] = 0.0  # Sortie en zone de surachat

        # Forward fill pour maintenir la position entre les seuils
        signals = signals.fillna(method='ffill').fillna(0.0)

        strategy_returns = returns * signals.shift(1).fillna(0)

    elif strategy == 'breakout':
        # Breakout Strategy - Trade les cassures de range
        # Long quand prix casse au-dessus du plus haut récent
        # Exit quand prix casse en-dessous du plus bas récent

        # Calcul du plus haut et plus bas des N derniers jours (excluant le jour courant)
        rolling_high = prices.shift(1).rolling(window=period, min_periods=period).max()
        rolling_low = prices.shift(1).rolling(window=period, min_periods=period).min()

        # Génération des signaux
        signals = pd.Series(np.nan, index=prices.index)

        # Signal d'achat: prix actuel > plus haut des N derniers jours
        signals[prices > rolling_high] = 1.0

        # Signal de vente: prix actuel < plus bas des N derniers jours
        signals[prices < rolling_low] = 0.0

        # Maintenir la position si pas de nouveau signal
        signals = signals.fillna(method='ffill')

        # Démarrer en position neutre (cash)
        signals = signals.fillna(0.0)

        strategy_returns = returns * signals.shift(1).fillna(0)

    else:  # buy-hold
        strategy_returns = returns

    # Calcul des métriques
    cumulative_returns = (1 + strategy_returns).cumprod()
    total_return = (cumulative_returns.iloc[-1] - 1) * 100

    # Sharpe Ratio (avec taux sans risque 2% annuel)
    risk_free_rate = 0.02 / 252  # Taux journalier
    mean_return = strategy_returns.mean()
    std_return = strategy_returns.std()
    sharpe_ratio = ((mean_return - risk_free_rate) / std_return) * np.sqrt(252) if std_return != 0 else 0

    # Max Drawdown
    running_max = cumulative_returns.expanding().max()
    drawdown = (cumulative_returns - running_max) / running_max
    max_drawdown = drawdown.min() * 100

    # Historique pour graphique - normaliser le prix à 100 aussi pour comparaison
    normalized_prices = (prices / prices.iloc[0]) * 100
    history = [
        {
            'date': date.strftime('%Y-%m-%d'),
            'value': float(val * 100),
            'price': float(normalized_prices.loc[date])
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

    mean_return = returns.mean() * 252 * 100  # Annualisé en %
    volatility = returns.std() * np.sqrt(252) * 100  # Annualisée en%

    # Sharpe Ratio avec risk-free rate
    risk_free_rate = 0.02 / 252  # Taux journalier (2% annuel)
    sharpe_ratio = ((returns.mean() - risk_free_rate) / returns.std()) * np.sqrt(252) if returns.std() != 0 else 0

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
