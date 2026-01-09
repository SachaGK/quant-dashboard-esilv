import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Tooltip from '../components/Tooltip';
import TickerSearch from '../components/TickerSearch';

interface Asset {
  ticker: string;
  weight: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Portfolio() {
  const [assets, setAssets] = useState<Asset[]>([
    { ticker: 'AAPL', weight: 30 },
    { ticker: 'MSFT', weight: 30 },
    { ticker: 'GOOGL', weight: 20 },
    { ticker: 'TSLA', weight: 20 },
  ]);
  const [rebalanceFreq, setRebalanceFreq] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAddAsset = () => {
    if (assets.length < 8) setAssets([...assets, { ticker: 'NVDA', weight: 10 }]);
  };

  const handleRemoveAsset = (index: number) => {
    if (assets.length > 2) setAssets(assets.filter((_, i) => i !== index));
  };

  const handleWeightChange = (index: number, value: number) => {
    const newAssets = [...assets];
    newAssets[index].weight = value;
    setAssets(newAssets);
  };

  const handleTickerChange = (index: number, ticker: string) => {
    const newAssets = [...assets];
    newAssets[index].ticker = ticker;
    setAssets(newAssets);
  };

  const normalizeWeights = () => {
    const total = assets.reduce((sum, a) => sum + a.weight, 0);
    if (total !== 100) setAssets(assets.map(a => ({ ...a, weight: (a.weight / total) * 100 })));
  };

  const handleAnalyze = async () => {
    normalizeWeights();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assets: assets.map(a => ({ ticker: a.ticker, weight: a.weight / 100 })),
          rebalance_freq: rebalanceFreq
        })
      });
      const result = await response.json();
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        setPortfolioData(result);
      }
    } catch (error) {
      alert('Connection error');
    }
    setLoading(false);
  };

  const totalWeight = assets.reduce((sum, a) => sum + a.weight, 0);

  // Auto-refresh portfolio data every 5 minutes
  useEffect(() => {
    if (!portfolioData) return;

    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refreshing portfolio data (5min interval)...');
      handleAnalyze();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [portfolioData, assets, rebalanceFreq]);

  const SmallMetric = ({ label, value, status, tooltip }: any) => (
    <div style={{ background: '#09090b', padding: '12px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
        <span style={{ color: '#71717a', fontSize: '11px' }}>{label}</span>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div style={{ color: '#fafafa', fontSize: '15px', fontWeight: '600' }}>{value}</div>
      {status && (
        <div style={{ color: status === 'good' ? '#10b981' : status === 'warn' ? '#f59e0b' : '#ef4444', fontSize: '10px', marginTop: '3px' }}>
          {status === 'good' ? 'Good' : status === 'warn' ? 'Fair' : 'Weak'}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', background: '#09090b', padding: '24px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#fafafa', fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Portfolio Analysis</h1>
            <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Build and analyze multi-asset portfolios</p>
          </div>
          {portfolioData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Portfolio Value:</span>
              <span style={{ color: '#fafafa', fontSize: '20px', fontWeight: '600' }}>${portfolioData.total_value.toFixed(2)}</span>
              <span style={{
                color: portfolioData.total_return >= 0 ? '#10b981' : '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                padding: '4px 10px',
                background: portfolioData.total_return >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
              }}>
                {portfolioData.total_return >= 0 ? '+' : ''}{portfolioData.total_return.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          {/* Left: Config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Assets */}
            <div style={{ background: '#18181b', borderRadius: '10px', padding: '20px', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#fafafa', fontSize: '14px', fontWeight: '600' }}>Assets ({assets.length}/8)</span>
                <button
                  onClick={handleAddAsset}
                  disabled={assets.length >= 8}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    background: assets.length >= 8 ? '#27272a' : 'rgba(99, 102, 241, 0.15)',
                    color: assets.length >= 8 ? '#52525b' : '#6366f1',
                    border: 'none',
                    cursor: assets.length >= 8 ? 'not-allowed' : 'pointer',
                  }}
                >
                  + Add Asset
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {assets.map((asset, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 36px', gap: '8px', alignItems: 'center' }}>
                    <TickerSearch value={asset.ticker} onChange={(value) => handleTickerChange(index, value)} />
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={asset.weight.toFixed(0)}
                        onChange={(e) => handleWeightChange(index, Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 28px 10px 12px',
                          fontSize: '13px',
                          borderRadius: '8px',
                          background: '#09090b',
                          border: '1px solid #3f3f46',
                          color: '#fafafa',
                          textAlign: 'right',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', fontSize: '12px' }}>%</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAsset(index)}
                      disabled={assets.length <= 2}
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        background: assets.length <= 2 ? '#09090b' : 'rgba(239, 68, 68, 0.1)',
                        color: assets.length <= 2 ? '#52525b' : '#ef4444',
                        border: 'none',
                        cursor: assets.length <= 2 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {totalWeight !== 100 && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ef4444', fontSize: '12px' }}>Total: {totalWeight.toFixed(0)}% (should be 100%)</span>
                  <button onClick={normalizeWeights} style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: '#fafafa', color: '#09090b', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                    Normalize
                  </button>
                </div>
              )}
            </div>

            {/* Rebalance */}
            <div style={{ background: '#18181b', borderRadius: '10px', padding: '20px', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#fafafa', fontSize: '14px', fontWeight: '600' }}>Rebalancing</span>
                <Tooltip text="How often portfolio weights are reset to target allocation" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                  <button
                    key={freq}
                    onClick={() => setRebalanceFreq(freq)}
                    style={{
                      padding: '10px',
                      fontSize: '12px',
                      borderRadius: '8px',
                      background: rebalanceFreq === freq ? 'rgba(99, 102, 241, 0.15)' : '#09090b',
                      color: rebalanceFreq === freq ? '#6366f1' : '#71717a',
                      border: rebalanceFreq === freq ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      fontWeight: rebalanceFreq === freq ? '600' : '400',
                    }}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Run */}
            <button
              onClick={handleAnalyze}
              disabled={loading || totalWeight !== 100}
              style={{
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '8px',
                background: (loading || totalWeight !== 100) ? '#27272a' : '#fafafa',
                color: (loading || totalWeight !== 100) ? '#52525b' : '#09090b',
                border: 'none',
                cursor: (loading || totalWeight !== 100) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>

            {/* Pie */}
            {portfolioData && (
              <div style={{ background: '#18181b', borderRadius: '10px', padding: '20px', border: '1px solid #27272a' }}>
                <span style={{ color: '#fafafa', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '16px' }}>Allocation</span>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={assets.map(a => ({ name: a.ticker, value: a.weight }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {assets.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right: Results */}
          {portfolioData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Key Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Return', value: `${portfolioData.total_return >= 0 ? '+' : ''}${portfolioData.total_return.toFixed(2)}%`, color: portfolioData.total_return >= 0 ? '#10b981' : '#ef4444' },
                  { label: 'Volatility', value: `${portfolioData.portfolio_volatility.toFixed(2)}%`, color: '#f59e0b' },
                  { label: 'Sharpe Ratio', value: portfolioData.sharpe_ratio.toFixed(2), color: '#fafafa' },
                  { label: 'Max Drawdown', value: `-${Math.abs(portfolioData.max_drawdown).toFixed(2)}%`, color: '#ef4444' },
                ].map((m, i) => (
                  <div key={i} style={{ background: '#18181b', borderRadius: '10px', padding: '20px', border: '1px solid #27272a', textAlign: 'center' }}>
                    <div style={{ color: '#71717a', fontSize: '12px', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ color: m.color, fontSize: '24px', fontWeight: '600' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ background: '#18181b', borderRadius: '10px', padding: '24px', border: '1px solid #27272a' }}>
                <h3 style={{ color: '#fafafa', fontSize: '15px', fontWeight: '600', margin: '0 0 20px 0' }}>Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioData.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={11} />
                    <YAxis stroke="#52525b" fontSize={11} />
                    <ChartTooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="portfolio" stroke="#fafafa" strokeWidth={3.5} dot={false} name="Portfolio" />
                    {assets.map((asset, index) => (
                      <Line key={asset.ticker} type="monotone" dataKey={asset.ticker} stroke={COLORS[index % COLORS.length]} strokeWidth={1.5} dot={false} name={asset.ticker} opacity={0.5} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Metrics */}
              <div style={{ background: '#18181b', borderRadius: '10px', padding: '20px', border: '1px solid #27272a' }}>
                <h3 style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '600', margin: '0 0 16px 0' }}>Risk & Distribution Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  <SmallMetric label="Sortino" value={portfolioData.sortino_ratio?.toFixed(2) ?? 'N/A'} status={portfolioData.sortino_ratio > 1.5 ? 'good' : portfolioData.sortino_ratio > 0.5 ? 'warn' : 'bad'} tooltip="Downside risk-adjusted" />
                  <SmallMetric label="Calmar" value={portfolioData.calmar_ratio?.toFixed(2) ?? 'N/A'} status={portfolioData.calmar_ratio > 2 ? 'good' : portfolioData.calmar_ratio > 0.5 ? 'warn' : 'bad'} tooltip="Return / Max DD" />
                  <SmallMetric label="Omega" value={portfolioData.omega_ratio?.toFixed(2) ?? 'N/A'} status={portfolioData.omega_ratio > 1.2 ? 'good' : portfolioData.omega_ratio > 1 ? 'warn' : 'bad'} tooltip="Gains/losses" />
                  <SmallMetric label="VaR 95%" value={`${portfolioData.var_95?.toFixed(2)}%`} tooltip="Value at Risk" />
                  <SmallMetric label="CVaR 95%" value={`${portfolioData.cvar_95?.toFixed(2)}%`} tooltip="Expected shortfall" />
                  <SmallMetric label="Hit Rate" value={`${portfolioData.hit_ratio?.toFixed(1)}%`} status={portfolioData.hit_ratio > 55 ? 'good' : portfolioData.hit_ratio > 45 ? 'warn' : 'bad'} tooltip="Win rate" />
                  <SmallMetric label="Win/Loss" value={portfolioData.win_loss_ratio?.toFixed(2) ?? 'N/A'} status={portfolioData.win_loss_ratio > 1.5 ? 'good' : portfolioData.win_loss_ratio > 0.8 ? 'warn' : 'bad'} tooltip="Avg win/loss" />
                  <SmallMetric label="Skewness" value={portfolioData.skewness?.toFixed(2)} tooltip="Asymmetry" />
                  <SmallMetric label="Kurtosis" value={portfolioData.kurtosis?.toFixed(2)} tooltip="Tail risk" />
                  <SmallMetric label="Info Ratio" value={portfolioData.information_ratio?.toFixed(2) ?? 'N/A'} status={portfolioData.information_ratio > 0.5 ? 'good' : portfolioData.information_ratio > 0 ? 'warn' : 'bad'} tooltip="vs S&P 500" />
                </div>
              </div>

              {/* ML Prediction (Bonus Feature) */}
              {portfolioData.ml_prediction?.enabled && (
                <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '10px', padding: '20px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <h3 style={{ color: '#fafafa', fontSize: '13px', fontWeight: '600', margin: 0 }}>🤖 ML Prediction (Linear Regression)</h3>
                    <Tooltip text="Machine learning prediction using historical returns with rolling window approach" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <SmallMetric label="Next Day" value={`${portfolioData.ml_prediction.next_day_prediction >= 0 ? '+' : ''}${portfolioData.ml_prediction.next_day_prediction?.toFixed(2)}%`} tooltip="Predicted return for next trading day" />
                    <SmallMetric label="5-Day Forecast" value={`${portfolioData.ml_prediction.five_day_cumulative >= 0 ? '+' : ''}${portfolioData.ml_prediction.five_day_cumulative?.toFixed(2)}%`} tooltip="Cumulative predicted return over 5 days" />
                    <SmallMetric label="Model Accuracy" value={`${portfolioData.ml_prediction.model_accuracy?.toFixed(1)}%`} status={portfolioData.ml_prediction.model_accuracy > 60 ? 'good' : portfolioData.ml_prediction.model_accuracy > 50 ? 'warn' : 'bad'} tooltip="Direction prediction accuracy on training data" />
                    <SmallMetric label="Model R²" value={portfolioData.ml_prediction.model_r2?.toFixed(3)} status={portfolioData.ml_prediction.model_r2 > 0.3 ? 'good' : portfolioData.ml_prediction.model_r2 > 0.1 ? 'warn' : 'bad'} tooltip="Model fit quality (0-1, higher is better)" />
                  </div>
                  <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '11px', color: '#a1a1aa' }}>
                    Note: Predictions are based on historical patterns and should not be the sole basis for investment decisions
                  </div>
                </div>
              )}

              {/* Correlation */}
              <div style={{ background: '#18181b', borderRadius: '10px', padding: '20px', border: '1px solid #27272a' }}>
                <h3 style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '600', margin: '0 0 16px 0' }}>Correlation Matrix</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#71717a' }}></th>
                        {Object.keys(portfolioData.correlation_matrix).map(ticker => (
                          <th key={ticker} style={{ padding: '10px', textAlign: 'center', color: '#fafafa', fontWeight: '600' }}>{ticker}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(portfolioData.correlation_matrix).map(([ticker1, correlations]: [string, any]) => (
                        <tr key={ticker1}>
                          <td style={{ padding: '10px', color: '#fafafa', fontWeight: '600' }}>{ticker1}</td>
                          {Object.entries(correlations).map(([ticker2, corr]: [string, any]) => (
                            <td key={ticker2} style={{
                              padding: '10px',
                              textAlign: 'center',
                              borderRadius: '6px',
                              background: ticker1 === ticker2 ? '#27272a' : corr > 0.7 ? 'rgba(239, 68, 68, 0.15)' : corr > 0.3 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: ticker1 === ticker2 ? '#71717a' : '#fafafa',
                            }}>
                              {corr.toFixed(2)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#18181b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #27272a' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#71717a', fontSize: '14px' }}>Configure your portfolio and click "Run Analysis"</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
