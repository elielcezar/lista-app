import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Header from './components/header';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';

import ExibirTarefa from './pages/Tarefas/Exibir';
import ListarTarefas from './pages/Tarefas/Listar';
import CadastrarTarefa from './pages/Tarefas/Cadastrar';
import EditarTarefa from './pages/Tarefas/Editar';
import TarefasArquivadas from './pages/Tarefas/Arquivo';

import Usuarios from './pages/usuario/Listar';
import Usuario from './pages/usuario/Editar';
import CadastroUsuario from './pages/usuario/Cadastrar';
import Login from './pages/usuario/Login';

import Extras from './pages/extras';

import Footer from './components/Footer';

import ProtectedRoute from './components/protected-route';
import AddBodyClass from './components/AddBodyClass';

function App() {  
  
    return (
        <AuthProvider>
            <Router>
                <AddBodyClass />
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