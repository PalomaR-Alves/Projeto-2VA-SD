import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import CadastroForm from './components/CadastroForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/cadastro" element={<CadastroForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
