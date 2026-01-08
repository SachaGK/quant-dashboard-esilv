import { useState, useEffect } from 'react';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  loading: boolean;
}

const MAJOR_TICKERS = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: '^IXIC', name: 'Nasdaq' },
  { symbol: '^FCHI', name: 'CAC 40' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Google' },
  { symbol: 'NVDA', name: 'Nvidia' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'MC.PA', name: 'LVMH' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'GC=F', name: 'Gold' },
];

export default function TickerBanner() {
  const [tickers, setTickers] = useState<TickerData[]>(
    MAJOR_TICKERS.map(idx => ({ symbol: idx.symbol, price: 0, change: 0, loading: true }))
  );

  useEffect(() => {
    const fetchTicker = async (symbol: string, index: number) => {
      try {
        const response = await fetch(`http://localhost:5000/api/asset/${symbol}`);
        const data = await response.json();
        if (!data.error) {
          setTickers(prev => {
            const newTickers = [...prev];
            newTickers[index] = { symbol, price: data.current_price, change: data.price_change, loading: false };
            return newTickers;
          });
        }
      } catch {
        setTickers(prev => {
          const newTickers = [...prev];
          newTickers[index] = { ...newTickers[index], loading: false };
          return newTickers;
        });
      }
    };

    MAJOR_TICKERS.forEach((idx, i) => fetchTicker(idx.symbol, i));
    const interval = setInterval(() => MAJOR_TICKERS.forEach((idx, i) => fetchTicker(idx.symbol, i)), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#09090b',
      borderBottom: '1px solid #18181b',
      height: '32px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', animation: 'scroll 50s linear infinite' }}>
        {[...tickers, ...tickers].map((ticker, index) => {
          const indexInfo = MAJOR_TICKERS[index % MAJOR_TICKERS.length];
          const isPositive = ticker.change >= 0;
          return (
            <div key={`${ticker.symbol}-${index}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 20px',
              borderRight: '1px solid #18181b',
            }}>
              <span style={{ color: '#71717a', fontSize: '12px' }}>{indexInfo.name}</span>
              {ticker.loading ? (
                <span style={{ color: '#3f3f46', fontSize: '12px' }}>--</span>
              ) : (
                <>
                  <span style={{ color: '#fafafa', fontSize: '12px', fontWeight: '500' }}>
                    ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ color: isPositive ? '#10b981' : '#ef4444', fontSize: '11px', fontWeight: '500' }}>
                    {isPositive ? '+' : ''}{ticker.change.toFixed(2)}%
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
