import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-6">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-900/20 p-8 text-center">
            <h1 className="mb-4 text-2xl font-semibold text-red-300">Something went wrong</h1>
            <p className="mb-4 text-sm text-slate-400">
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-6 py-2 text-sm font-semibold text-white"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

