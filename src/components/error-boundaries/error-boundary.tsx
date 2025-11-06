import React from 'react';

import type { ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error: unknown): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Возникла ошибка!', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <section
          style={{ padding: '1rem', fontFamily: 'monospace', background: '#fdd' }}
        >
          <h1>Что-то пошло не так :(</h1>
          <p>В приложении произошла ошибка. Пожалуйста, перезагрузите страницу.</p>

          {/* Debug информация */}
          {this.state.error && (
            <div style={{ marginTop: '1rem' }}>
              <h2>Debug info:</h2>
              <p>
                <strong>Сообщение:</strong> {this.state.error.message}
              </p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </section>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};
