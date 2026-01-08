export default function Overview() {
  const modules = [
    {
      id: 'single-asset',
      title: 'Single Asset Analysis',
      description: 'Backtest trading strategies on individual securities with advanced risk metrics.',
      icon: 'chart',
      features: ['6 Strategies', 'Real-time Data', 'Risk Analysis'],
    },
    {
      id: 'portfolio',
      title: 'Portfolio Management',
      description: 'Build multi-asset portfolios with correlation analysis and rebalancing.',
      icon: 'portfolio',
      features: ['Custom Weights', 'Correlation Matrix', 'Rebalancing'],
    },
  ];

  const metrics = [
    { category: 'Return', items: ['Sharpe Ratio', 'Sortino Ratio', 'Calmar Ratio', 'Omega Ratio', 'Information Ratio'] },
    { category: 'Risk', items: ['Volatility', 'Max Drawdown', 'VaR 95%', 'CVaR 95%', 'Skewness', 'Kurtosis'] },
    { category: 'Performance', items: ['Hit Ratio', 'Win/Loss Ratio', 'Total Return', 'Annualized Return'] },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      background: 'linear-gradient(180deg, #0a0a0c 0%, #111114 100%)',
    }}>
      {/* Hero Section */}
      <div style={{
        padding: '80px 32px 60px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '20px',
            padding: '6px 14px',
            marginBottom: '24px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: '#a5b4fc', fontSize: '12px', fontWeight: '500' }}>Live Market Data</span>
          </div>

          <h1 style={{
            color: '#ffffff',
            fontSize: '48px',
            fontWeight: '700',
            margin: '0 0 20px 0',
            letterSpacing: '-1px',
            lineHeight: '1.1',
          }}>
            Quantitative Analysis
            <br />
            <span style={{ color: '#6366f1' }}>Platform</span>
          </h1>

          <p style={{
            color: '#71717a',
            fontSize: '18px',
            lineHeight: '1.7',
            margin: '0 auto 40px',
            maxWidth: '600px',
          }}>
            Professional-grade backtesting and portfolio optimization.
            Powered by real-time market data from Yahoo Finance.
          </p>

          {/* Key Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
          }}>
            {[
              { value: '14+', label: 'Risk Metrics' },
              { value: '6', label: 'Strategies' },
              { value: 'Real-time', label: 'Data Feed' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  color: '#fafafa',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '4px',
                }}>
                  {stat.value}
                </div>
                <div style={{ color: '#52525b', fontSize: '13px', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div style={{ padding: '60px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              color: '#fafafa',
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 12px 0',
            }}>
              Analysis Modules
            </h2>
            <p style={{ color: '#52525b', fontSize: '15px', margin: 0 }}>
              Click on any module to start analyzing
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            {modules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-tab', { detail: mod.id }))}
                style={{
                  background: 'rgba(24, 24, 27, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Icon placeholder */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    {mod.icon === 'chart' && (
                      <>
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </>
                    )}
                    {mod.icon === 'portfolio' && (
                      <>
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                      </>
                    )}
                  </svg>
                </div>

                <h3 style={{
                  color: '#fafafa',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 10px 0',
                }}>
                  {mod.title}
                </h3>

                <p style={{
                  color: '#71717a',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: '0 0 20px 0',
                }}>
                  {mod.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {mod.features.map((f, i) => (
                    <span key={i} style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: '#a5b4fc',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  top: '28px',
                  right: '28px',
                  color: '#3f3f46',
                  fontSize: '20px',
                }}>
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div style={{
        padding: '60px 32px',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              color: '#fafafa',
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 12px 0',
            }}>
              Comprehensive Metrics
            </h2>
            <p style={{ color: '#52525b', fontSize: '15px', margin: 0 }}>
              Industry-standard quantitative metrics for thorough analysis
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {metrics.map((group) => (
              <div key={group.category} style={{
                background: 'rgba(24, 24, 27, 0.4)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <h3 style={{
                  color: '#6366f1',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                }}>
                  {group.category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {group.items.map((item, i) => (
                    <div key={i} style={{
                      color: '#a1a1aa',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#3f3f46',
                      }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '32px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: '#3f3f46', fontSize: '13px' }}>
              IF ESILV 2025-2026
            </span>
            <span style={{ color: '#27272a' }}>|</span>
            <span style={{ color: '#3f3f46', fontSize: '13px' }}>
              React + Flask + Pandas
            </span>
          </div>
          <span style={{ color: '#52525b', fontSize: '13px', fontWeight: '500' }}>
            Sacha Guillou Keredan & Martin Partiot
          </span>
        </div>
      </div>
    </div>
  );
}
