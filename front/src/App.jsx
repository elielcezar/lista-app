import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Header from './components/header';

import Login from './pages/login';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';

import ExibirTarefa from './pages/Tarefas/Exibir';
import ListarTarefas from './pages/Tarefas/Listar';
import CadastrarTarefa from './pages/Tarefas/Cadastrar';
import EditarTarefa from './pages/Tarefas/Editar';

import TarefasArquivadas from './pages/arquivo';

import Usuarios from './pages/usuarios';
import Usuario from './pages/usuario';
import CadastroUsuario from './pages/cadastro-usuario';
import Extras from './pages/extras';

import Footer from './components/footer';

import ProtectedRoute from './components/protected-route';

function App() {     

  
    return (
        <AuthProvider>
            <Router>
                <Header />                
                
                <Routes>                    
                    <Route path="/" element={<ProtectedRoute element={Home} />} />
                    <Route path="login" element={<Login />} />                    
                    
                    <Route path="Tarefas" element={<ListarTarefas />} />                    
                    <Route path="tarefa/:id" element={<ExibirTarefa />} />
                    <Route path="tarefa/edit/:id" element={<ProtectedRoute element={EditarTarefa} />} />
                    <Route path="cadastro-tarefa" element={<ProtectedRoute element={CadastrarTarefa} />} />
                    
                    <Route path="tarefas-arquivadas" element={<ProtectedRoute element={TarefasArquivadas} />} />
                    
                    <Route path="usuarios" element={<ProtectedRoute element={Usuarios} />} />
                    <Route path="usuarios/*" element={<ProtectedRoute element={Usuarios} />} />
                    <Route path="usuarios/:id" element={<ProtectedRoute element={Usuario} />} />
                    <Route path="cadastro-usuario" element={<CadastroUsuario />} />
                    
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />                    
                    <Route path="*" element={<NotFound />} />  
                    <Route path="extras" element={<Extras />} />

                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;