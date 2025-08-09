import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  showNavigation?: boolean
  description?: string
}

export function MainLayout({ 
  children, 
  title = 'TFT Stats', 
  showBackButton = false,
  showNavigation = true,
  description = 'Estatísticas completas do Teamfight Tactics'
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} - TFT Stats Brasil</title>
        <meta name="description" content={description} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {showNavigation && (
            <nav className="mb-8">
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/leagues" 
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
                >
                  🏆 High Tier Leagues
                </Link>
              </div>
            </nav>
          )}
          
          {showBackButton && (
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors"
              >
                ← Voltar ao início
              </Link>
            </div>
          )}
          
          {children}
        </div>
      </div>
    </>
  )
}