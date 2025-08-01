// src/components/CriarTreinoExercicio.jsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function CriarTreinoExercicio({ user }) {
  const { alunoId, treinoId, exercicioId } = useParams()
  const navigate = useNavigate()
  const [series, setSeries]       = useState(3)
  const [repeticoes, setRepeticoes] = useState(10)
  const [carga, setCarga]         = useState(20)
  const [ordem, setOrdem]         = useState(1)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const modoTeste = false

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)

    if (modoTeste) {
      setTimeout(() => {
        alert(`Mock: vinculado exercício ${exercicioId} ao treino ${treinoId}`)
        navigate(`/prof/aluno/treinos/${alunoId}/${treinoId}`)
      }, 500)
      return
    }

    try {
      const payload = {
        treino_id:     Number(treinoId),
        exercicio_id:  Number(exercicioId),
        series,
        repeticoes,
        carga_kg: carga,
        ordem_no_dia: ordem
      }

      const res = await fetch('http://localhost:8001/treino-exercicio/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`)

      alert('Exercício adicionado ao treino!')
      navigate(`/prof/aluno/treinos/${alunoId}/${treinoId}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 bg-green-600 text-white py-2 px-4 rounded">
        ← Voltar
      </button>
      <h1 className="text-2xl font-bold mb-4">
        Configurar Exercicio #{exercicioId} no Treino #{treinoId}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1">Séries</label>
          <input
            type="number"
            value={series}
            onChange={e => setSeries(+e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1">Repetições</label>
          <input
            type="number"
            value={repeticoes}
            onChange={e => setRepeticoes(+e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1">Carga (kg)</label>
          <input
            type="number"
            value={carga}
            onChange={e => setCarga(+e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1">Ordem no dia</label>
          <input
            type="number"
            value={ordem}
            onChange={e => setOrdem(+e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {saving ? 'Inserindo…' : 'Inserir no Treino'}
        </button>
      </form>
    </div>
  )
}
