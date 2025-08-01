import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CriarExercicio({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    grupo_muscular: '',
    equipamento: '',
    descricao: '',
    imagem_url: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!user?.id) {
      alert('Professor não autenticado.')
      return
    }

    setLoading(true)
    try {
      const payload = { ...form, professor_id: user.id }

      const res = await fetch('http://localhost:8001/exercicios/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 201) {
        const data = await res.json()
        alert(`Exercício "${data.nome}" criado com sucesso!`)
        navigate('/home/professor')
      } else {
        const errorText = await res.text()
        alert('Erro ao criar exercício:\n' + errorText)
      }
    } catch (err) {
      alert('Erro na requisição: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="p-4 flex justify-center items-start"
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      <div
        className="main-card w-full max-w-md"
        style={{ maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}
      >
        <h1 className="text-xl font-bold text-center mb-4">Criar Exercício</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="nome" className="mb-1 font-medium">Nome</label>
            <input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="grupo_muscular" className="mb-1 font-medium">Grupo Muscular</label>
            <input
              id="grupo_muscular"
              name="grupo_muscular"
              value={form.grupo_muscular}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="equipamento" className="mb-1 font-medium">Equipamento</label>
            <input
              id="equipamento"
              name="equipamento"
              value={form.equipamento}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 rounded px-2 py-1"
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col">
            <label htmlFor="descricao" className="mb-1 font-medium">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              required
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '1rem',
                lineHeight: 1.5,
              }}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="imagem_url" className="mb-1 font-medium">URL da Imagem</label>
            <input
              id="imagem_url"
              name="imagem_url"
              value={form.imagem_url}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            {loading ? 'Criando...' : 'Criar Exercício'}
          </button>
        </form>
      </div>
    </div>
  )
}
