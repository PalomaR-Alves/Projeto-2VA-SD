// src/components/BuscarAlunoTreinos.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const modoTeste = false  // DESATIVADO para usar API real

export default function BuscarAlunoTreinos() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleVoltar = () => {
    navigate(-1)
  }

  const handleBuscar = async () => {
    setError(null)
    if (!email) {
      setError('Digite o email do aluno.')
      return
    }

    if (modoTeste) {
      setError('Modo de teste desativado.')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8000/users/email/?email=${encodeURIComponent(email)}`
      )
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const user = await res.json()

      if (user.tipo !== 'aluno') {
        setError('O e-mail informado pertence a um professor. Insira um e-mail de aluno.')
        return
      }

      navigate(`/prof/aluno/treinos/${user.id}`)
    } catch (err) {
      setError('Erro ao buscar usuário: ' + err.message)
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div
        className="main-card w-full max-w-sm"
        style={{ borderColor: '#4caf50', padding: '24px' }}
      >
        <h1 className="text-xl font-bold text-center mb-4">
          Buscar Treinos de Aluno
        </h1>

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email do aluno"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            onClick={handleBuscar}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Buscar
          </button>

          <button
            onClick={handleVoltar}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded"
          >
            ← Voltar
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
