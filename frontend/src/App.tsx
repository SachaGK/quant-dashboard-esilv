import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import TickerBanner from './components/TickerBanner';
import SingleAsset from './pages/SingleAsset';
import Portfolio from './pages/Portfolio';
import Overview from './pages/Overview';

type Tab = 'overview' | 'single-asset' | 'portfolio';

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
        {activeTab === 'single-asset' && <SingleAsset />}
        {activeTab === 'portfolio' && <Portfolio />}
      </main>
    </div>
  );
}

export default App;
