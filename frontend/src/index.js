import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function App() {
  const [health, setHealth] = useState(null);
  const [info, setInfo] = useState(null);
  const [env, setEnv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, infoRes, envRes] = await Promise.all([
          fetch(`${BACKEND_URL}/health`),
          fetch(`${BACKEND_URL}/info`),
          fetch(`${BACKEND_URL}/env`),
        ]);
        setHealth(await healthRes.json());
        setInfo(await infoRes.json());
        setEnv(await envRes.json());
      } catch (err) {
        setError("Impossible de joindre le backend Flask : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
    },
    title: { color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' },
    card: {
      backgroundColor: 'white',
      padding: '15px',
      margin: '15px 0',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    label: { fontWeight: 'bold', color: '#555' },
    value: { color: '#4CAF50' },
    error: { color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 Flask Render Platform</h1>
      <p><strong>Student:</strong> Huart Antony</p>

      {loading && <p>Chargement des données depuis le backend...</p>}
      {error && <div style={styles.error}>⚠️ {error}</div>}

      {health && (
        <div style={styles.card}>
          <h3>🩺 Health Check</h3>
          <p style={styles.label}>Status: <span style={styles.value}>{health.status}</span></p>
        </div>
      )}

      {info && (
        <div style={styles.card}>
          <h3>ℹ️ Info</h3>
          <p style={styles.label}>App: <span style={styles.value}>{info.app}</span></p>
          <p style={styles.label}>Student: <span style={styles.value}>{info.student}</span></p>
          <p style={styles.label}>Version: <span style={styles.value}>{info.version}</span></p>
        </div>
      )}

      {env && (
        <div style={styles.card}>
          <h3>🌍 Environnement</h3>
          <p style={styles.label}>ENV: <span style={styles.value}>{env.env}</span></p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
