// src/components/ProfessorAdicionarExercicio.jsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const modoTeste = true

export default function ProfessorAdicionarExercicio() {
  const { alunoId, treinoId } = useParams()
  const navigate = useNavigate()

  const [query, setQuery]       = useState('')
  const [lista, setLista]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

const handleBuscar = async () => {
  setLoading(true)
  setError(null)

  if (modoTeste) {
    const mockEx = [
      { id: 1, nome: 'Agachamento', grupo_muscular: 'Pernas', equipamento: 'Barra' },
      { id: 2, nome: 'Supino Reto', grupo_muscular: 'Peito', equipamento: 'Halteres' },
      { id: 3, nome: 'Remada', grupo_muscular: 'Costas', equipamento: 'Máquina' },
    ]
    const filtrados = mockEx.filter(e =>
      e.nome.toLowerCase().includes(query.toLowerCase())
    )

    setTimeout(() => {
      setLista(filtrados)
      setLoading(false)
    }, 300)

    return
  }

  // resto do código para requisição real
}



  return (
    <div className="p-6 max-w-md mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded w-full"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold text-center mb-4">Buscar Exercício</h1>

      <input
        type="text"
        placeholder="Nome do exercício"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full bg-white border border-gray-300 rounded px-3 py-2 mb-4"
      />

      <button
        onClick={handleBuscar}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mb-4"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {lista.length > 0 ? (
        <div
          className="border-2 border-green-600 rounded p-4 space-y-3 max-h-64 overflow-y-auto"
        >
          {lista.map(ex => (
            <div
              key={ex.id}
              className="p-3 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{ex.nome}</p>
                <p className="text-sm">Grupo: {ex.grupo_muscular}</p>
                <p className="text-sm">Equip.: {ex.equipamento}</p>
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/prof/aluno/treinos/${alunoId}/${treinoId}/adicionar-exercicio/${ex.id}`
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">Nenhum resultado.</p>
      )}
    </div>
  )
}
