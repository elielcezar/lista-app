import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import './style.css';

function Header() {

    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();  

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="main-header">
                <div className="logo">
                    <NavLink to="/" end>MeuProjeto</NavLink>
                </div>
                <nav className="nav">
                    <ul>
                        <li><NavLink to="/" end>Home</NavLink></li>
                        <li><NavLink to="imoveis">Imoveis</NavLink></li> 
                        <li><NavLink to="about">Sobre</NavLink></li>                        
                        <li><NavLink to="contact">Contato</NavLink></li>
                        {isAuthenticated ? (
                            <button className="logout-button" onClick={handleLogout}>Sair</button>
                        ) : null }
                        {!isAuthenticated ? (
                            <li><NavLink to="login">Login</NavLink></li> 
                        ) : null}
                    </ul>
                </nav>
            </div>
            {isAuthenticated ? (
                <div className="admin-header">
                    <nav className="nav">
                        <ul>                   
                            <li><NavLink to="cadastro-imovel">Novo Imóvel</NavLink></li>
                            <li><NavLink to="usuarios">Usuários</NavLink></li>                            
                            <li><NavLink to="cadastro-usuario">Novo Usuário</NavLink></li>                                          
                        </ul>                        
                    </nav>
                </div>
            ) : null}            
        </header>
    );
}

export default Header;