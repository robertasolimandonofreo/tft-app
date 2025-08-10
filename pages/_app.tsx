import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import Head from 'next/head'
import '../src/styles/globals.css'

interface ApiError {
  response?: {
    status: number
  }
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount: number, error: unknown) => {
          if (isApiError(error) && error.response?.status === 404) return false
          if (isApiError(error) && error.response?.status === 429) return false
          return failureCount < 2
        },
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>TFT Stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="TFT Stats" />
        <meta charSet="UTF-8" />
        <meta name="author" content="Roberta Soliman" />
        <meta name="keywords" content="TFT, TFT Stats, TFT Stats App, League of Legends, TFT Stats App" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        <link rel="icon" type="image/png" href="/icon1.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}