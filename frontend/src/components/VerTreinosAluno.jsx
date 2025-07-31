import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const modoTeste = true
const dadosMockados = [
  { id: 1, inicio: "2025-08-01", fim: "2025-08-15", observacoes: "Resistência" },
  { id: 2, inicio: "2025-08-16", fim: "2025-08-31", observacoes: "Hipertrofia" },
  { id: 3, inicio: "2025-09-01", fim: "2025-09-15", observacoes: "Funcional" },
]

export default function VerTreinosAluno({ user }) {
  const [treinos, setTreinos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (modoTeste) {
      setTreinos(dadosMockados)
      setLoading(false)
    } else if (user?.id) {
      fetch(`http://localhost:8000/treinos/aluno/${user.id}/`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => setTreinos(Array.isArray(d) ? d : d.treinos))
        .catch(() => alert("Erro ao buscar treinos"))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (!user)   return <p>Carregando usuário...</p>
  if (loading) return <p>Carregando treinos...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Seus treinos</h1>
      <div
        className="card mx-auto"
        style={{ maxHeight: 400, overflowY: 'auto' }}
      >
        {treinos.length === 0
          ? <p className="text-center text-gray-500">Nenhum treino.</p>
          : treinos.map(t => (
            <div
              key={t.id}
              onClick={() => navigate(`/aluno/treinos/${t.id}`)}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#f9f9f9',
                cursor: 'pointer',
                marginBottom: 8,
              }}
            >
              <p><strong>Início:</strong> {t.inicio}</p>
              <p><strong>Fim:</strong> {t.fim}</p>
              <p><strong>Observações:</strong> {t.observacoes}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
