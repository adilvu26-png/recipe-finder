import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In a production app this would report to a logging service.
    console.error('Unexpected rendering error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="text-2xl font-display font-semibold text-char-900">Something went wrong.</h1>
          <p className="text-char-500 max-w-sm">
            An unexpected error occurred while rendering the page.
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="px-5 py-2 rounded-full bg-saffron-500 text-white text-sm font-medium hover:bg-saffron-600 transition-colors"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
