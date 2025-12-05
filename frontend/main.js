const API_BASE_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('check-api');
    const statusEl = document.getElementById('api-status');

    if (!btn || !statusEl) return;

    btn.addEventListener('click', async () => {
        statusEl.textContent = 'Statut API : test en cours...';

        try {
            const res = await fetch(`${API_BASE_URL}/api/health`);
            if (!res.ok) {
                throw new Error('HTTP ' + res.status);
            }
            const data = await res.json();
            statusEl.textContent = `Statut API : OK (${data.status})`;
        } catch (err) {
            console.error(err);
            statusEl.textContent = 'Statut API : ERREUR (backend non joignable)';
        }
    });
});
