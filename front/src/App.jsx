import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Components
import Header from '@/components/header';
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

function App() {  
    return (
        <AuthProvider>
            <Router>
                <AddBodyClass />
                <Header />      
                <Routes>                    
                    <Route path="/" element={<ProtectedRoute element={Home} />} />
                    <Route path="login" element={<Login />} />                    
                    
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
        </AuthProvider>
    );
}

export default App;