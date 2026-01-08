import { useState, useEffect } from 'react';
import { getAssetData } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import Tooltip from '../components/Tooltip';
import TickerSearch from '../components/TickerSearch';

export default function SingleAsset() {
  const [ticker, setTicker] = useState('AAPL');
  const [strategy, setStrategy] = useState('buy-hold');
  const [strategyParam, setStrategyParam] = useState(20);
  const [data, setData] = useState<any>(null);
  const [backtestData, setBacktestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const result = await getAssetData(ticker);
      if (result.error) {
        alert(`Error: ${result.error}`);
        setLoading(false);
        return;
      }
      setData(result);

      const backtestResponse = await fetch('http://localhost:5000/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, strategy, period: strategyParam })
      });
      const backtestResult = await backtestResponse.json();
      if (backtestResult.error) {
        alert(`Backtest error: ${backtestResult.error}`);
        setLoading(false);
        return;
      }
      setBacktestData(backtestResult);
      setInitialLoadDone(true);
    } catch (error: any) {
      alert('Connection error: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!initialLoadDone) return;
    const runBacktest = async () => {
      setLoading(true);
      try {
        const backtestResponse = await fetch('http://localhost:5000/api/backtest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker, strategy, period: strategyParam })
        });
        const backtestResult = await backtestResponse.json();
        if (!backtestResult.error) setBacktestData(backtestResult);
      } catch (error) {}
      setLoading(false);
    };
    runBacktest();
  }, [strategy, strategyParam, ticker, initialLoadDone]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (!initialLoadDone) return;

    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refreshing data (5min interval)...');
      handleFetch();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [initialLoadDone, ticker, strategy, strategyParam]);

  const strategies: Record<string, string> = {
    'buy-hold': 'Buy & Hold',
    'momentum': 'Momentum',
    'mean-reversion': 'Mean Reversion',
    'bollinger': 'Bollinger Bands',
    'rsi': 'RSI Strategy',
    'breakout': 'Breakout',
  };

  const MetricCard = ({ label, value, subtext, color = '#fafafa', tooltip }: any) => (
    <div style={{
      background: '#18181b',
      padding: '16px',
      borderRadius: '10px',
      border: '1px solid #27272a',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ color: '#71717a', fontSize: '12px' }}>{label}</span>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div style={{ color, fontSize: '22px', fontWeight: '600' }}>{value}</div>
      {subtext && <div style={{ color: '#52525b', fontSize: '11px', marginTop: '4px' }}>{subtext}</div>}
    </div>
  );

  const SmallMetric = ({ label, value, status, tooltip }: any) => (
    <div style={{
      background: '#09090b',
      padding: '12px',
      borderRadius: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
        <span style={{ color: '#71717a', fontSize: '11px' }}>{label}</span>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div style={{ color: '#fafafa', fontSize: '15px', fontWeight: '600' }}>{value}</div>
      {status && (
        <div style={{
          color: status === 'good' ? '#10b981' : status === 'warn' ? '#f59e0b' : '#ef4444',
          fontSize: '10px',
          marginTop: '3px',
        }}>
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
            <h1 style={{ color: '#fafafa', fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>Single Asset Analysis</h1>
            <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Backtest trading strategies on individual securities</p>
          </div>
          {data && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#fafafa', fontSize: '20px', fontWeight: '600' }}>{ticker}</span>
              <span style={{ color: '#a1a1aa', fontSize: '18px' }}>${data.current_price.toFixed(2)}</span>
              <span style={{
                color: data.price_change >= 0 ? '#10b981' : '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                padding: '4px 10px',
                background: data.price_change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
              }}>
                {data.price_change >= 0 ? '+' : ''}{data.price_change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{
          background: '#18181b',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #27272a',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end',
        }}>
          <div style={{ width: '200px' }}>
            <label style={{ color: '#71717a', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Symbol</label>
            <TickerSearch value={ticker} onChange={setTicker} />
          </div>
          <div style={{ width: '180px' }}>
            <label style={{ color: '#71717a', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                borderRadius: '8px',
                background: '#09090b',
                border: '1px solid #3f3f46',
                color: '#fafafa',
                cursor: 'pointer',
              }}
            >
              {Object.entries(strategies).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          {strategy !== 'buy-hold' && (
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <label style={{ color: '#71717a', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                MA Period: <span style={{ color: '#6366f1' }}>{strategyParam} days</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={strategyParam}
                onChange={(e) => setStrategyParam(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>
          )}
          <button
            onClick={handleFetch}
            disabled={loading}
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
              background: loading ? '#27272a' : '#fafafa',
              color: loading ? '#52525b' : '#09090b',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Loading...' : 'Run Analysis'}
          </button>
        </div>

        {/* Results */}
        {data && backtestData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
            {/* Chart */}
            <div style={{
              background: '#18181b',
              borderRadius: '10px',
              padding: '24px',
              border: '1px solid #27272a',
            }}>
              <h3 style={{ color: '#fafafa', fontSize: '15px', fontWeight: '600', margin: '0 0 20px 0' }}>
                Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={backtestData.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <ChartTooltip
                    contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#a1a1aa' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={false} name="Buy & Hold" />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} name={strategies[strategy]} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Key Metrics */}
              <div style={{
                background: '#18181b',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #27272a',
              }}>
                <h3 style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '600', margin: '0 0 16px 0' }}>Key Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <MetricCard
                    label="Return"
                    value={`${backtestData.strategy_return >= 0 ? '+' : ''}${backtestData.strategy_return.toFixed(2)}%`}
                    color={backtestData.strategy_return >= 0 ? '#10b981' : '#ef4444'}
                    subtext="90 days"
                    tooltip="Total strategy return"
                  />
                  <MetricCard
                    label="Sharpe Ratio"
                    value={backtestData.sharpe_ratio.toFixed(2)}
                    subtext={backtestData.sharpe_ratio > 1 ? 'Good' : backtestData.sharpe_ratio > 0 ? 'Fair' : 'Weak'}
                    tooltip="Risk-adjusted return (>1 good, >2 excellent)"
                  />
                  <MetricCard
                    label="Max Drawdown"
                    value={`-${Math.abs(backtestData.max_drawdown).toFixed(2)}%`}
                    color="#ef4444"
                    tooltip="Largest peak to trough decline"
                  />
                  <MetricCard
                    label="Volatility"
                    value={`${(backtestData.sharpe_ratio !== 0 ? Math.abs(backtestData.strategy_return / backtestData.sharpe_ratio) : 0).toFixed(2)}%`}
                    tooltip="Annualized standard deviation"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && (
          <div style={{
            background: '#18181b',
            borderRadius: '10px',
            padding: '80px',
            textAlign: 'center',
            border: '1px solid #27272a',
          }}>
            <div style={{ color: '#71717a', fontSize: '14px' }}>Enter a symbol and click "Run Analysis" to start</div>
          </div>
        )}
      </div>
    </div>
  );
}
