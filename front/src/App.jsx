import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddBodyClass from '@/components/AddBodyClass';

// Pages
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Extras from '@/pages/Extras';

// Tarefas
import CadastrarTarefa from '@/pages/Tarefas/Cadastrar';
import EditarTarefa from '@/pages/Tarefas/Editar';
import TarefasArquivadas from '@/pages/Tarefas/Arquivo';

// Usuários
import Usuarios from '@/pages/Usuario/Listar';
import Usuario from '@/pages/Usuario/Editar';
import CadastroUsuario from '@/pages/Usuario/Cadastrar';
import Login from '@/pages/Usuario/Login';
import EsqueciSenha from '@/pages/Usuario/EsqueciSenha';
import RedefinirSenha from '@/pages/Usuario/RedefinirSenha';

function App() {  
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

// Novo componente para conteúdo interno
function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <AddBodyClass />
            {isAuthenticated && <Header />}
            <Routes>                    
                <Route path="/" element={<ProtectedRoute element={Home} />} />
                <Route path="login" element={<Login />} />                    
                <Route path="esqueci-senha" element={<EsqueciSenha />} />
                <Route path="redefinir-senha/:token" element={<RedefinirSenha />} />
                
                <Route path="tarefa/edit/:id" element={<ProtectedRoute element={EditarTarefa} />} />
                <Route path="cadastro-tarefa" element={<ProtectedRoute element={CadastrarTarefa} />} />
                
                <Route path="tarefas-arquivadas" element={<ProtectedRoute element={TarefasArquivadas} />} />
                
                <Route path="usuarios" element={<ProtectedRoute element={Usuarios} />} />
                <Route path="usuarios/*" element={<ProtectedRoute element={Usuarios} />} />
                <Route path="usuarios/:id" element={<ProtectedRoute element={Usuario} />} />
                <Route path="cadastro-usuario" element={<CadastroUsuario />} />     
                                     
                <Route path="*" element={<NotFound />} />  
                <Route path="extras" element={<Extras />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;