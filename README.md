# Quant Dashboard - Plateforme d'Analyse Financiere

Dashboard professionnel de quant trading avec analyse d'actifs uniques et de portefeuilles multi-actifs.

## Equipe

**Projet realise par :**
- **Martin Partiot** - Quant A (Analyse univariee - Single Asset)
- **Sacha Guillou Keredan** - Quant B (Analyse multivariee - Portfolio)

**Formation :** IF ESILV 2025-2026

## Fonctionnalites

### Quant A - Analyse d'Actif Unique
- Recuperation de donnees en temps reel via Yahoo Finance
- Backtesting de strategies de trading:
  - Buy & Hold
  - Momentum (moyenne mobile)
  - Mean Reversion
  - Bollinger Bands
- Metriques professionnelles:
  - Sharpe Ratio
  - Max Drawdown
  - Rendements cumulatifs
- Parametres personnalisables (periode MA de 5 a 100 jours)
- Graphiques interactifs

### Quant B - Analyse de Portefeuille Multi-Actifs
- Support de 2 a 8 actifs simultanement
- Configuration de poids personnalisee
- Normalisation automatique des allocations
- Reequilibrage configurable (quotidien, hebdomadaire, mensuel)
- Matrice de correlation entre actifs
- Metriques de portefeuille:
  - Rendement total
  - Volatilite annualisee
  - Sharpe Ratio, Sortino Ratio
  - Max Drawdown, Calmar Ratio
  - VaR, CVaR, Omega Ratio
  - Alpha, Beta, Information Ratio
  - Contribution par actif
- **🤖 ML Prediction (BONUS):**
  - Modele de regression lineaire pour predictions
  - Prevision du rendement J+1
  - Prevision cumulative sur 5 jours
  - Intervalles de confiance
  - Metriques de qualite du modele (R², accuracy)
- Visualisations:
  - Evolution comparee portefeuille vs actifs
  - Graphique d'allocation (pie chart)
  - Matrice de correlation avec code couleur
- **⏰ Auto-refresh toutes les 5 minutes**

## Stack Technique

### Frontend
- **React 19.2.0** avec TypeScript
- **Vite 7.2.2** (build tool)
- **Recharts** (visualisations)
- Design moderne avec theme sombre professionnel

### Backend - Architecture Modulaire
L'architecture backend est organisee en modules separes pour chaque etudiant:

#### **Quant A (Martin)** - `backend/quant_a.py`
- Recuperation de donnees Yahoo Finance
- Backtesting de strategies (Buy & Hold, Momentum, Mean Reversion, Bollinger)
- Metriques de base (Sharpe, Max Drawdown)

#### **Quant B (Sacha)** - `backend/quant_b.py`
- Analyse de portefeuille multi-actifs
- Metriques avancees (Sortino, Calmar, VaR, CVaR, Alpha, Beta)
- Matrice de correlation
- **ML Prediction avec regression lineaire**

#### **Modules partages**
- `quant_metrics.py`: Fonctions de calcul reutilisables
- `ml_prediction.py`: Modele ML de prediction (BONUS)
- `daily_report.py`: Generateur de rapports quotidiens
- `app.py`: API Flask qui agrege Quant A et Quant B

#### **Technologies**
- **Python Flask 3.0.0**
- **yfinance 0.2.66** (donnees Yahoo Finance en temps reel)
- **pandas 2.1.4** & **numpy 1.26.2** (calculs quantitatifs)
- **scipy 1.11.4** (metriques statistiques)
- **scikit-learn 1.3.2** (machine learning predictions)

## Installation

### Backend (Python)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# ou: source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python app.py
```

Le backend demarre sur `http://localhost:5000`

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Le frontend demarre sur `http://localhost:5173`

## Endpoints API

### Health Check
```
GET /api/health
```

### Single Asset Data
```
GET /api/asset/<ticker>
Retourne: current_price, price_change, history
```

### Backtesting
```
POST /api/backtest
Body: { ticker, strategy, period }
Retourne: strategy_return, sharpe_ratio, max_drawdown, history
```

### Portfolio Analysis
```
POST /api/portfolio
Body: { assets: [{ticker, weight}], rebalance_freq }
Retourne: total_value, portfolio_volatility, sharpe_ratio,
          correlation_matrix, assets_data, history, metriques avancees
```

## Utilisation

1. **Analyse Simple** : Onglet "Single Asset"
   - Selectionnez un actif (AAPL, MSFT, GOOGL, etc.)
   - Choisissez une strategie de backtest
   - Ajustez la periode MA si necessaire
   - Lancez l'analyse

2. **Analyse Portfolio** : Onglet "Portfolio"
   - Ajoutez vos actifs (minimum 2)
   - Configurez les poids (total = 100%)
   - Choisissez la frequence de reequilibrage
   - Analysez le portefeuille complet

## Metriques Calculees

### Metriques de Performance
- **Sharpe Ratio** : Rendement ajuste au risque total
- **Sortino Ratio** : Rendement ajuste au risque de baisse uniquement
- **Calmar Ratio** : Rendement / Max Drawdown
- **Omega Ratio** : Rapport gains/pertes
- **Information Ratio** : Performance vs benchmark

### Metriques de Risque
- **VaR (Value at Risk)** : Perte maximale attendue a 95%
- **CVaR (Conditional VaR)** : Perte moyenne au-dela du VaR
- **Max Drawdown** : Plus grosse perte depuis le plus haut
- **Volatilite** : Ecart-type des rendements (annualisee)
- **Beta** : Sensibilite au marche
- **Alpha** : Sur-performance vs CAPM

### Metriques de Distribution
- **Skewness** : Asymetrie de la distribution
- **Kurtosis** : Queues epaisses de la distribution
- **Hit Ratio** : % de periodes gagnantes
- **Win/Loss Ratio** : Ratio gain moyen / perte moyenne

### Correlation
- >0.7 = Forte (rouge)
- 0.3-0.7 = Moyenne (orange)
- <0.3 = Faible (vert)

## Fonctionnalites Automatiques

- **Auto-refresh** : Les donnees se mettent a jour toutes les 5 minutes
- **Daily Report** : Lancez `python daily_report.py` pour voir un resume du jour
- **ML Prediction** : Le portfolio affiche des predictions basees sur regression lineaire

## Structure du Projet

```
quant-dashboard/
├── backend/
│   ├── app.py                  # API Flask
│   ├── quant_a.py             # Single Asset (Martin)
│   ├── quant_b.py             # Portfolio (Sacha)
│   ├── quant_metrics.py       # Calculs partages
│   ├── ml_prediction.py       # ML (BONUS)
│   ├── daily_report.py        # Rapport quotidien
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/             # Les 3 pages
│       └── components/        # Composants UI
└── README.md
```

## Design

Interface simple avec theme sombre et graphiques Recharts

## Contact

Projet academique - IF ESILV 2025-2026

**Auteurs :**
- Martin Partiot
- Sacha Guillou Keredan
