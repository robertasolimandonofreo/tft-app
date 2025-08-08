import { Component, ReactNode } from 'react'
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorMessage
          title="Algo deu errado"
          message="Ocorreu um erro inesperado. Tente recarregar a página."
        />
      )
    }

    return this.props.children
  }
}

interface ErrorMessageProps {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
      <div className="text-2xl mb-2">❌</div>
      <h3 className="text-xl font-bold text-red-300 mb-2">{title}</h3>
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}