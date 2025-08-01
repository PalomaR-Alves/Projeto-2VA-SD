// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { LayoutCentered } from './components/LayoutCentered'
import { LayoutDefault }  from './components/LayoutDefault'

import LoginForm                    from './components/LoginForm'
import CadastroForm                 from './components/CadastroForm'
import HomeAluno                    from './components/HomeAluno'
import HomeProfessor                from './components/HomeProfessor'
import AlunoTreinos                 from './components/VerTreinosAluno'
import EditarPerfilAluno            from './components/EditarPerfilAluno'
import EditarPerfilProfessor        from './components/EditarPerfilProfessor'
import DetalhesTreinoAluno          from './components/DetalhesTreinoAluno'

import CriarExercicio               from './components/CriarExercicio'
import VerExercicios                from './components/VerExercicios'
import BuscarAlunoTreinos           from './components/BuscarAlunoTreinos'
import ProfessorVerTreinosAluno     from './components/ProfessorVerTreinosAluno'
import ProfessorDetalhesTreino      from './components/ProfessorDetalhesTreino'
import CriarTreino                  from './components/CriarTreino'
import ProfessorAdicionarExercicio  from './components/ProfessorAdicionarExercicio'
import CriarTreinoExercicio         from './components/CriarTreinoExercicio'
import BuscarExerciciosParaTreino   from './components/BuscarExerciciosParaTreino'
import NovoTreinoExercicio          from './components/NovoTreinoExercicio'


function App() {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoadingUser(false)
  }, [])

  if (loadingUser) return <p>Carregando...</p>

  return (
    <Routes>
      {/* Login e Cadastro */}
      <Route
        path="/"
        element={
          <LayoutCentered>
            <LoginForm setUser={setUser} />
          </LayoutCentered>
        }
      />
      <Route
        path="/cadastro"
        element={
          <LayoutCentered>
            <CadastroForm />
          </LayoutCentered>
        }
      />

      {/* Área do Aluno */}
      <Route
        path="/home/aluno"
        element={
          <LayoutDefault>
            <HomeAluno user={user} />
          </LayoutDefault>
        }
      />
      <Route
        path="/aluno/treinos"
        element={
          <LayoutDefault>
            <AlunoTreinos user={user} />
          </LayoutDefault>
        }
      />
      <Route
        path="/aluno/treinos/:id"
        element={
          <LayoutDefault>
            <DetalhesTreinoAluno />
          </LayoutDefault>
        }
      />
      <Route
        path="/aluno/editar"
        element={
          <LayoutDefault>
            <EditarPerfilAluno user={user} />
          </LayoutDefault>
        }
      />

      {/* Área do Professor */}
      <Route
        path="/home/professor"
        element={
          <LayoutDefault>
            <HomeProfessor user={user} />
          </LayoutDefault>
        }
      />
      <Route
        path="/professor/editar"
        element={
          <LayoutDefault>
            <EditarPerfilProfessor user={user} setUser={setUser} />
          </LayoutDefault>
        }
      />

      {/* Exercícios do Professor */}
      <Route
        path="/prof/exercicio/criar"
        element={
          <LayoutDefault>
            <CriarExercicio user={user} />
          </LayoutDefault>
        }
      />
      <Route
        path="/prof/exercicios"
        element={
          <LayoutDefault>
            <VerExercicios />
          </LayoutDefault>
        }
      />

      {/* Fluxo “Treinos de um aluno” para o Professor */}
      <Route
        path="/prof/aluno/treinos/buscar"
        element={
          <LayoutDefault>
            <BuscarAlunoTreinos />
          </LayoutDefault>
        }
      />
      <Route
        path="/prof/aluno/treinos/:alunoId"
        element={
          <LayoutDefault>
            <ProfessorVerTreinosAluno />
          </LayoutDefault>
        }
      />
      <Route
        path="/prof/aluno/treinos/:alunoId/:treinoId"
        element={
          <LayoutDefault>
            <ProfessorDetalhesTreino />
          </LayoutDefault>
        }
      />

      {/* 1) Buscar exercício para adicionar */}
      <Route
        path="/prof/aluno/treinos/:alunoId/:treinoId/adicionar-exercicio"
        element={
          <LayoutDefault>
            <ProfessorAdicionarExercicio />
          </LayoutDefault>
        }
      />

      {/* 2) Tela de busca mockada */}
      <Route
        path="/prof/aluno/treinos/:alunoId/:treinoId/buscar-exercicio"
        element={
          <LayoutDefault>
            <BuscarExerciciosParaTreino />
          </LayoutDefault>
        }
      />

      {/* 3) Criar TreinoExercicio */}
      <Route
        path="/prof/aluno/treinos/:alunoId/:treinoId/adicionar-exercicio/:exercicioId"
        element={
          <LayoutDefault>
            <CriarTreinoExercicio user={user} />
          </LayoutDefault>
        }
      />

      {/* Criar Treino */}
      <Route
        path="/prof/treino/criar"
        element={
          <LayoutDefault>
            <CriarTreino user={user} />
          </LayoutDefault>
        }
      />
      <Route
        path="/prof/treino/:treinoId/exercicio/:exercicioId/novo"
        element={
          <LayoutDefault>
            <NovoTreinoExercicio />
          </LayoutDefault>
        }
      />

    </Routes>
  )
}

export default App
