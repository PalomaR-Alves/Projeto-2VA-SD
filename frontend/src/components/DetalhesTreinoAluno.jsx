import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const modoTeste = true

const mockTreinos = {
  1: {
    id: 1,
    dia_da_semana: 'segunda',
    inicio: '2025-08-01',
    fim: '2025-08-15',
    observacoes: 'Treino de resistência',
    criado_em: '2025-07-25 10:00:00',
    aluno_nome: 'Maria Aluna',
    professor_nome: 'Carlos Professor',
    exercicios: [
      { id: 1, nome: 'Agachamento', grupo_muscular: 'Pernas', equipamento: 'Barra', series: 4, repeticoes: 12, carga_kg: 40, ordem_no_dia: 1 },
      { id: 2, nome: 'Supino Reto', grupo_muscular: 'Peito', equipamento: 'Halteres', series: 3, repeticoes: 10, carga_kg: 20, ordem_no_dia: 2 },
    ],
  },
  2: {
    id: 2,
    dia_da_semana: 'quarta',
    inicio: '2025-09-01',
    fim: '2025-09-10',
    observacoes: 'Treino de força',
    criado_em: '2025-08-20 14:30:00',
    aluno_nome: 'João Silva',
    professor_nome: 'Ana Professor',
    exercicios: [
      { id: 3, nome: 'Levantamento Terra', grupo_muscular: 'Costas', equipamento: 'Barra', series: 3, repeticoes: 8, carga_kg: 80, ordem_no_dia: 1 },
      { id: 4, nome: 'Desenvolvimento', grupo_muscular: 'Ombros', equipamento: 'Halteres', series: 3, repeticoes: 10, carga_kg: 15, ordem_no_dia: 2 },
    ],
  },
}

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
      fetch(`http://localhost:8001/treinos/${id}/`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => setTreino(d))
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

      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Coluna Esquerda */}
        <div
          style={{
            width: '300px',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <p><strong>Dia da semana:</strong> {treino.dia_da_semana}</p>
          <p><strong>Início:</strong> {treino.inicio}</p>
          <p><strong>Fim:</strong> {treino.fim}</p>
          <p><strong>Observações:</strong> {treino.observacoes}</p>
          <p><strong>Criado em:</strong> {treino.criado_em}</p>
          <p><strong>Aluno:</strong> {treino.aluno_nome}</p>
          <p><strong>Professor:</strong> {treino.professor_nome}</p>
        </div>

        {/* Coluna Direita */}
        <div
          style={{
            flex: 1,
            minWidth: 0,           // <— permite encolher dentro do flex
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Botão */}
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

          {/* Container único para feedback + exercícios */}
          <div
            style={{
              flex: 1,
              minWidth: 0,           // também aqui para garantir
              maxWidth: '100%',
              boxSizing: 'border-box',
              maxHeight: '450px',
              overflowY: 'auto',
              overflowX: 'hidden',
              border: '3px solid #4caf50',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              padding: '16px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: '12px',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
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
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontStyle: 'italic',
                }}
              >
                {feedback}
              </div>
            )}

            {treino.exercicios.map(ex => (
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
