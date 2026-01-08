import streamlit as st
import json
from datetime import datetime

# Import des modules Quant A et Quant B
import QuantA as quant_a
import QuantB as quant_b

# Configuration Streamlit
st.set_page_config(
    page_title="Quant Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .header {
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        color: white;
        margin-bottom: 30px;
    }
    .header h1 {
        margin: 0;
        font-size: 2.5em;
    }
    .section-header {
        font-size: 1.8em;
        margin-top: 30px;
        margin-bottom: 20px;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# HEADER
# ============================================================================

st.markdown("""
<div class="header">
    <h1>📊 Quant Dashboard</h1>
    <p>Single Asset & Portfolio Analysis</p>
    <p style="font-size: 0.9em; margin-top: 10px;">
        <strong>Quant A (Single Asset):</strong> Martin Partiot | 
        <strong>Quant B (Portfolio):</strong> Sacha Guillou Keredan<br>
        Formation: IF ESILV 2025-2026 | Data: Yahoo Finance LIVE
    </p>
</div>
""", unsafe_allow_html=True)

# ============================================================================
# NAVIGATION
# ============================================================================

tab1, tab2 = st.tabs(["📈 Single Asset Analysis", "💼 Portfolio Analysis"])

# ============================================================================
# TAB 1 - QUANT A (SINGLE ASSET ANALYSIS)
# ============================================================================

with tab1:
    st.markdown('<div class="section-header">Single Asset Analysis (Quant A)</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        ticker = st.text_input(
            "Asset Ticker",
            value="ENGI",
            placeholder="e.g., AAPL, EUR=X, GC=F",
            help="Symbole de l'actif (Yahoo Finance format)"
        )
    
    with col2:
        fetch_button = st.button("🔄 Fetch Data", key="fetch_asset")
    
    if fetch_button or 'asset_data' not in st.session_state:
        if ticker:
            with st.spinner(f"Fetching data for {ticker}..."):
                try:
                    print(f"[Quant A] Fetching data for {ticker}...")
                    
                    result = quant_a.get_asset_data(ticker)
                    
                    if result is None:
                        st.error(f"❌ No data from Yahoo Finance for {ticker}. Vérifiez le symbole.")
                        print(f"[Quant A] No data from Yahoo Finance for {ticker}")
                    else:
                        st.session_state.asset_data = result
                        st.success(f"✅ Retrieved {len(result['history'])} data points for {ticker}")
                        print(f"[Quant A] Success: {len(result['history'])} data points retrieved")
                
                except Exception as e:
                    st.error(f"❌ Erreur lors de la récupération des données: {str(e)}")
                    print(f"[Quant A] Error: {e}")
    
    # Display asset data if available
    if 'asset_data' in st.session_state:
        data = st.session_state.asset_data
        
        st.markdown("### Current Price & Metrics")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Current Price", f"${data.get('current_price', 'N/A'):.2f}" if isinstance(data.get('current_price'), (int, float)) else "N/A")
        with col2:
            st.metric("Change %", f"{data.get('change_percent', 'N/A'):.2f}%" if isinstance(data.get('change_percent'), (int, float)) else "N/A")
        with col3:
            st.metric("Volatility", f"{data.get('volatility', 'N/A'):.4f}" if isinstance(data.get('volatility'), (int, float)) else "N/A")
        with col4:
            st.metric("52W High", f"${data.get('52w_high', 'N/A'):.2f}" if isinstance(data.get('52w_high'), (int, float)) else "N/A")
    
    # Backtest Section
    st.markdown("### Backtesting Strategy")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        strategy = st.selectbox(
            "Strategy",
            ["buy-hold", "momentum", "mean-reversion", "rsi"],
            help="Stratégie de backtesting"
        )
    
    with col2:
        period = st.slider(
            "Period (days)",
            min_value=5,
            max_value=250,
            value=20,
            step=5,
            help="Période de la stratégie"
        )
    
    with col3:
        backtest_button = st.button("▶️ Run Backtest", key="backtest")
    
    if backtest_button:
        if ticker:
            with st.spinner(f"Running {strategy} backtest..."):
                try:
                    print(f"[Quant A] Running {strategy} strategy on {ticker} with period={period}...")
                    
                    result = quant_a.backtest_strategy(ticker, strategy, period)
                    
                    if result is None:
                        st.error(f"❌ No data for {ticker}")
                        print(f"[Quant A] No data from Yahoo Finance for {ticker}")
                    else:
                        st.session_state.backtest_result = result
                        st.success(f"✅ Backtest completed")
                        print(f"[Quant A] Complete: Return={result['strategy_return']:.2f}%, " +
                              f"Sharpe={result['sharpe_ratio']:.2f}, MaxDD={result['max_drawdown']:.2f}%")
                
                except Exception as e:
                    st.error(f"❌ Erreur lors du backtest: {str(e)}")
                    print(f"[Quant A] Error: {e}")
                    import traceback
                    traceback.print_exc()
        else:
            st.warning("⚠️ Please enter a ticker first")
    
    # Display backtest results
    if 'backtest_result' in st.session_state:
        result = st.session_state.backtest_result
        
        st.markdown("### Backtest Results")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Strategy Return",
                f"{result.get('strategy_return', 0):.2f}%"
            )
        with col2:
            st.metric(
                "Sharpe Ratio",
                f"{result.get('sharpe_ratio', 0):.2f}"
            )
        with col3:
            st.metric(
                "Max Drawdown",
                f"{result.get('max_drawdown', 0):.2f}%"
            )
        with col4:
            st.metric(
                "Win Rate",
                f"{result.get('win_rate', 0):.2f}%" if 'win_rate' in result else "N/A"
            )
        
        # Display strategy details if available
        if 'strategy_details' in result:
            st.markdown("### Strategy Details")
            st.json(result['strategy_details'])


