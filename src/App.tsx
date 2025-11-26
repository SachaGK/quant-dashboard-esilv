import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import TickerBanner from './components/TickerBanner';
import Overview from './pages/Overview';

type Tab = 'overview' | 'single-asset' | 'portfolio' | 'prediction';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      setActiveTab(e.detail as Tab);
    };
    window.addEventListener('navigate-tab' as any, handleNavigate);
    return () => window.removeEventListener('navigate-tab' as any, handleNavigate);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#09090b',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <TickerBanner />
      <main style={{ flex: 1 }}>
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'single-asset' && <div style={{ padding: '40px', color: '#71717a' }}>Single Asset - Coming in next iteration</div>}
        {activeTab === 'portfolio' && <div style={{ padding: '40px', color: '#71717a' }}>Portfolio - Coming in next iteration</div>}
        {activeTab === 'prediction' && <div style={{ padding: '40px', color: '#71717a' }}>Prediction - Coming in next iteration</div>}
      </main>
    </div>
  );
}

export default App;
