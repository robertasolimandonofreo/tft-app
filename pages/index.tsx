import { useState } from 'react'
import { usePlayer } from '../src/hooks/usePlayer'

export default function Home() {
  const [puuid, setPuuid] = useState('')
  const [input, setInput] = useState('')
  const { data, isLoading, error } = usePlayer(puuid)

  return (
    <div style={{ padding: 32 }}>
      <h1>TFT Stats - Buscar Jogador</h1>
      <input
        type="text"
        placeholder="Digite o PUUID"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={() => setPuuid(input)}>Buscar</button>

      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao buscar jogador.</p>}
      {data && (
        <div style={{ marginTop: 24 }}>
          <h2>Dados do Jogador</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
