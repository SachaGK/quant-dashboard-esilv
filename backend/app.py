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
    
    # Calculate basic metrics
    total_return = (1 + strategy_returns).prod() - 1
    volatility = strategy_returns.std() * np.sqrt(252)
    sharpe_ratio = (strategy_returns.mean() * 252) / (volatility + 0.0001)
    
    return jsonify({
        'strategy_return': float(total_return * 100),
        'volatility': float(volatility * 100),
        'sharpe_ratio': float(sharpe_ratio)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)