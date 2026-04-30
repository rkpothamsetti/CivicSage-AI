import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * React Error Boundary component.
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 * Prevents the entire app from crashing due to an error in a single component.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0e27',
            color: '#e8eaed',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: '2rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: "'Outfit', system-ui" }}>
              Something went wrong
            </h1>
            <p style={{ color: '#9aa0b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              An unexpected error occurred. Please try refreshing the page. If the problem
              persists, please try again later.
            </p>
            <button
              onClick={this.handleReset}
              aria-label="Try again to recover from error"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to render within the error boundary */
  children: PropTypes.node.isRequired,
};
