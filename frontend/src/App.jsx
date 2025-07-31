// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { LayoutCentered } from './components/LayoutCentered'
import { LayoutDefault }  from './components/LayoutDefault'

import LoginForm             from './components/LoginForm'
import CadastroForm          from './components/CadastroForm'
import HomeAluno             from './components/HomeAluno'
import HomeProfessor         from './components/HomeProfessor'
import AlunoTreinos          from './components/VerTreinosAluno'
import EditarPerfilAluno     from './components/EditarPerfilAluno'
import EditarPerfilProfessor from './components/EditarPerfilProfessor'
import DetalhesTreinoAluno   from './components/DetalhesTreinoAluno'

import CriarExercicio        from './components/CriarExercicio'
// import EditarExercicio   from './components/EditarExercicio'
// import DeletarExercicio  from './components/DeletarExercicio'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <Routes>
      {/* Login e Cadastro */}
      <Route path="/" element={
        <LayoutCentered>
          <LoginForm setUser={setUser} />
        </LayoutCentered>
      }/>
      <Route path="/cadastro" element={
        <LayoutCentered>
          <CadastroForm />
        </LayoutCentered>
      }/>

      {/* Área do Aluno */}
      <Route path="/home/aluno" element={
        <LayoutDefault>
          <HomeAluno user={user} />
        </LayoutDefault>
      }/>
      <Route path="/aluno/treinos" element={
        <LayoutDefault>
          <AlunoTreinos user={user} />
        </LayoutDefault>
      }/>
      <Route path="/aluno/treinos/:id" element={
        <LayoutDefault>
          <DetalhesTreinoAluno />
        </LayoutDefault>
      }/>
      <Route path="/aluno/editar" element={
        <LayoutDefault>
          <EditarPerfilAluno user={user} />
        </LayoutDefault>
      }/>

      {/* Área do Professor */}
      <Route path="/home/professor" element={
        <LayoutDefault>
          <HomeProfessor user={user} />
        </LayoutDefault>
      }/>
      <Route path="/professor/editar" element={
        <LayoutDefault>
          <EditarPerfilProfessor user={user} />
        </LayoutDefault>
      }/>

      {/* Exercícios do Professor */}
      <Route path="/prof/exercicio/criar" element={
        <LayoutDefault>
          <CriarExercicio user={user} />
        </LayoutDefault>
      }/>
      {/*
      <Route path="/prof/exercicio/editar" element={
        <LayoutDefault>
          <EditarExercicio user={user} />
        </LayoutDefault>
      }/>
      <Route path="/prof/exercicio/deletar" element={
        <LayoutDefault>
          <DeletarExercicio user={user} />
        </LayoutDefault>
      }/>
      */}
    </Routes>
  )
}

export default App
