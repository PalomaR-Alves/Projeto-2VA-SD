import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroForm.css';

export default function CadastroForm() {
  const [tipo, setTipo] = useState('aluno');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      nome: form.nome.value,
      email: form.email.value,
      senha: form.senha.value,
      telefone: form.telefone.value,
      genero: form.genero.value,
      tipo: tipo,
      is_ativo: true
    };

    if (form.senha.value !== form.confirmarSenha.value) {
      alert('As senhas não coincidem.');
      return;
    }

    if (tipo === 'aluno') {
      payload.data_nasc = form.data_nasc.value;
      payload.objetivo = form.objetivo.value;
      payload.altura_cm = parseInt(form.altura_cm.value);
      payload.peso_kg = parseFloat(form.peso_kg.value);
    } else if (tipo === 'professor') {
      payload.cref = form.cref.value;
      payload.bio_profissional = form.bio_profissional.value;
    }

    try {
      const response = await fetch('http://localhost:8000/users/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        navigate('/');
      } else {
        const texto = await response.text();
        alert(`Erro no cadastro: ${texto}`);
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
      console.error(err);
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <h2 className="cadastro-titulo">
          Cadastro de {tipo === 'aluno' ? 'Aluno' : 'Professor'}
        </h2>

        <select
          name="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
        </select>

        <input name="nome" placeholder="Nome completo" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="senha" type="password" placeholder="Senha" required />
        <input
          name="confirmarSenha"
          type="password"
          placeholder="Confirmar senha"
          required
        />
        <input name="telefone" placeholder="Telefone" required />

        <select name="genero" required>
          <option value="">Selecione o gênero</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outros">Outros</option>
        </select>

        {tipo === 'aluno' && (
          <>
            <div className="campo-container">
              <label htmlFor="data_nasc" className="campo-label">
                Data de Nascimento
              </label>
              <input
                id="data_nasc"
                name="data_nasc"
                type="date"
                required
                className="campo-input"
              />
            </div>

            <input name="objetivo" placeholder="Objetivo" />
            <input
              name="altura_cm"
              type="number"
              placeholder="Altura (cm)"
              required
            />
            <input
              name="peso_kg"
              type="number"
              step="0.1"
              placeholder="Peso (kg)"
              required
            />
          </>
        )}

        {tipo === 'professor' && (
          <>
            <input name="cref" placeholder="CREF" required />
            <textarea
              name="bio_profissional"
              placeholder="Biografia profissional"
              required
            />
          </>
        )}

        <button type="submit" className="btn-submit">
          Cadastrar
        </button>
        <p className="link-back">
          Já tem conta?{' '}
          <span onClick={() => navigate('/')} className="link-voltar">
            Voltar ao login
          </span>
        </p>
      </form>
    </div>
  );
}
