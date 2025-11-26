export default function Overview() {
  const modules = [
    {
      id: 'single-asset',
      title: 'Single Asset Analysis',
      description: 'Backtest trading strategies on individual securities. Compare 6 strategies: Buy & Hold, Momentum, Mean Reversion, Bollinger Bands, RSI, and Breakout.',
      color: '#6366f1',
      metrics: ['Sharpe', 'Sortino', 'Calmar', 'VaR', 'CVaR', 'Info Ratio'],
    },
    {
      id: 'portfolio',
      title: 'Portfolio Analysis',
      description: 'Build and analyze multi-asset portfolios with custom weights, rebalancing options, correlation analysis, and professional risk metrics.',
      color: '#10b981',
      metrics: ['Volatility', 'Drawdown', 'Hit Ratio', 'Win/Loss', 'Omega', 'Skewness'],
    },
  ];

  const allMetrics = [
    { name: 'Sharpe Ratio', desc: 'Risk-adjusted return' },
    { name: 'Sortino Ratio', desc: 'Downside volatility adjusted' },
    { name: 'Calmar Ratio', desc: 'Return / Max Drawdown' },
    { name: 'Omega Ratio', desc: 'Probability weighted gains/losses' },
    { name: 'Max Drawdown', desc: 'Largest peak to trough decline' },
    { name: 'Volatility', desc: 'Annualized standard deviation' },
    { name: 'VaR 95%', desc: 'Value at Risk at 95% confidence' },
    { name: 'CVaR 95%', desc: 'Expected shortfall beyond VaR' },
    { name: 'Hit Ratio', desc: 'Percentage of winning trades' },
    { name: 'Win/Loss', desc: 'Average win vs average loss' },
    { name: 'Skewness', desc: 'Distribution asymmetry' },
    { name: 'Kurtosis', desc: 'Tail risk / fat tails' },
    { name: 'Information Ratio', desc: 'Alpha vs benchmark' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', background: '#09090b', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: '#6366f1', fontSize: '13px', fontWeight: '500', marginBottom: '12px', letterSpacing: '0.5px' }}>
            IF ESILV 2025-2026
          </p>
          <h1 style={{ color: '#fafafa', fontSize: '36px', fontWeight: '600', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
            Quant Dashboard
          </h1>
          <p style={{ color: '#71717a', fontSize: '16px', maxWidth: '560px', lineHeight: '1.6', margin: 0 }}>
            Professional quantitative analysis platform for backtesting and portfolio management. Live data from Yahoo Finance.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '48px' }}>
          {[
            { label: 'Metrics', value: '13' },
            { label: 'Strategies', value: '6' },
            { label: 'Period', value: '90 days' },
            { label: 'Data', value: 'Live' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ color: '#fafafa', fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: '#52525b', fontSize: '13px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '48px' }}>
          {modules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-tab', { detail: mod.id }))}
              style={{
                background: '#18181b',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                border: '1px solid #27272a',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.background = '#1f1f23';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.background = '#18181b';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: mod.color }} />
                <span style={{ color: '#52525b', fontSize: '18px' }}>→</span>
              </div>
              <h3 style={{ color: '#fafafa', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>{mod.title}</h3>
              <p style={{ color: '#71717a', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0' }}>{mod.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {mod.metrics.map((m, i) => (
                  <span key={i} style={{
                    background: '#27272a',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#a1a1aa',
                  }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* All Metrics */}
        <div>
          <h2 style={{ color: '#fafafa', fontSize: '14px', fontWeight: '600', margin: '0 0 16px 0' }}>Available Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {allMetrics.map((m, i) => (
              <div key={i} style={{
                background: '#18181b',
                borderRadius: '8px',
                padding: '12px 14px',
                border: '1px solid #27272a',
              }}>
                <div style={{ color: '#fafafa', fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>{m.name}</div>
                <div style={{ color: '#52525b', fontSize: '12px' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#52525b', fontSize: '12px' }}>Built with React, Flask, Pandas</span>
          <span style={{ color: '#52525b', fontSize: '12px' }}>Sacha Guillou Keredan & Martin Partiot</span>
        </div>
      </div>
    </div>
  );
}
