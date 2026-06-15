import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgb(253, 251, 247)',
          padding: '2rem',
          fontFamily: "'Nunito', sans-serif",
          color: '#332F2A',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Your garden had a hiccup
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#8F867A', marginBottom: '1.5rem', maxWidth: '320px', lineHeight: 1.6 }}>
            Something unexpected happened. Don't worry — your plants are safe. Try reloading to get back to your garden.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: 'rgb(0, 168, 120)',
              color: 'white',
              border: 'none',
              borderRadius: '28px',
              padding: '0.75rem 2rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              boxShadow: '0 4px 12px rgba(0, 168, 120, 0.3)',
            }}
          >
            Reload Garden
          </button>
          {this.state.error && (
            <details style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#8F867A', maxWidth: '320px' }}>
              <summary style={{ cursor: 'pointer' }}>Technical details</summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '0.5rem', textAlign: 'left' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
