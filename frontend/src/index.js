import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function StatusBadge({ ok }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: ok ? '#d4edda' : '#f8d7da',
      color: ok ? '#155724' : '#721c24',
    }}>
      {ok ? '✅ OK' : '❌ Erreur'}
    </span>
  );
}

function Card({ icon, title, children }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderLeft: '4px solid #4f46e5',
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#1e1b4b', fontSize: '16px' }}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ color: '#6b7280', fontSize: '14px' }}>{label}</span>
      <span style={{ color: '#111827', fontWeight: '500', fontSize: '14px' }}>{value}</span>
    </div>
  );
}

function App() {
  const [data, setData] = useState({ health: null, info: null, env: null, db: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [h, i, e, d] = await Promise.all([
          fetch(`${BACKEND_URL}/health`).then(r => r.json()),
          fetch(`${BACKEND_URL}/info`).then(r => r.json()),
          fetch(`${BACKEND_URL}/env`).then(r => r.json()),
          fetch(`${BACKEND_URL}/db`).then(r => r.json()),
        ]);
        setData({ health: h, info: i, env: e, db: d });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', margin: '0 0 8px 0' }}>
            🚀 Flask Render Platform
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '15px' }}>
            Déployé par <strong>Huart Antony</strong>
          </p>
          <div style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '12px',
          }}>
            Flask · Docker · GHCR · Terraform · Render
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            Connexion au backend Flask...
          </div>
        )}

        {error && (
          <Card icon="⚠️" title="Erreur de connexion">
            <p style={{ color: '#dc2626', margin: 0, fontSize: '14px' }}>{error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            <Card icon="🩺" title="Health Check">
              <Row label="Status" value={data.health?.status} />
              <div style={{ marginTop: '8px' }}>
                <StatusBadge ok={data.health?.status?.includes('ok')} />
              </div>
            </Card>

            <Card icon="ℹ️" title="Informations">
              <Row label="Application" value={data.info?.app} />
              <Row label="Étudiant" value={data.info?.student} />
              <Row label="Version" value={data.info?.version} />
            </Card>

            <Card icon="🌍" title="Environnement">
              <Row label="ENV" value={data.env?.env} />
              <div style={{ marginTop: '8px' }}>
                <StatusBadge ok={data.env?.env === 'production'} />
              </div>
            </Card>

            <Card icon="🗄️" title="Base de données PostgreSQL">
              <Row label="Status" value={data.db?.status} />
              {data.db?.postgresql && (
                <Row label="Version" value={data.db.postgresql.split(' ').slice(0, 2).join(' ')} />
              )}
              <div style={{ marginTop: '8px' }}>
                <StatusBadge ok={data.db?.status === 'connected'} />
              </div>
            </Card>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '24px' }}>
          React · Flask · PostgreSQL · Adminer · Terraform
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
