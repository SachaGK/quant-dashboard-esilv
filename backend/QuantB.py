from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/backtest', methods=['POST'])
def backtest():
    """Backtest a trading strategy on a single asset"""
    data = request.json
    ticker = data.get('ticker', 'AAPL')
    strategy = data.get('strategy', 'buy_hold')
    period = data.get('period', 20)
    
    # Download data
    df = yf.download(ticker, period='2y', progress=False)
    prices = df['Close']
    returns = prices.pct_change().dropna()
    
   # Strategies
    if strategy == 'buy_hold':
        strategy_returns = returns
    
    elif strategy == 'momentum':
        # Momentum: Buy if price > moving average
        ma = prices.rolling(period).mean()
        signals = (prices > ma).astype(int)
        strategy_returns = returns * signals.shift(1).fillna(0)
    
    elif strategy == 'mean_reversion':
        # Mean Reversion: Buy if price < moving average
        ma = prices.rolling(period).mean()
        signals = (prices < ma).astype(int)
        strategy_returns = returns * signals.shift(1).fillna(0)
    
    else:
        return jsonify({'error': 'Strategy not implemented yet'}), 400
    
    # Calculate metrics
    total_return = (1 + strategy_returns).prod() - 1
    volatility = strategy_returns.std() * np.sqrt(252)
    sharpe_ratio = (strategy_returns.mean() * 252) / (volatility + 0.0001)
    
    # Sortino Ratio (downside deviation)
    downside_returns = strategy_returns[strategy_returns < 0]
    downside_std = downside_returns.std() * np.sqrt(252) if len(downside_returns) > 0 else 0.0001
    sortino_ratio = (strategy_returns.mean() * 252) / downside_std
    
    # Max Drawdown
    cumulative = (1 + strategy_returns).cumprod()
    running_max = cumulative.expanding().max()
    drawdown = (cumulative - running_max) / running_max
    max_drawdown = drawdown.min()
    
    # Calmar Ratio
    calmar_ratio = (strategy_returns.mean() * 252) / (abs(max_drawdown) + 0.0001)
    
    return jsonify({
        'strategy_return': float(total_return * 100),
        'volatility': float(volatility * 100),
        'sharpe_ratio': float(sharpe_ratio),
        'sortino_ratio': float(sortino_ratio),
        'max_drawdown': float(max_drawdown * 100),
        'calmar_ratio': float(calmar_ratio)
    })

@app.route('/api/portfolio', methods=['POST'])
def portfolio():
    """Analyse d'un portefeuille multi-actifs"""
    data = request.json
    assets = data.get('assets', [])  # [{'ticker': 'AAPL', 'weight': 50}, ...]
    
    if len(assets) < 2:
        return jsonify({'error': 'Au moins 2 actifs requis'}), 400
    
    # Récupérer les données pour chaque actif
    all_prices = {}
    for asset in assets:
        ticker = asset['ticker']
        df = yf.download(ticker, period='3mo', progress=False)
        if df.empty:
            return jsonify({'error': f'Pas de données pour {ticker}'}), 404
        all_prices[ticker] = df['Close']
    
    # Créer DataFrame aligné
    prices_df = pd.DataFrame(all_prices).dropna()
    
    # Calculer les rendements
    returns_df = prices_df.pct_change().dropna()
    
    # Poids normalisés
    weights = np.array([a['weight'] / 100 for a in assets])
    
    # Rendement du portefeuille
    portfolio_returns = (returns_df * weights).sum(axis=1)
    
    # Métriques de base
    total_return = (1 + portfolio_returns).prod() - 1
    volatility = portfolio_returns.std() * np.sqrt(252)
    
    # Valeur du portefeuille normalisée à 100
    portfolio_value = (1 + portfolio_returns).cumprod() * 100
    
    return jsonify({
        'total_return': float(total_return * 100),
        'portfolio_volatility': float(volatility * 100),
        'total_value': float(portfolio_value.iloc[-1])
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
