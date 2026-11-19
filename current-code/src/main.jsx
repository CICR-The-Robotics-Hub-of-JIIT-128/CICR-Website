import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initSecurityShield } from './utils/securityShield';

// Initialize global client anti-tamper and DevTools protection
initSecurityShield();

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CICR UI caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#07090e',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: 480,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            padding: '36px 28px',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(255, 96, 28, 0.12)',
              border: '1px solid rgba(255, 96, 28, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 10 }}>CICR Telemetry Reconnection</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 24 }}>
              The application encountered a transient interface issue while rendering. Click below to reload.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#ff601c',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
