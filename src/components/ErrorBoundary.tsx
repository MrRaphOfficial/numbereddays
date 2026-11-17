/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep error handling safe without logging PII
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-butter-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-butter-gold rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-[#E60023] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-charcoal">
              Session Reset Required
            </h2>
            <p className="text-xs text-slate-muted leading-relaxed">
              Something unexpected occurred in your browser session. Because no data is stored on this web app, you can safely reload to start fresh.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-xs font-bold cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Session</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
