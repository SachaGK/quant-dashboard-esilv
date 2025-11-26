# Quant Dashboard - Plateforme d'Analyse Financière

Dashboard professionnel de quant trading avec analyse d'actifs uniques et de portefeuilles multi-actifs.

## Équipe

**Projet réalisé par :**
- **Sacha Guillou Keredan** - Quant B (Analyse multivariée - Portfolio)
- **Martin Partiot** - Quant A (Analyse univariée - Single Asset)

**Formation :** IF ESILV 2025-2026

## Fonctionnalités

### Quant A - Analyse d'Actif Unique
- Récupération de données en temps réel via Yahoo Finance
- Backtesting de stratégies de trading:
  - Buy & Hold
  - Momentum (moyenne mobile)
  - Mean Reversion
- Métriques professionnelles:
  - Sharpe Ratio
  - Max Drawdown
  - Rendements cumulatifs
- Paramètres personnalisables (période MA de 5 à 100 jours)
- Graphiques interactifs

### Quant B - Analyse de Portefeuille Multi-Actifs
- Support de 2 à 8 actifs simultanément
- Configuration de poids personnalisée
- Normalisation automatique des allocations
- Rééquilibrage configurable (quotidien, hebdomadaire, mensuel)
- Matrice de corrélation entre actifs
- Métriques de portefeuille:
  - Rendement total
  - Volatilité annualisée
  - Sharpe Ratio, Sortino Ratio
  - Max Drawdown, Calmar Ratio
  - VaR, CVaR, Omega Ratio
  - Alpha, Beta, Information Ratio
  - Contribution par actif
- Visualisations:
  - Évolution comparée portefeuille vs actifs
  - Graphique d'allocation (pie chart)
  - Matrice de corrélation avec code couleur


##  Stack Technique

### Frontend
- **React 19.2.0** avec TypeScript
- **Vite 7.2.2** (build tool)
- **Recharts** (visualisations)
- Design moderne avec thème sombre professionnel

### Backend - Architecture Modulaire
L'architecture backend est organisée en modules séparés pour chaque étudiant:

#### **Quant A (Martin)** - `backend/quant_B.py`
- Récupération de données Yahoo Finance
- Backtesting de stratégies (Buy & Hold, Momentum, Mean Reversion, Bollinger)
- Métriques de base (Sharpe, Max Drawdown)

#### **Quant B (Sacha)** - `backend/quant_A.py`
- Analyse de portefeuille multi-actifs
- Métriques avancées (Sortino, Calmar, VaR, CVaR, Alpha, Beta)
- Matrice de corrélation
- Prédictions multi-modèles (ARIMA, Monte Carlo, Exp Smoothing, Linear Reg)

#### **Modules partagés**
- `quant_metrics.py`: Fonctions de calcul réutilisables
- `prediction.py`: Modèles de prédiction
- `app.py`: API Flask qui agrège Quant A et Quant B

#### **Technologies**
- **Python Flask 3.0.0**
- **yfinance 0.2.66** (données Yahoo Finance en temps réel)
- **pandas 2.1.4** & **numpy 1.26.2** (calculs quantitatifs)
- **scipy** (métriques statistiques)
- **statsmodels** (ARIMA)
- **scikit-learn** (Linear Regression)

## 📦 Installation

### Backend (Python)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# ou: source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python app.py
```

Le backend démarre sur `http://localhost:5000`

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

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
          correlation_matrix, assets_data, history, métriques avancées
```


##  Utilisation

1. **Analyse Simple** : Onglet "Single Asset"
   - Sélectionnez un actif (AAPL, MSFT, GOOGL, etc.)
   - Choisissez une stratégie de backtest
   - Ajustez la période MA si nécessaire
   - Lancez l'analyse

2. **Analyse Portfolio** : Onglet "Portfolio"
   - Ajoutez vos actifs (minimum 2)
   - Configurez les poids (total = 100%)
   - Choisissez la fréquence de rééquilibrage
   - Analysez le portefeuille complet

3. **Prédictions** : Onglet "Prediction"
   - Configurez votre portefeuille d'actifs
   - Sélectionnez les modèles de prédiction
   - Ajustez les paramètres (horizon, poids consensus)
   - Comparez les différents modèles

##  Métriques Calculées

### Métriques de Performance
- **Sharpe Ratio** : Rendement ajusté au risque total
- **Sortino Ratio** : Rendement ajusté au risque de baisse uniquement
- **Calmar Ratio** : Rendement / Max Drawdown
- **Omega Ratio** : Rapport gains/pertes
- **Information Ratio** : Performance vs benchmark

### Métriques de Risque
- **VaR (Value at Risk)** : Perte maximale attendue à 95%
- **CVaR (Conditional VaR)** : Perte moyenne au-delà du VaR
- **Max Drawdown** : Plus grosse perte depuis le plus haut
- **Volatilité** : Écart-type des rendements (annualisée)
- **Beta** : Sensibilité au marché
- **Alpha** : Sur-performance vs CAPM

### Métriques de Distribution
- **Skewness** : Asymétrie de la distribution
- **Kurtosis** : Queues épaisses de la distribution
- **Hit Ratio** : % de périodes gagnantes
- **Win/Loss Ratio** : Ratio gain moyen / perte moyenne

### Corrélation
- >0.7 = Forte (rouge)
- 0.3-0.7 = Moyenne (orange)
- <0.3 = Faible (vert)

##  Notes Techniques

- Données sur 3 mois (période='3mo' de yfinance)
- Taux sans risque = 2% annuel
- Tous les calculs sont basés sur 252 jours de trading par an
- Normalisation des prix à base 100 pour comparaisons
- Tooltips explicatifs sur toutes les métriques

##  Structure du Projet

```
quant-dashboard/
├── backend/
│   ├── app.py                  # API Flask principale
│   ├── quant_a.py             # Module Quant A (Martin)
│   ├── quant_b.py             # Module Quant B (Sacha)
│   ├── quant_metrics.py       # Fonctions de calcul partagées
│   └── requirements.txt       # Dépendances Python
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Overview.tsx       # Page d'accueil
│   │   │   ├── SingleAsset.tsx   # Quant A Interface
│   │   │   ├── Portfolio.tsx     # Quant B Interface
│   │   ├── components/           # Composants réutilisables
│   │   └── App.tsx              # Application principale
│   └── package.json
└── README.md
```

## Design

Interface professionnelle avec :
- Thème sombre moderne (#0f1117, #1a1d24)
- Accents violets (#667eea, #764ba2)
- Icônes SVG personnalisées
- Tooltips contextuels
- Graphiques interactifs Recharts
- Layout responsive

##  Gestion d'Erreurs

- Validation des symboles boursiers
- Messages d'erreur explicites
- Gestion des données manquantes
- Vérification des poids de portefeuille
- Normalisation automatique disponible

##  Contact

Projet académique - IF ESILV 2025-2026
Sacha.keredan@icloud.com
+33 19 93 35 61

**Auteurs :**
- Sacha Guillou Keredan
- Martin Partiot
