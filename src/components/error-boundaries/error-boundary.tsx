import React from 'react';

import type { ReactNode } from 'react';

import styles from './error-boundary.module.css';

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
        <section className={styles.error_section}>
          <h1 className={styles.title}>Что-то пошло не так :(</h1>
          <p className={styles.message}>
            В приложении произошла ошибка. Пожалуйста, перезагрузите страницу.
          </p>

          {this.state.error && (
            <div className={styles.debug_block}>
              <h2 className={styles.debug_title}>Debug info:</h2>
              <p>
                <strong>Сообщение:</strong> {this.state.error.message}
              </p>
              <pre className={styles.stack_trace}>
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
