import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const modoTeste = false

// Mock de treinos para testes
const mockTreinos = [
  {
    id: 101,
    dia_da_semana: 'segunda',
    data_inicio: '2025-08-01',
    data_fim: '2025-08-15',
    observacoes: 'Treino de resistência (mock).'
  },
  {
    id: 102,
    dia_da_semana: 'quarta',
    data_inicio: '2025-09-01',
    data_fim: '2025-09-10',
    observacoes: 'Treino de força (mock).'
  }
]

export default function ProfessorVerTreinosAluno() {
  const { alunoId } = useParams()
  const navigate = useNavigate()
  const [treinos, setTreinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (modoTeste) {
      setTreinos(mockTreinos)
      setLoading(false)
      return
    }

    const fetchTreinos = async () => {
      try {
        const res = await fetch(`http://localhost:8001/treinos/aluno/${alunoId}/`)
        if (!res.ok) throw new Error(`Erro: ${res.status}`)
        const data = await res.json()
        setTreinos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTreinos()
  }, [alunoId])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold text-center mb-6">
        Treinos do Aluno #{alunoId}
      </h1>

      {loading && <p>Carregando treinos…</p>}
      {!loading && error && (
        <p className="text-red-600">Erro: {error}</p>
      )}

      {!loading && !error && (
        <div
          className="space-y-4"
          style={{
            maxHeight: '60vh',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          {treinos.map(treino => (
            <div
              key={treino.id}
              className="main-card p-4 cursor-pointer hover:shadow-md"
              onClick={() =>
                navigate(`/prof/aluno/treinos/${alunoId}/${treino.id}`)
              }
            >
              <h2 className="text-xl font-semibold mb-2">
                {treino.dia_da_semana.charAt(0).toUpperCase() + treino.dia_da_semana.slice(1)}
              </h2>
              <p><strong>Início:</strong> {treino.data_inicio}</p>
              <p><strong>Fim:</strong> {treino.data_fim}</p>
              <p><strong>Observações:</strong> {treino.observacoes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
