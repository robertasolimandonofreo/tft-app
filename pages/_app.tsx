import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import Head from 'next/head'
import '../src/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))

  return (
    <>
      <Head>
        <title>TFT Stats Brasil</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Estatísticas do Teamfight Tactics no Brasil" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
      </Head>
      
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
}