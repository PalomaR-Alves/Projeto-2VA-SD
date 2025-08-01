import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const modoTeste = false  // agora usando backend real

const mockTreinos = { /* ... mesmo conteúdo ... */ }

export default function DetalhesTreinoAluno() {
  const { id } = useParams()
  const [treino, setTreino] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [fbLoading, setFbLoading] = useState(false)

  useEffect(() => {
    if (modoTeste) {
      const tid = parseInt(id, 10)
      setTreino(mockTreinos[tid] || null)
      setLoading(false)
    } else {
      fetch(`http://localhost:8001/treinos/${id}/detalhes/`, {

        credentials: 'include',
      })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao buscar treino')
          return res.json()
        })
        .then(setTreino)
        .catch(() => alert('Erro ao buscar treino'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleFeedback = () => {
    if (fbLoading) return
    setFbLoading(true)
    setFeedback('')
    setTimeout(() => {
      setFeedback(
        'Este treino foi planejado para desenvolver sua resistência e força, ' +
        'trabalhando múltiplos grupos musculares e garantindo progressão segura.'
      )
      setFbLoading(false)
    }, 500)
  }

  if (loading) return <p>Carregando treino...</p>
  if (!treino) return <p>Treino não encontrado.</p>

  return (
    <div
      style={{
        padding: '24px',
        margin: '0 auto',
        maxWidth: '1024px',
        backgroundColor: '#f7fff7',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        Detalhes do Treino
      </h1>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Coluna Esquerda */}
        <div
          style={{
            width: '300px',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#ffffff',
            color: '#000000',
          }}
        >
          <p><strong>Dia da semana:</strong> {treino.dia_da_semana}</p>
          <p><strong>Início:</strong> {treino.data_inicio}</p>
          <p><strong>Fim:</strong> {treino.data_fim}</p>
          <p><strong>Observações:</strong> {treino.observacoes}</p>
          <p><strong>Criado em:</strong> {treino.criado_em}</p>
          <p><strong>Aluno:</strong> {treino.aluno_nome}</p>
          <p><strong>Professor:</strong> {treino.professor_nome}</p>
        </div>

        {/* Coluna Direita */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleFeedback}
              disabled={fbLoading}
              style={{
                backgroundColor: '#4caf50',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {fbLoading ? 'Gerando...' : 'Por que esse treino?'}
            </button>
          </div>

          <div
            style={{
              flex: 1,
              maxHeight: '450px',
              overflowY: 'auto',
              border: '3px solid #4caf50',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              padding: '16px',
              wordBreak: 'break-word',
              color: '#000000',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: '600' }}>
              Exercícios
            </h2>

            {feedback && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f0fff0',
                  border: '2px solid #4caf50',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontStyle: 'italic',
                }}
              >
                {feedback}
              </div>
            )}

            {treino.exercicios?.map(ex => (
              <div
                key={ex.id}
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <p><strong>Ordem no dia:</strong> {ex.ordem_no_dia}</p>
                <p><strong>Nome:</strong> {ex.nome}</p>
                <p><strong>Grupo muscular:</strong> {ex.grupo_muscular}</p>
                <p><strong>Equipamento:</strong> {ex.equipamento}</p>
                <p><strong>Séries:</strong> {ex.series}</p>
                <p><strong>Repetições:</strong> {ex.repeticoes}</p>
                <p><strong>Carga (kg):</strong> {ex.carga_kg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
