import { LayoutIcon, LineChartIcon, PieChartIcon, TrendingUpIcon } from './Icons';

type Tab = 'overview' | 'single-asset' | 'portfolio' | 'prediction';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutIcon },
    { id: 'single-asset' as Tab, label: 'Single Asset', icon: LineChartIcon },
    { id: 'portfolio' as Tab, label: 'Portfolio', icon: PieChartIcon },
    { id: 'prediction' as Tab, label: 'Prediction', icon: TrendingUpIcon },
  ];

  return (
    <nav style={{
      background: '#09090b',
      borderBottom: '1px solid #27272a',
      padding: '0 32px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#6366f1',
            borderRadius: '6px',
          }} />
          <span style={{ color: '#fafafa', fontSize: '14px', fontWeight: '600' }}>Quant Dashboard</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: isActive ? '#27272a' : 'transparent',
                  color: isActive ? '#fafafa' : '#71717a',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#a1a1aa';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#71717a';
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
          <span style={{ color: '#71717a', fontSize: '12px' }}>Live</span>
        </div>
      </div>
    </nav>
  );
}
