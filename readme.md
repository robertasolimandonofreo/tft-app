# Documentação do Frontend - TFT App

## Visão Geral

Aplicação web React/Next.js para visualização de estatísticas do Teamfight Tactics, com design responsivo e otimizada para performance.

## Stack Tecnológico

- **Framework**: Next.js 15.4.6
- **React**: 19.1.0
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack React Query 5.84.1
- **HTTP Client**: Axios 1.11.0
- **TypeScript**: 5.x

## Estrutura de Diretórios

```
tft-app/
├── pages/                   # Páginas Next.js
│   ├── _app.tsx            # Configuração global da app
│   ├── index.tsx           # Página inicial
│   └── leagues.tsx         # Página de rankings
├── src/                    # Código fonte
│   ├── api.ts              # Cliente HTTP
│   ├── types.ts            # Definições TypeScript
│   ├── utils.ts            # Funções utilitárias
│   └── styles/
│       └── globals.css     # Estilos globais
├── public/                 # Arquivos estáticos
│   ├── manifest.json       # PWA manifest
│   └── icon0.svg          # Ícone da aplicação
```

## Páginas

### Página Inicial (/)
- **Busca de jogadores** por nome e tagline
- **Status da API** em tempo real
- **Link para rankings** high tier
- **Resultados de busca** com dados do jogador

### Página de Rankings (/leagues)
- **Top 10** de cada tier (Challenger, Grandmaster, Master)
- **Filtros** por tier
- **Busca** por nome de jogador
- **Tabela responsiva** com estatísticas

## Componentes Principais

### SearchForm
- Input para nome do jogador
- Seleção de tagline
- Validação e feedback visual
- Estados de loading

### PlayerCard
- Informações do jogador encontrado
- Dados de tier e LP
- Winrate com cores dinâmicas
- Status de classificação

### RankingsTable
- Tabela responsiva com rankings
- Ordenação por LP
- Cores por tier
- Indicadores visuais (emojis)

### StatsCards
- Cards de estatísticas resumidas
- Contadores por tier
- Design glassmorphism

## Configuração

### Variáveis de Ambiente

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Scripts

```bash
npm run dev     # Desenvolvimento (porta 9000)
npm run build   # Build de produção
npm run start   # Servidor de produção
npm run lint    # Linting
```

## Design System

### Cores por Tier

```css
.tier-iron { @apply text-gray-400; }
.tier-bronze { @apply text-amber-600; }
.tier-silver { @apply text-gray-300; }
.tier-gold { @apply text-yellow-400; }
.tier-platinum { @apply text-cyan-400; }
.tier-emerald { @apply text-green-400; }
.tier-diamond { @apply text-blue-400; }
.tier-master { @apply text-purple-400; }
.tier-grandmaster { @apply text-red-400; }
.tier-challenger { @apply text-yellow-300; }
```

### Componentes Utilitários

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.button-primary {
  @apply px-6 py-3 bg-blue-600 hover:bg-blue-700 
         text-white font-semibold rounded-lg 
         transition-colors focus-ring;
}

.input-primary {
  @apply px-4 py-3 bg-white/20 border border-white/30 
         rounded-lg text-white placeholder-white/60 
         focus:outline-none focus:ring-2 focus:ring-blue-500;
}
```

## API Integration

### Cliente HTTP

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
})
```

### Endpoints Utilizados

```typescript
export const fetchChallenger = () => api.get('/league/challenger')
export const fetchGrandmaster = () => api.get('/league/grandmaster')  
export const fetchMaster = () => api.get('/league/master')
export const searchPlayer = (gameName: string, tagLine = 'BR1') => 
  api.get('/search/player', { params: { gameName, tagLine } })
export const checkHealth = () => api.get('/healthz')
```

## State Management

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

### Cache Strategy
- **Health Check**: 30 segundos
- **League Data**: 30 minutos
- **Player Search**: On-demand

## Utilitários

### Cálculo de Winrate

```typescript
export const calculateWinrate = (wins: number, losses: number) => {
  const total = wins + losses
  return total > 0 ? Math.round((wins / total) * 100) : 0
}
```

### Cores Dinâmicas

```typescript
export const getWinrateColor = (winrate: number) => {
  if (winrate >= 70) return 'text-green-400'
  if (winrate >= 60) return 'text-yellow-400'
  if (winrate >= 50) return 'text-orange-400'
  return 'text-red-400'
}
```

### Ordenação por Rank

```typescript
export const sortByRank = (a: LeagueEntry, b: LeagueEntry) => {
  const tierOrder: Record<string, number> = {
    CHALLENGER: 3, GRANDMASTER: 2, MASTER: 1
  }
  
  const tierDiff = (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0)
  if (tierDiff !== 0) return tierDiff
  
  return b.leaguePoints - a.leaguePoints
}
```

## Performance

### Otimizações

- **Code Splitting**: Automático via Next.js
- **Image Optimization**: Next.js Image component
- **CSS Optimization**: Tailwind purge
- **Bundle Analysis**: Webpack analyzer

### Métricas de Performance
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **Bundle Size**: < 500KB

## PWA Features

### Manifest

```json
{
  "name": "TFT Analytics",
  "short_name": "TFT Stats",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```


### Build Configuration

```javascript
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
  experimental: {
    optimizeCss: true,
  },
}
```

## Responsividade

### Breakpoints Tailwind
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Layout Responsivo
- **Mobile First**: Design otimizado para mobile
- **Grid System**: CSS Grid e Flexbox
- **Typography Scale**: Responsive font sizes
- **Spacing**: Consistent padding/margin

## Acessibilidade

### Características
- **Semantic HTML**: Estrutura semântica
- **ARIA Labels**: Labels apropriados
- **Focus Management**: Navegação por teclado
- **Color Contrast**: WCAG AA compliance
- **Screen Reader**: Compatibilidade

## Error Handling

### Estados de Error
- **404**: Jogador não encontrado
- **500**: Erro interno da API
- **Network**: Falha de conexão
- **Timeout**: Request timeout

### Feedback Visual
- **Loading States**: Spinners e skeletons
- **Error Messages**: Mensagens contextuais
- **Success States**: Confirmações visuais
- **Empty States**: Estados vazios informativos