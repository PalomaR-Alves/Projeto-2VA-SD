import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomeProfessor({ user }) {
  const navigate = useNavigate()
  const [exercicios, setExercicios] = useState(null)
  const [exLoading, setExLoading] = useState(false)
  const [exError, setExError] = useState(null)

  if (!user) {
    return <p>Usuário não autenticado.</p>
  }

  const handleDeleteProfile = () => {
    if (!window.confirm('Tem certeza que deseja deletar seu perfil?')) return
    localStorage.removeItem('user')
    alert('Perfil deletado com sucesso.')
    navigate('/')
  }

  const handleViewExercicios = async () => {
    setExLoading(true)
    setExError(null)
    try {
      const res = await fetch('http://localhost:8001/exercicios/')
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setExercicios(data)
    } catch (err) {
      setExError(err.message)
    } finally {
      setExLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Bem-vindo(a), professor(a) {user.nome}!
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}
      >
        {/* Perfil */}
        <div className="card" style={{ flex: '0 0 calc((100% - 32px) / 3)', minWidth: '180px' }}>
          <h2 className="text-lg font-semibold mb-2">Perfil</h2>
          <button className="w-full mb-2" onClick={() => navigate('/professor/editar')}>
            Editar perfil
          </button>
          <button className="w-full btn-danger" onClick={handleDeleteProfile}>
            Deletar perfil
          </button>
        </div>

        {/* Exercícios */}
        <div className="card" style={{ flex: '0 0 calc((100% - 32px) / 3)', minWidth: '180px' }}>
          <h2 className="text-lg font-semibold mb-2">Exercícios</h2>
          <button className="w-full mb-2" onClick={() => navigate('/prof/exercicio/criar')}>
            Criar exercício
          </button>
          <button className="w-full mb-2 btn-secondary" onClick={handleViewExercicios}>
            Ver todos os exercícios
          </button>

          {/* lista de exercícios */}
          {exLoading && <p>Carregando exercícios...</p>}
          {exError && <p style={{ color: 'red' }}>Erro: {exError}</p>}
          {exercicios && (
            <ul className="mt-4 space-y-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {exercicios.map(ex => (
                <li key={ex.id} className="p-2 border rounded">
                  <strong>{ex.nome}</strong> — {ex.grupo_muscular} ({ex.equipamento})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Treinos */}
        <div className="card" style={{ flex: '0 0 calc((100% - 32px) / 3)', minWidth: '180px' }}>
          <h2 className="text-lg font-semibold mb-2">Treinos</h2>
          <button className="w-full mb-2" onClick={() => navigate('/prof/treino/criar')}>
            Criar treino
          </button>
        </div>
      </div>
    </div>
  )
}
