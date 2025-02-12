import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Components
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProtectedRoute from '@/components/protected-route';
import AddBodyClass from '@/components/AddBodyClass';

// Pages
import Home from '@/pages/home';
import About from '@/pages/about';
import NotFound from '@/pages/not-found';
import Contact from '@/pages/contact';
import Extras from '@/pages/extras';

// Tarefas
import ExibirTarefa from '@/pages/Tarefas/Exibir';
import ListarTarefas from '@/pages/Tarefas/Listar';
import CadastrarTarefa from '@/pages/Tarefas/Cadastrar';
import EditarTarefa from '@/pages/Tarefas/Editar';
import TarefasArquivadas from '@/pages/Tarefas/Arquivo';

// Usuários
import Usuarios from '@/pages/usuario/Listar';
import Usuario from '@/pages/usuario/Editar';
import CadastroUsuario from '@/pages/usuario/Cadastrar';
import Login from '@/pages/usuario/Login';

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