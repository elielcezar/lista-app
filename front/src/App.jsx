import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Header from './components/header';

import Login from './pages/login';
import Home from './pages/home';
import About from './pages/about';
import NotFound from './pages/notfound';
import Contact from './pages/contact';

import ExibirImovel from './pages/imoveis/exibir';
import ListarImoveis from './pages/imoveis/listar';
import CadastrarImovel from './pages/imoveis/cadastrar';
import EditarImovel from './pages/imoveis/editar';

import Usuarios from './pages/usuarios';
import Usuario from './pages/usuario';
import CadastroUsuario from './pages/cadastro-usuario';

import Footer from './components/footer';

import ProtectedRoute from './components/protected-route';

function App() {     

    const usePageClass = () => {
        const location = useLocation();
        useEffect(() => {
          // Remover classes anteriores (opcional)
          document.body.className = '';
          // Adicionar a classe correspondente à rota atual
          if (location.pathname === '/') {
            document.body.classList.add('page-home');
          } else if (location.pathname === '/about') {
            document.body.classList.add('page-about');
          }
        }, [location]);
      };
        
    return (
        <AuthProvider>
            <Router>
                <Header />                
                
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="login" element={<Login />} />                    
                    
                    <Route path="imoveis" element={<ListarImoveis />} />                    
                    <Route path="imoveis/:codigo" element={<ExibirImovel />} />
                    <Route path="imoveis/edit/:id" element={<ProtectedRoute element={EditarImovel} />} />
                    <Route path="cadastro-imovel" element={<ProtectedRoute element={CadastrarImovel} />} />
                    
                    <Route path="usuarios" element={<ProtectedRoute element={Usuarios} />} />
                    <Route path="usuarios/*" element={<ProtectedRoute element={Usuarios} />} />
                    <Route path="usuarios/:id" element={<ProtectedRoute element={Usuario} />} />
                    <Route path="cadastro-usuario" element={<CadastroUsuario />} />
                    
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />                    
                    <Route path="*" element={<NotFound />} />                    
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;