import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CriarTreino({ user }) {
  const navigate = useNavigate()
  const [emailAluno, setEmailAluno] = useState('')
  const [aluno, setAluno] = useState(null)
  const [buscaLoading, setBuscaLoading] = useState(false)
  const [buscaError, setBuscaError] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [obs, setObs] = useState('')
  const [diaSemana, setDiaSemana] = useState('') // NOVO ESTADO
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const diasSemana = [
    { value: 'segunda', label: 'Segunda-feira' },
    { value: 'terca', label: 'Terça-feira' },
    { value: 'quarta', label: 'Quarta-feira' },
    { value: 'quinta', label: 'Quinta-feira' },
    { value: 'sexta', label: 'Sexta-feira' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
  ]

  const buscarAluno = async () => {
    setBuscaError('')
    setAluno(null)
    if (!emailAluno) {
      setBuscaError('Informe o e-mail do aluno.')
      return
    }

    setBuscaLoading(true)
    try {
      const res = await fetch(
        `http://localhost:8000/users/email/?email=${encodeURIComponent(emailAluno)}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setAluno({ id: data.id, nome: data.nome })
    } catch {
      setBuscaError('Aluno não encontrado.')
    } finally {
      setBuscaLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    if (!aluno) {
      setSaveError('Busque primeiro um aluno válido.')
      return
    }
    if (!inicio || !fim || !diaSemana) {
      setSaveError('Preencha todos os campos obrigatórios.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        aluno_id: aluno.id,
        professor_id: user.id,
        dia_da_semana: diaSemana,
        data_inicio: inicio,
        data_fim: fim,
        observacoes: obs
      }
      const res = await fetch('http://localhost:8001/treinos/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      if (res.status !== 201) throw new Error(await res.text())
      const data = await res.json()
      alert(`Treino #${data.id} criado com sucesso!`)
      navigate('/home/professor')
    } catch (err) {
      setSaveError('Erro ao criar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Criar Treino</h1>

      {/* Busca por e-mail */}
      <div className="card mb-6 p-4">
        <label className="block font-medium mb-1">E-mail do Aluno</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={emailAluno}
            onChange={e => setEmailAluno(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="aluno@exemplo.com"
          />
          <button
            onClick={buscarAluno}
            disabled={buscaLoading}
            className="bg-green-600 text-white px-4 rounded"
          >
            {buscaLoading ? 'Buscando…' : 'Buscar Aluno'}
          </button>
        </div>
        {buscaError && <p className="text-red-600 mt-2">{buscaError}</p>}
        {aluno && (
          <p className="mt-2">
            <strong>Encontrado:</strong> {aluno.nome} (ID #{aluno.id})
          </p>
        )}
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="card p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Data de Início</label>
          <input
            type="date"
            value={inicio}
            onChange={e => setInicio(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Data de Fim</label>
          <input
            type="date"
            value={fim}
            onChange={e => setFim(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Dia da Semana</label>
          <select
            value={diaSemana}
            onChange={e => setDiaSemana(e.target.value)}
            className="w-full border rounded px-2 py-1"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
            }}
            required
          >
            <option value="">Selecione…</option>
            {diasSemana.map(dia => (
              <option key={dia.value} value={dia.value}>
                {dia.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Observações</label>
          <textarea
            rows={3}
            value={obs}
            onChange={e => setObs(e.target.value)}
            placeholder="Descreva o objetivo ou detalhes do treino"
            className="w-full border rounded px-2 py-1"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
            }}
          />
        </div>


        {saveError && <p className="text-red-600">{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {saving ? 'Salvando…' : 'Criar Treino'}
        </button>
      </form>
    </div>
  )
}
