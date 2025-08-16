import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../src/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TFT Stats Brasil</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Estatísticas do Teamfight Tactics no Brasil" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
      </Head>
      
      <Component {...pageProps} />
    </>
  )
}