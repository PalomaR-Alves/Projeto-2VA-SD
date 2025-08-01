import { Link, useNavigate } from 'react-router-dom'
import './LoginForm.css'

function LoginForm({ setUser }) {
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const senha = e.target.password.value

    try {
      const response = await fetch('http://localhost:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Login realizado com sucesso!')

        setUser(data)
        localStorage.setItem("user", JSON.stringify(data))

        // redirecionar com base no tipo
        if (data.tipo === "aluno") {
          navigate("/home/aluno")
        } else if (data.tipo === "professor") {
          navigate("/home/professor")
        } else {
          alert("Tipo de usuário desconhecido.")
        }
      } else {
        alert(data.detail || 'Erro ao logar')
      }
    } catch (err) {
      alert('Erro na requisição')
      console.error(err)
    }
  }

  return (
    <div className="container">
      <div className="logo-container">
        <img src="/bf_logo_sfundo.png" className="logo" alt="Logo Breaking Fat" />
      </div>
      <h1>Bem-vindo(a) ao Breaking Fat!</h1>

      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>

      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}

export default LoginForm
