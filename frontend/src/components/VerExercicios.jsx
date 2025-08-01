import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerExercicios() {
  const navigate = useNavigate()
  const [exercicios, setExercicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        const res = await fetch('http://localhost:8001/exercicios/')
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        setExercicios(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExercicios()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-600 hover:underline"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold text-center mb-6">Todos os Exercícios</h1>

      {loading && <p>Carregando exercícios...</p>}
      {error && !loading && <p className="text-red-600">Erro: {error}</p>}

      {!loading && !error && (
        <div
          className="space-y-4"
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          {exercicios.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum exercício cadastrado.</p>
          ) : (
            exercicios.map(ex => (
              <div
                key={ex.id}
                className="main-card p-4"
                style={{ borderColor: '#4caf50' }}
              >
                <h2 className="text-xl font-semibold mb-2">{ex.nome}</h2>
                <p><strong>Grupo muscular:</strong> {ex.grupo_muscular}</p>
                <p><strong>Equipamento:</strong> {ex.equipamento}</p>
                {ex.descricao && (
                  <p className="mt-2"><strong>Descrição:</strong> {ex.descricao}</p>
                )}
                {ex.imagem_url && (
                  <img
                    src={ex.imagem_url}
                    alt={ex.nome}
                    className="mt-2 w-full max-w-xs rounded"
                  />
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Criado em: {new Date(ex.criado_em).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
