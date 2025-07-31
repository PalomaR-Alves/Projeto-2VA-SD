import { useNavigate } from 'react-router-dom'

export default function HomeAluno({ user }) {
  const navigate = useNavigate()

  // Se não houver usuário (por exemplo, após deleção ou sem login), mostra mensagem
  if (!user) {
    return <p>Usuário não autenticado.</p>
  }

  const handleDeleteProfile = () => {
    if (!window.confirm('Tem certeza que deseja deletar seu perfil?')) {
      return
    }
    // Aqui você chamaria sua API DELETE, se houver
    localStorage.removeItem('user')
    alert('Perfil deletado com sucesso.')
    navigate('/')
  }

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        Bem-vindo(a), {user.nome}!
      </h1>

      <div className="card mx-auto">
        <h2 className="text-lg font-semibold mb-2">Ações</h2>
        <button
          className="w-full mb-2"
          onClick={() => navigate('/aluno/treinos')}
        >
          Ver meus treinos
        </button>
        <button
          className="w-full mb-2"
          onClick={() => navigate('/aluno/editar')}
        >
          Editar perfil
        </button>
        <button
          className="w-full btn-danger"
          onClick={handleDeleteProfile}
        >
          Deletar perfil
        </button>
      </div>
    </div>
  )
}