# ============================================================================
# TAB 2 - QUANT B (PORTFOLIO ANALYSIS)
# ============================================================================

with tab2:
    st.markdown('<div class="section-header">Portfolio Analysis (Quant B)</div>', unsafe_allow_html=True)
    
    st.markdown("### Portfolio Configuration")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        assets_input = st.text_area(
            "Assets (comma-separated)",
            value="AAPL, MSFT, GOOGL",
            placeholder="e.g., AAPL, MSFT, GOOGL, EUR=X",
            help="Liste des actifs séparés par des virgules"
        )
    
    with col2:
        rebalance_freq = st.selectbox(
            "Rebalance Frequency",
            ["daily", "weekly", "monthly", "quarterly"],
            index=2,
            help="Fréquence de rééquilibrage du portefeuille"
        )
    
    analyze_button = st.button("📊 Analyze Portfolio", key="analyze_portfolio")
    
    if analyze_button:
        if assets_input.strip():
            assets = [a.strip().upper() for a in assets_input.split(',')]
            
            with st.spinner(f"Analyzing portfolio with {len(assets)} assets..."):
                try:
                    print(f"[Quant B] Analyzing portfolio with {len(assets)} assets, rebalance={rebalance_freq}")
                    
                    result = quant_b.analyze_portfolio(assets, rebalance_freq)
                    
                    if result is None:
                        st.error("❌ Données insuffisantes pour analyser le portefeuille")
                        print("[Quant B] No data for portfolio analysis")
                    else:
                        st.session_state.portfolio_result = result
                        st.success("✅ Portfolio analysis completed")
                        print(f"[Quant B] Complete: Return={result['total_return']:.2f}%, " +
                              f"Vol={result['portfolio_volatility']:.2f}%, Sharpe={result['sharpe_ratio']:.2f}")
                
                except Exception as e:
                    st.error(f"❌ Erreur lors de l'analyse du portefeuille: {str(e)}")
                    print(f"[Quant B] Error: {e}")
                    import traceback
                    traceback.print_exc()
        else:
            st.warning("⚠️ Please enter at least one asset")
    
    # Display portfolio results
    if 'portfolio_result' in st.session_state:
        result = st.session_state.portfolio_result
        
        st.markdown("### Portfolio Performance Metrics")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Total Return",
                f"{result.get('total_return', 0):.2f}%"
            )
        with col2:
            st.metric(
                "Portfolio Volatility",
                f"{result.get('portfolio_volatility', 0):.2f}%"
            )
        with col3:
            st.metric(
                "Sharpe Ratio",
                f"{result.get('sharpe_ratio', 0):.2f}"
            )
        with col4:
            st.metric(
                "Max Drawdown",
                f"{result.get('max_drawdown', 0):.2f}%" if 'max_drawdown' in result else "N/A"
            )
        
        # Correlation matrix if available
        if 'correlation_matrix' in result:
            st.markdown("### Correlation Matrix")
            st.dataframe(result['correlation_matrix'], use_container_width=True)
        
        # Asset breakdown if available
        if 'asset_weights' in result:
            st.markdown("### Asset Weights")
            st.bar_chart(result['asset_weights'])
        
        # Portfolio details
        if 'portfolio_details' in result:
            st.markdown("### Portfolio Details")
            st.json(result['portfolio_details'])


# ============================================================================
# FOOTER / INFO
# ============================================================================

st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #888; font-size: 0.9em; padding: 20px;">
    <p>🔗 Data: Yahoo Finance | 📊 Analysis: Python | 🎨 UI: Streamlit</p>
    <p>Last updated: {}</p>
</div>
""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")), unsafe_allow_html=True)
