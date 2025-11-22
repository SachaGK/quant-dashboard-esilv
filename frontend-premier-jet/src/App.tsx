// Quant Dashboard - Frontend Base Structure (premier jet)
// This is the foundation of the React application
// Additional components and pages will be added in future iterations

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#09090b',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h1 style={{ color: '#fafafa', marginBottom: '16px' }}>Quant Dashboard</h1>
      <p style={{ color: '#71717a' }}>Frontend base structure - premier jet</p>
    </div>
  );
}

export default App;
