import { useState, useEffect } from 'react'

const modoTeste = true

export default function EditarPerfilAluno() {
  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    genero: '',
    data_nasc: '',
    objetivo: '',
    altura_cm: '',
    peso_kg: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    if (modoTeste) {
      setForm({
        nome:      user.nome || '',
        email:     user.email || '',
        telefone:  user.telefone || '',
        genero:    user.genero || '',
        data_nasc: user.data_nasc || '',
        objetivo:  user.objetivo || '',
        altura_cm: user.altura_cm?.toString() || '',
        peso_kg:   user.peso_kg?.toString() || '',
      })
      setLoading(false)
      return
    }

    fetch(`http://localhost:8000/users/${user.id}/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setForm({
          nome:      data.nome || '',
          email:     data.email || '',
          telefone:  data.telefone || '',
          genero:    data.genero || '',
          data_nasc: data.data_nasc || '',
          objetivo:  data.objetivo || '',
          altura_cm: data.altura_cm?.toString() || '',
          peso_kg:   data.peso_kg?.toString() || '',
        })
      })
      .catch(() => alert('Erro ao carregar perfil de aluno'))
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
          nome:      form.nome,
          email:     form.email,
          telefone:  form.telefone,
          genero:    form.genero,
          data_nasc: form.data_nasc,
          objetivo:  form.objetivo,
          altura_cm: Number(form.altura_cm),
          peso_kg:   Number(form.peso_kg),
        }),
      })
      alert(res.ok ? 'Perfil de aluno atualizado!' : 'Erro ao atualizar.')
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
          Editar Perfil do Aluno
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
            name="data_nasc"
            type="date"
            defaultValue={form.data_nasc}
            onChange={handleChange}
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="altura_cm"
            type="number"
            min="0"
            defaultValue={form.altura_cm}
            onChange={handleChange}
            placeholder="Altura (cm)"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="peso_kg"
            type="number"
            min="0"
            defaultValue={form.peso_kg}
            onChange={handleChange}
            placeholder="Peso (kg)"
            style={{ backgroundColor: '#fff' }}
            className="w-full p-2 rounded border"
          />

          <input
            name="objetivo"
            defaultValue={form.objetivo}
            onChange={handleChange}
            placeholder="Objetivo"
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
