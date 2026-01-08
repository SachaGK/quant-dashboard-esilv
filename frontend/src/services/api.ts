const API_URL = 'http://localhost:5000/api';

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend:', data);
    return data.status === 'online';
  } catch (error) {
    console.error('❌ Backend unreachable');
    return false;
  }
}

export async function getAssetData(ticker: string) {
  console.log(`📡 Fetching ${ticker}...`);
  const response = await fetch(`${API_URL}/asset/${ticker}`);
  const data = await response.json();
  console.log(`✅ Received data for ${ticker}`);
  return data;
}
