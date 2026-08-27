import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4 py-16 bg-north-bg text-north-black">
          <div className="border-2 border-north-black bg-white p-8 sm:p-12 max-w-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
            <span className="bg-red-500 text-white font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-north-black inline-block">
              APPLICATION NOTICE
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-north-black">
              Something went wrong
            </h2>
            <p className="text-north-gray text-xs sm:text-sm leading-relaxed">
              An unexpected display issue occurred while rendering this page.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/blogs"
                className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs uppercase font-bold w-full sm:w-auto text-center"
              >
                ← Return to Blogs
              </a>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="btn-north bg-white text-north-black hover:bg-north-bg text-xs uppercase font-bold w-full sm:w-auto"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
