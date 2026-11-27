import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-surface-container-lowest rounded-2xl p-6 shadow-lg border border-outline-variant/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">
                refresh
              </span>
            </div>
            <h1 className="text-lg font-bold text-on-surface">
              Something went wrong
            </h1>
            <p className="text-sm text-on-surface-variant">
              Please reload PathFinder Access to restore your navigation
              session.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full min-h-[46px] rounded-xl bg-primary text-on-primary font-bold text-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
