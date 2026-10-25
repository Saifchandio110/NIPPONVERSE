import { Component, type ErrorInfo, type ReactNode } from 'react';

// Class components cannot use hooks, so this fallback is bilingual and static.
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('NipponVerse error:', error, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold">Something went wrong / کچھ غلط ہو گیا</h1>
        <p className="mt-2">Your saved progress is not affected. / آپ کی محفوظ شدہ پیش رفت متاثر نہیں ہوئی۔</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-vermilion px-4 py-2 text-white"
          onClick={() => window.location.reload()}
        >
          Reload / دوبارہ لوڈ کریں
        </button>
      </div>
    );
  }
}
