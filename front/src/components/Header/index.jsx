import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { IoMdExit } from "react-icons/io";
import styles from './styles.module.css'

function Header() {
    
    const { user, logout } = useAuth();
    const location = useLocation();
    //const isLoginPage = location.pathname === '/login' || location.pathname === '/cadastro-usuario';
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user) {
            setUserName(user.name);
        }        
    }, [user]);

    const handleLogout = () => {
        logout();       
        navigate('/login');
      };

    return (
        <header className={styles.header}>            
            <p className={styles.hello}>
                <NavLink to="/">
                    Olá {userName}!
                </NavLink>
            </p>                        
            
            <a onClick={handleLogout} className={styles.exit}>
                <IoMdExit className={styles.exit} /> Sair
            </a>            
        </header>
    );
}

export default Header;