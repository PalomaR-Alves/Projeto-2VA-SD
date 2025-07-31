import { useState, useEffect } from 'react'

const modoTeste = true

export default function EditarPerfilProfessor() {
  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    genero: '',
    cref: '',
    bio_profissional: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    if (modoTeste) {
      setForm({
        nome:             user.nome || '',
        email:            user.email || '',
        telefone:         user.telefone || '',
        genero:           user.genero || '',
        cref:             user.cref || '',
        bio_profissional: user.bio_profissional || '',
      })
      setLoading(false)
      return
    }

    fetch(`http://localhost:8000/users/${user.id}/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setForm({
          nome:             data.nome || '',
          email:            data.email || '',
          telefone:         data.telefone || '',
          genero:           data.genero || '',
          cref:             data.cref || '',
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
      const res = await fetch(`http://localhost:8000/users/${user.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:             form.nome,
          email:            form.email,
          telefone:         form.telefone,
          genero:           form.genero,
          cref:             form.cref,
          bio_profissional: form.bio_profissional,
        }),
      })
      alert(res.ok ? 'Perfil de professor atualizado!' : 'Erro ao atualizar.')
    } catch {
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
            defaultValue={form.nome}
            onChange={handleChange}
            placeholder="Nome"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="email"
            defaultValue={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="telefone"
            defaultValue={form.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <select
            name="genero"
            defaultValue={form.genero}
            onChange={handleChange}
            style={{ backgroundColor: '#fff', color: '#000' }}
            className="w-full p-2 rounded border"
            >
            <option value="" style={{ color: '#000' }}>Selecione o gênero</option>
            <option value="masculino" style={{ color: '#000' }}>Masculino</option>
            <option value="feminino"  style={{ color: '#000' }}>Feminino</option>
            <option value="outros"    style={{ color: '#000' }}>Outros</option>
          </select>


          <input
            name="cref"
            defaultValue={form.cref}
            onChange={handleChange}
            placeholder="CREF"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <textarea
            name="bio_profissional"
            defaultValue={form.bio_profissional}
            onChange={handleChange}
            placeholder="Bio profissional"
            rows={4}
            style={{ backgroundColor: '#fff' }}
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
