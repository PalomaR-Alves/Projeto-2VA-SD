import { useState, useEffect } from 'react'

export default function EditarPerfilProfessor() {
  const [user, setUser] = useState(null)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    genero: '',
    cref: '',
    bio_profissional: '',
  })

  const [loading, setLoading] = useState(true)

  // Recuperar user do localStorage apenas uma vez
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  // Carregar dados do perfil
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8000/users/${user.id}/`, {
      method: 'GET',
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setForm({
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          genero: data.genero || '',
          cref: data.cref || '',
          bio_profissional: data.bio_profissional || '',
        })
      })
      .catch(() => alert('Erro ao carregar perfil de professor'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user)   return <p>Carregando usuário...</p>
  if (loading) return <p>Carregando perfil...</p>

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Perfil de professor atualizado com sucesso!')
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        alert(`Erro: ${res.status} - ${data.detail || 'Erro ao atualizar.'}`)
      }
    } catch (err) {
      console.error(err)
      alert('Erro na requisição.')
    }
  }



  return (
    <div
      className="p-6 max-w-md mx-auto"
      style={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <div className="card">
        <h1 className="text-xl font-bold text-center mb-4">
          Editar Perfil do Professor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            style={{ backgroundColor: '#fff', color: '#000' }}
            className="w-full p-2 rounded border"
          >
            <option value="">Selecione o gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outros">Outros</option>
          </select>

          <input
            name="cref"
            value={form.cref}
            onChange={handleChange}
            placeholder="CREF"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <textarea
            name="bio_profissional"
            value={form.bio_profissional}
            onChange={handleChange}
            placeholder="Bio profissional"
            rows={4}
            style={{ backgroundColor: '#fff', color: '#000' }}
            className="w-full p-2 rounded border"
          />

          <button type="submit" className="btn w-full">
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  )
}
