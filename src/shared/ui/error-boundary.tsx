import React, { type ErrorInfo } from "react";
import { Link } from "react-router";

type Props = React.PropsWithChildren<{ fallback?: (error: Error) => React.ReactNode }>;

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        this.props.fallback?.(this.state.error) ?? (
          <div className="flex flex-col gap-2">
            <p>Something went wrong!</p>
            <p className="text-xs text-fg-muted">{this.state.error.message}</p>
            <p>
              <Link to="/">Go back to the home page</Link>
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
