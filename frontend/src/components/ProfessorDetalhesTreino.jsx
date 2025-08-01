// src/components/ProfessorDetalhesTreino.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const modoTeste = false

export default function ProfessorDetalhesTreino() {
  const { alunoId, treinoId } = useParams()
  const navigate = useNavigate()

  const [treino, setTreino] = useState(null)
  const [exercicios, setExercicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [fbLoading, setFbLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTreino = async () => {
      try {
        const resTreino = await fetch(`http://localhost:8001/treinos/${treinoId}/`)
        if (!resTreino.ok) throw new Error('Erro ao buscar treino.')
        const dataTreino = await resTreino.json()

        const resExs = await fetch(`http://localhost:8001/treino-exercicio/`)
        const allExs = await resExs.json()
        const exsDoTreino = allExs.filter(te => te.treino_id === parseInt(treinoId))

        const alunoRes = await fetch(`http://localhost:8000/users/${dataTreino.aluno_id}/`)
        const alunoData = await alunoRes.json()

        const profRes = await fetch(`http://localhost:8000/users/${dataTreino.professor_id}/`)
        const profData = await profRes.json()

        const diaSemana = new Date(dataTreino.data_inicio).toLocaleDateString('pt-BR', {
          weekday: 'long', timeZone: 'UTC'
        })

        setTreino({
          ...dataTreino,
          inicio: dataTreino.data_inicio,
          fim: dataTreino.data_fim,
          criado_em: dataTreino.criado_em,
          aluno_nome: alunoData.nome,
          professor_nome: profData.nome,
          dia_da_semana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
        })

        setExercicios(exsDoTreino)
      } catch (err) {
        setError('Erro ao carregar treino.')
      } finally {
        setLoading(false)
      }
    }

    if (modoTeste) {
      const mock = {
        id: 101,
        dia_da_semana: 'segunda',
        inicio: '2025-08-01',
        fim: '2025-08-15',
        observacoes: 'Treino de resistência',
        criado_em: '2025-07-25T10:00:00',
        aluno_nome: 'Maria Aluna',
        professor_nome: 'Carlos Professor',
      }
      const mockExs = [
        { id: 1, nome: 'Agachamento', grupo_muscular: 'Pernas', equipamento: 'Barra', series: 4, repeticoes: 12, carga_kg: 40, ordem_no_dia: 1 },
        { id: 2, nome: 'Supino Reto', grupo_muscular: 'Peito', equipamento: 'Halteres', series: 3, repeticoes: 10, carga_kg: 20, ordem_no_dia: 2 },
      ]
      setTreino(mock)
      setExercicios(mockExs)
      setLoading(false)
    } else {
      fetchTreino()
    }
  }, [treinoId])

  const handleFeedback = async () => {
    setFbLoading(true)
    setFeedback('')
    try {
      const res = await fetch(`http://localhost:8001/treinos/${treinoId}/feedback/`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || 'Erro ao gerar feedback.')
      setFeedback(data.feedback || 'Feedback não disponível.')
    } catch (err) {
      setFeedback(err.message || 'Erro ao gerar feedback.')
    } finally {
      setFbLoading(false)
    }
  }

  const handleExcluir = async () => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este treino?")
    if (!confirmar) return

    try {
      const res = await fetch(`http://localhost:8001/treinos/${treinoId}/delete/`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error(await res.text())
      alert("Treino excluído com sucesso!")
      navigate(`/prof/aluno/treinos/${alunoId}`)
    } catch (err) {
      alert("Erro ao excluir treino: " + err.message)
    }
  }

  const updateEx = (idx, field, value) => {
    const copy = [...exercicios]
    copy[idx] = { ...copy[idx], [field]: value }
    setExercicios(copy)
  }

  const handleSalvar = async () => {
    try {
      await fetch(`http://localhost:8001/treinos/${treinoId}/update/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_inicio: treino.inicio,
          data_fim: treino.fim,
          observacoes: treino.observacoes
        })
      })
      alert('Salvo com sucesso.')
    } catch (err) {
      alert('Erro ao salvar alterações.')
    }
  }

  if (loading) return <p>Carregando...</p>
  if (!treino) return <p>Treino não encontrado.</p>

  return (
    <div style={{ padding: 24, maxWidth: 1024, margin: '0 auto', backgroundColor: '#f7fff7' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, backgroundColor: '#4caf50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        ← Voltar
      </button>

      <h1 style={{ textAlign: 'center', fontSize: 24, marginBottom: 24 }}>Editar Treino #{treino.id}</h1>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 300, border: '2px solid #4caf50', borderRadius: 8, padding: 16, backgroundColor: '#ffffff' }}>
          <p><strong>Dia da semana:</strong> {treino.dia_da_semana}</p>
          <p><strong>Criado em:</strong> {treino.criado_em}</p>
          <p><strong>Aluno:</strong> {treino.aluno_nome}</p>
          <p><strong>Professor:</strong> {treino.professor_nome}</p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            onClick={() => navigate(`/prof/aluno/treinos/${alunoId}/${treino.id}/buscar-exercicio`)}
            style={{ backgroundColor: '#4caf50', color: '#fff', padding: '12px', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
          >
            + Adicionar Exercício
          </button>

          <button
            onClick={handleFeedback}
            disabled={fbLoading}
            style={{ backgroundColor: '#4caf50', color: '#fff', padding: '12px', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
          >
            {fbLoading ? 'Gerando...' : 'Por que esse treino?'}
          </button>

          {feedback && (
            <div style={{ border: '2px solid #4caf50', borderRadius: 8, padding: 16, backgroundColor: '#f0fff0', fontStyle: 'italic' }}>
              {feedback}
            </div>
          )}

          <div style={{
            flex: 1,
            border: '3px solid #4caf50',
            borderRadius: 8,
            padding: 16,
            backgroundColor: '#fff',
            boxSizing: 'border-box',
            maxHeight: 500,
            overflowY: 'auto'
          }}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Início:</label>
              <input
                type="date"
                value={treino.inicio}
                onChange={e => setTreino({ ...treino, inicio: e.target.value })}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 12 }}
              />
              <label style={{ display: 'block', marginBottom: 4 }}>Fim:</label>
              <input
                type="date"
                value={treino.fim}
                onChange={e => setTreino({ ...treino, fim: e.target.value })}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 12 }}
              />
              <label style={{ display: 'block', marginBottom: 4 }}>Observações:</label>
              <textarea
                value={treino.observacoes}
                onChange={e => setTreino({ ...treino, observacoes: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18, fontWeight: 600 }}>Exercícios</h2>

            {exercicios.map((ex, idx) => (
              <div key={ex.id} style={{ marginBottom: 24, padding: 12, border: '1px solid #ccc', borderRadius: 6, backgroundColor: '#f9f9f9' }}>
                <p><strong>Ordem no dia:</strong> {ex.ordem_no_dia}</p>
                <p><strong>Exercício ID:</strong> {ex.exercicio_id}</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label>Séries:</label>
                    <input
                      type="number"
                      value={ex.series}
                      onChange={e => updateEx(idx, 'series', +e.target.value)}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Repetições:</label>
                    <input
                      type="number"
                      value={ex.repeticoes}
                      onChange={e => updateEx(idx, 'repeticoes', +e.target.value)}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Carga (kg):</label>
                    <input
                      type="number"
                      value={ex.carga_kg}
                      onChange={e => updateEx(idx, 'carga_kg', +e.target.value)}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSalvar}
              style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', padding: '12px', fontSize: 16, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              Salvar alterações
            </button>

            <button
              onClick={handleExcluir}
              style={{ width: '100%', backgroundColor: '#e53935', color: '#fff', padding: '12px', fontSize: 16, border: 'none', borderRadius: 8, marginTop: 12, cursor: 'pointer' }}
            >
              Excluir Treino
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
