import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import styles from './styles.module.css';

export default function Footer() {

    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();  

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <footer className={styles.footer}>
            
                {isAuthenticated ? (
                    <nav className={styles.nav}>
                        <ul>                               
                            <li><NavLink to="/">Tarefas</NavLink></li>
                            <li><NavLink to="usuarios">Prestadores</NavLink></li>                            
                            <li><NavLink to="/">Pesquisar</NavLink></li>
                            <li><NavLink to="/">Mais</NavLink></li>                            
                        </ul>
                    </nav>                            
                ) : null }   
            
        </footer>
    );
}
