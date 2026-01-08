

from flask import Flask, jsonify, request
from flask_cors import CORS

# Import des modules Quant A et Quant B
import quant_a
import quant_b

app = Flask(__name__)
CORS(app)


@app.route('/api/health')
def health():
    """Health check de l'API"""
    return jsonify({'status': 'online', 'message': 'Backend Python OK - Yahoo Finance LIVE'})


# ============================================================================
# QUANT A - SINGLE ASSET ANALYSIS (Martin Partiot)
# ============================================================================

@app.route('/api/asset/<ticker>')
def get_asset_data(ticker):
    """Récupère les données d'un actif unique"""
    try:
        print(f"[Quant A] Fetching data for {ticker}...")

        result = quant_a.get_asset_data(ticker)

        if result is None:
            print(f"[Quant A] No data from Yahoo Finance for {ticker}")
            return jsonify({
                'error': f'Impossible de récupérer les données pour {ticker}. Vérifiez le symbole.'
            }), 404

        print(f"[Quant A] Success: {len(result['history'])} data points retrieved")
        return jsonify(result)

    except Exception as e:
        print(f"[Quant A] Error: {e}")
        return jsonify({'error': f'Erreur lors de la récupération des données: {str(e)}'}), 500


@app.route('/api/backtest', methods=['POST'])
def backtest():
    """Effectue un backtest de stratégie sur un actif unique"""
    try:
        data = request.get_json()
        ticker = data.get('ticker')
        strategy = data.get('strategy', 'buy-hold')
        period = data.get('period', 20)

        print(f"[Quant A] Running {strategy} strategy on {ticker} with period={period}...")

        result = quant_a.backtest_strategy(ticker, strategy, period)

        if result is None:
            print(f"[Quant A] No data from Yahoo Finance for {ticker}")
            return jsonify({'error': f'Impossible de récupérer les données pour {ticker}'}), 404

        print(f"[Quant A] Complete: Return={result['strategy_return']:.2f}%, " +
              f"Sharpe={result['sharpe_ratio']:.2f}, MaxDD={result['max_drawdown']:.2f}%")

        return jsonify(result)

    except Exception as e:
        print(f"[Quant A] Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Erreur lors du backtest: {str(e)}'}), 500


# ============================================================================
# QUANT B - PORTFOLIO ANALYSIS (Sacha Guillou Keredan)
# ============================================================================

@app.route('/api/portfolio', methods=['POST'])
def analyze_portfolio():
    """Analyse complète d'un portefeuille multi-actifs"""
    try:
        data = request.get_json()
        assets = data.get('assets', [])
        rebalance_freq = data.get('rebalance_freq', 'monthly')

        print(f"[Quant B] Analyzing portfolio with {len(assets)} assets, rebalance={rebalance_freq}")

        result = quant_b.analyze_portfolio(assets, rebalance_freq)

        if result is None:
            return jsonify({'error': 'Données insuffisantes pour analyser le portefeuille'}), 400

        print(f"[Quant B] Complete: Return={result['total_return']:.2f}%, " +
              f"Vol={result['portfolio_volatility']:.2f}%, Sharpe={result['sharpe_ratio']:.2f}")

        return jsonify(result)

    except Exception as e:
        print(f"[Quant B] Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Erreur lors de l\'analyse du portefeuille: {str(e)}'}), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*80)
    print("QUANT DASHBOARD - Backend API")
    print("="*80)
    print("Quant A (Single Asset): Martin Partiot")
    print("Quant B (Portfolio): Sacha Guillou Keredan")
    print("Formation: IF ESILV 2025-2026")
    print("="*80 + "\n")
    print("[Backend] Python Flask API starting...")
    print("[Backend] Using Yahoo Finance LIVE data only\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
