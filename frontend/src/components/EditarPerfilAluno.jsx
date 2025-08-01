import { useState, useEffect } from 'react'

export default function EditarPerfilAluno() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (!user) return

    fetch(`http://localhost:8000/users/${user.id}/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const dataNascISO = data.data_nasc?.includes('/')
          ? normalizeDate(data.data_nasc)
          : data.data_nasc || ''

        setForm({
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          genero: data.genero || '',
          data_nasc: dataNascISO,
          objetivo: data.objetivo || '',
          altura_cm: data.altura_cm?.toString() || '',
          peso_kg: data.peso_kg?.toString() || '',
        })
      })
      .catch(() => alert('Erro ao carregar perfil de aluno'))
      .finally(() => setLoading(false))
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const formatDate = (dateStr) => {
    // Se vier no formato DD/MM/AAAA, converte para YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [dia, mes, ano] = dateStr.split('/')
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    }
    return dateStr
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const normalizeDate = (str) => {
      if (str.includes('/')) {
        const [d, m, y] = str.split('/')
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
      }
      return str
    }

    const payload = {
      nome: form.nome || '',
      email: form.email || '',
      telefone: form.telefone || '',
      genero: form.genero || '',
      data_nasc: normalizeDate(form.data_nasc),
      objetivo: form.objetivo || '',
      altura_cm: form.altura_cm !== '' ? Number(form.altura_cm) : null,
      peso_kg: form.peso_kg !== '' ? Number(form.peso_kg) : null,
    }

    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}/update/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await res.text()  
        alert('Perfil atualizado com sucesso!')
      } else {
        alert(`Erro ${res.status}`)
      }
    } catch {

      alert('Erro na requisição.')
    }
  }


  if (!user)   return <p>Carregando usuário...</p>
  if (loading) return <p>Carregando perfil...</p>

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
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full p-2 rounded border bg-white"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 rounded border bg-white"
          />

          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="w-full p-2 rounded border bg-white"
          />

          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-white text-black appearance-none"
          >
            <option value="">Selecione o gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outros">Outros</option>
          </select>

          <input
            name="data_nasc"
            type="date"
            value={form.data_nasc}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-white"
          />

          <input
            name="altura_cm"
            type="number"
            min="0"
            value={form.altura_cm}
            onChange={handleChange}
            placeholder="Altura (cm)"
            className="w-full p-2 rounded border bg-white"
          />

          <input
            name="peso_kg"
            type="number"
            min="0"
            value={form.peso_kg}
            onChange={handleChange}
            placeholder="Peso (kg)"
            className="w-full p-2 rounded border bg-white"
          />

          <input
            name="objetivo"
            value={form.objetivo}
            onChange={handleChange}
            placeholder="Objetivo"
            className="w-full p-2 rounded border bg-white"
          />

          <button type="submit" className="btn w-full">
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  )
}
