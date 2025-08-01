// src/components/BuscarExercicioParaTreino.jsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function BuscarExercicioParaTreino() {
  const { alunoId, treinoId } = useParams()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buscar = async () => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`http://localhost:8001/exercicios/?nome=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setLista(data)
    } catch (err) {
      setError('Erro ao buscar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold mb-4">Buscar Exercício</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Nome do exercício"
        />
        <button
          onClick={buscar}
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded"
        >
          {loading ? '…' : 'Buscar'}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {lista.map(ex => (
          <div
            key={ex.id}
            className="card mb-3 p-3 flex justify-between items-center"
          >
            <div>
              <strong>{ex.nome}</strong><br />
              <small>{ex.grupo_muscular} – {ex.equipamento}</small>
            </div>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() =>
                navigate(`/prof/aluno/treinos/${alunoId}/${treinoId}/adicionar-exercicio/${ex.id}`)
              }
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
