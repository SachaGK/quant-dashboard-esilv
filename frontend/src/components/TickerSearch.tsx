import { useState, useRef, useEffect } from 'react';

interface TickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const POPULAR_TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC',
  'NFLX', 'ADBE', 'CRM', 'ORCL', 'CSCO', 'AVGO', 'QCOM', 'TXN', 'INTU', 'PYPL',
  'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'BLK', 'SCHW', 'AXP', 'V', 'MA',
  'JNJ', 'UNH', 'PFE', 'ABBV', 'TMO', 'MRK', 'ABT', 'LLY', 'AMGN', 'CVS',
  'WMT', 'PG', 'KO', 'PEP', 'COST', 'NKE', 'MCD', 'SBUX', 'HD', 'DIS',
  'XOM', 'CVX', 'BA', 'CAT', 'GE', 'MMM', 'HON', 'UPS', 'LMT', 'RTX',
  'SPY', 'QQQ', 'DIA', 'IWM', 'VTI', 'VOO',
  'MC.PA', 'OR.PA', 'SAN.PA', 'AIR.PA', 'BNP.PA', 'SU.PA', 'ENGI.PA', 'SGO.PA',
  'CA.PA', 'ATO.PA', 'CS.PA', 'BN.PA', 'KER.PA', 'RMS.PA', 'DSY.PA', 'EL.PA',
  'VIE.PA', 'DG.PA', 'PUB.PA', 'RI.PA', 'SAF.PA', 'STM.PA', 'URW.PA', 'TTE.PA',
  'SAP.DE', 'SIE.DE', 'VOW3.DE', 'BMW.DE', 'MBG.DE', 'BAS.DE', 'ALV.DE', 'DTE.DE',
  'BP.L', 'SHEL.L', 'HSBA.L', 'AZN.L', 'ULVR.L', 'RIO.L', 'GSK.L',
  'COIN', 'MSTR', 'RIOT', 'MARA',
];

export default function TickerSearch({ value, onChange, placeholder = "Search symbol..." }: TickerSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTickers, setFilteredTickers] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    const upperVal = val.toUpperCase();
    setInputValue(upperVal);

    if (upperVal.length > 0) {
      const filtered = POPULAR_TICKERS.filter(ticker =>
        ticker.includes(upperVal)
      ).slice(0, 8);
      setFilteredTickers(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredTickers([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (ticker: string) => {
    setInputValue(ticker);
    onChange(ticker);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      onChange(inputValue);
    }, 200);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (inputValue.length > 0) {
            const filtered = POPULAR_TICKERS.filter(ticker =>
              ticker.includes(inputValue.toUpperCase())
            ).slice(0, 8);
            setFilteredTickers(filtered);
            setShowSuggestions(true);
          }
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '13px',
          borderRadius: '8px',
          background: '#09090b',
          border: '1px solid #3f3f46',
          color: '#fafafa',
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#52525b'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3f3f46'}
      />

      {showSuggestions && filteredTickers.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '8px',
          maxHeight: '240px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}>
          {filteredTickers.map((ticker, index) => (
            <div
              key={ticker}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(ticker);
              }}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                color: '#fafafa',
                fontSize: '13px',
                borderBottom: index < filteredTickers.length - 1 ? '1px solid #27272a' : 'none',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#27272a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {ticker}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
